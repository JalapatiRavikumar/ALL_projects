from __future__ import annotations

import os
import re
import tempfile
from typing import Any

import yt_dlp

from .config import get_settings
from .models import VideoMetadata


def detect_platform(url: str) -> str:
    u = url.lower()
    if "youtube.com" in u or "youtu.be" in u:
        return "youtube"
    if "instagram.com" in u:
        return "instagram"
    return "unknown"


def _safe_int(value: Any) -> int | None:
    try:
        return int(value) if value is not None else None
    except (TypeError, ValueError):
        return None


def _extract_hashtags(*texts: str | None) -> list[str]:
    seen: set[str] = set()
    found: list[str] = []
    for t in texts:
        if not t:
            continue
        for tag in re.findall(r"#(\w+)", t):
            if tag.lower() not in seen:
                seen.add(tag.lower())
                found.append(tag)
    return found


def _auth_opts(opts: dict) -> dict:
    settings = get_settings()
    if settings.cookies_from_browser:
        opts["cookiesfrombrowser"] = (settings.cookies_from_browser,)
    if settings.cookies_file:
        opts["cookiefile"] = settings.cookies_file
    return opts


def _ydl_opts(skip_download: bool = True) -> dict:
    opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": skip_download,
        "noplaylist": True,
        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0 Safari/537.36"
            )
        },
    }
    return _auth_opts(opts)


def _fetch_info(url: str) -> dict:
    with yt_dlp.YoutubeDL(_ydl_opts()) as ydl:
        return ydl.extract_info(url, download=False)


def _build_metadata(video_id: str, url: str, platform: str, info: dict) -> VideoMetadata:
    title = info.get("title") or info.get("fulltitle")
    description = info.get("description") or ""
    creator = info.get("uploader") or info.get("channel") or info.get("uploader_id")
    views = _safe_int(info.get("view_count"))
    likes = _safe_int(info.get("like_count"))
    comments = _safe_int(info.get("comment_count"))

    raw_date = info.get("upload_date")
    upload_date = None
    if raw_date and len(str(raw_date)) == 8:
        s = str(raw_date)
        upload_date = f"{s[:4]}-{s[4:6]}-{s[6:]}"

    tags = info.get("tags") or []
    hashtags = list(dict.fromkeys([*tags, *_extract_hashtags(title, description)]))

    engagement_rate = None
    if views and views > 0:
        engagement_rate = round(((likes or 0) + (comments or 0)) / views * 100, 4)

    return VideoMetadata(
        video_id=video_id,  # type: ignore[arg-type]
        platform=platform,  # type: ignore[arg-type]
        source_url=url,
        native_id=info.get("id"),
        title=title,
        creator=creator,
        creator_url=info.get("channel_url") or info.get("uploader_url"),
        follower_count=_safe_int(
            info.get("channel_follower_count") or info.get("uploader_follower_count")
        ),
        views=views,
        likes=likes,
        comments=comments,
        upload_date=upload_date,
        duration_seconds=_safe_int(info.get("duration")),
        hashtags=hashtags,
        thumbnail=info.get("thumbnail"),
        engagement_rate=engagement_rate,
    )


def _youtube_captions(native_id: str) -> list[dict] | None:
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        api = YouTubeTranscriptApi()
        fetched = api.fetch(native_id, languages=["en", "en-US", "en-GB"])
        segs = [
            {"text": s.text.strip(), "start": float(s.start), "end": float(s.start) + float(s.duration)}
            for s in fetched
            if s.text.strip() and s.text.strip() != "[Music]"
        ]
        return segs or None
    except Exception:
        return None


def _whisper_fallback(url: str) -> list[dict] | None:
    settings = get_settings()
    if not settings.whisper_enabled:
        return None

    os.makedirs(settings.cache_dir, exist_ok=True)
    tmp = tempfile.mkdtemp(dir=settings.cache_dir)
    opts = _ydl_opts(skip_download=False)
    opts["format"] = "bestaudio/best"
    opts["outtmpl"] = os.path.join(tmp, "audio.%(ext)s")

    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.extract_info(url, download=True)
        files = os.listdir(tmp)
        if not files:
            return None
        audio_file = os.path.join(tmp, files[0])
        from . import transcription
        return transcription.transcribe(audio_file) or None
    except Exception:
        return None


MAX_WHISPER_SECS = 300


def _get_transcript(meta: VideoMetadata) -> tuple[list[dict], str]:
    if meta.platform == "youtube" and meta.native_id:
        segs = _youtube_captions(meta.native_id)
        if segs:
            return segs, "captions"

    if (meta.duration_seconds or 0) > MAX_WHISPER_SECS:
        return [], "skipped_too_long"

    segs = _whisper_fallback(meta.source_url)
    if segs:
        return segs, "whisper"

    return [], "none"


def ingest_video(video_id: str, url: str) -> tuple[VideoMetadata, list[dict], list[str]]:
    warnings: list[str] = []
    platform = detect_platform(url)

    try:
        info = _fetch_info(url)
    except Exception as exc:
        warnings.append(f"Video {video_id}: metadata extraction failed ({type(exc).__name__}: {exc})")
        info = {}

    meta = _build_metadata(video_id, url, platform, info)
    segments, source = _get_transcript(meta)
    meta.transcript_source = source
    meta.transcript_chars = sum(len(s["text"]) for s in segments)

    if source == "none":
        warnings.append(f"Video {video_id}: no transcript found (no captions, STT failed)")
    elif source == "skipped_too_long":
        dur = meta.duration_seconds or 0
        warnings.append(
            f"Video {video_id}: no captions and video is {dur // 60}m {dur % 60}s "
            f"— Whisper skipped (limit 5 min)"
        )

    return meta, segments, warnings
