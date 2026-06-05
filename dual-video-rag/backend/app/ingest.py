"""Dynamic ingestion of YouTube + Instagram videos.

Pipeline per URL:
  1. Detect platform from the URL.
  2. Pull metadata with yt-dlp (results are cached for 1 hour per URL).
  3. Get a transcript via the cheapest available source, in order:
        a) YouTube: youtube-transcript-api (free captions, fastest)
        b) Fallback: download audio + local Whisper STT (skipped for >5 min videos)
  4. Compute engagement rate.

Everything is dynamic — nothing about a specific video is hard-coded.
"""
from __future__ import annotations

import os
import re
import tempfile
import threading
import time
from typing import Any

import yt_dlp

from .config import get_settings
from .models import VideoMetadata


# --------------------------------------------------------------------------- #
# URL-level metadata cache (avoids re-fetching the same video twice per hour)
# --------------------------------------------------------------------------- #
_CACHE_TTL = 3600  # seconds
_meta_cache: dict[str, tuple[float, dict]] = {}  # url -> (timestamp, info_dict)
_cache_lock = threading.Lock()


def _cached_ydl_extract(url: str) -> dict[str, Any]:
    now = time.monotonic()
    with _cache_lock:
        if url in _meta_cache:
            ts, cached = _meta_cache[url]
            if now - ts < _CACHE_TTL:
                return cached
    result = _ydl_extract(url)
    with _cache_lock:
        _meta_cache[url] = (time.monotonic(), result)
    return result


# --------------------------------------------------------------------------- #
# Platform detection
# --------------------------------------------------------------------------- #
def detect_platform(url: str) -> str:
    u = url.lower()
    if "youtube.com" in u or "youtu.be" in u:
        return "youtube"
    if "instagram.com" in u:
        return "instagram"
    return "unknown"


def _extract_hashtags(*texts: str | None) -> list[str]:
    found: list[str] = []
    seen = set()
    for t in texts:
        if not t:
            continue
        for tag in re.findall(r"#(\w+)", t):
            low = tag.lower()
            if low not in seen:
                seen.add(low)
                found.append(tag)
    return found


def _safe_int(value: Any) -> int | None:
    try:
        if value is None:
            return None
        return int(value)
    except (TypeError, ValueError):
        return None


# --------------------------------------------------------------------------- #
# Metadata via yt-dlp
# --------------------------------------------------------------------------- #
def _apply_auth_opts(opts: dict[str, Any]) -> dict[str, Any]:
    """Inject cookie-based auth so Instagram (and age-gated YT) work.

    Cookies are read locally by yt-dlp and never logged or transmitted anywhere
    except to the originating platform.
    """
    settings = get_settings()
    if settings.cookies_from_browser:
        # yt-dlp expects a tuple: (browser, profile, keyring, container).
        opts["cookiesfrombrowser"] = (settings.cookies_from_browser,)
    if settings.cookies_file:
        opts["cookiefile"] = settings.cookies_file
    return opts


def _ydl_extract(url: str) -> dict[str, Any]:
    opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "noplaylist": True,
        # Suppress JS runtime missing warning (we use android API fallback which is fine)
        "extractor_args": {"youtube": {"player_client": ["android"]}},
        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0 Safari/537.36"
            )
        },
    }
    _apply_auth_opts(opts)
    with yt_dlp.YoutubeDL(opts) as ydl:
        return ydl.extract_info(url, download=False)


def _build_metadata(video_id: str, url: str, platform: str, info: dict) -> VideoMetadata:
    title = info.get("title") or info.get("fulltitle")
    description = info.get("description") or ""
    creator = (
        info.get("uploader")
        or info.get("channel")
        or info.get("uploader_id")
    )
    follower_count = _safe_int(
        info.get("channel_follower_count") or info.get("uploader_follower_count")
    )
    views = _safe_int(info.get("view_count"))
    likes = _safe_int(info.get("like_count"))
    comments = _safe_int(info.get("comment_count"))

    # yt-dlp gives upload_date as YYYYMMDD; normalize to YYYY-MM-DD.
    raw_date = info.get("upload_date")
    upload_date = None
    if raw_date and len(str(raw_date)) == 8:
        s = str(raw_date)
        upload_date = f"{s[0:4]}-{s[4:6]}-{s[6:8]}"

    duration = _safe_int(info.get("duration"))

    tags = info.get("tags") or []
    hashtags = list(dict.fromkeys([*tags, *_extract_hashtags(title, description)]))

    engagement_rate = None
    if views and views > 0:
        engagement_rate = round(((likes or 0) + (comments or 0)) / views * 100, 4)

    return VideoMetadata(
        video_id=video_id,
        platform=platform,  # type: ignore[arg-type]
        source_url=url,
        native_id=info.get("id"),
        title=title,
        creator=creator,
        creator_url=info.get("channel_url") or info.get("uploader_url"),
        follower_count=follower_count,
        views=views,
        likes=likes,
        comments=comments,
        upload_date=upload_date,
        duration_seconds=duration,
        hashtags=hashtags,
        thumbnail=info.get("thumbnail"),
        engagement_rate=engagement_rate,
    )


# --------------------------------------------------------------------------- #
# Transcript sources
# --------------------------------------------------------------------------- #
def _youtube_caption_transcript(native_id: str) -> list[dict] | None:
    try:
        # pyrefly: ignore [missing-import]
        from youtube_transcript_api import YouTubeTranscriptApi

        api = YouTubeTranscriptApi()
        fetched = api.fetch(native_id, languages=["en", "en-US", "en-GB"])
        segments = []
        for snippet in fetched:
            text = (snippet.text or "").strip()
            if text and text != "[Music]":
                segments.append(
                    {
                        "text": text,
                        "start": float(snippet.start),
                        "end": float(snippet.start) + float(snippet.duration),
                    }
                )
        return segments or None
    except Exception:
        return None


def _whisper_transcript(url: str, cache_dir: str) -> list[dict] | None:
    """Download bestaudio and transcribe locally."""
    settings = get_settings()
    if not settings.whisper_enabled:
        return None
    os.makedirs(cache_dir, exist_ok=True)
    tmp = tempfile.mkdtemp(dir=cache_dir)
    outtmpl = os.path.join(tmp, "audio.%(ext)s")
    opts = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "format": "bestaudio/best",
        "outtmpl": outtmpl,
        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0 Safari/537.36"
            )
        },
    }
    _apply_auth_opts(opts)
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.extract_info(url, download=True)
        audio_file = None
        for name in os.listdir(tmp):
            audio_file = os.path.join(tmp, name)
            break
        if not audio_file:
            return None
        from . import transcription

        return transcription.transcribe(audio_file) or None
    except Exception:
        return None


MAX_WHISPER_DURATION_S = 300  # 5 minutes — skip STT for longer videos on CPU


def get_transcript(meta: VideoMetadata) -> tuple[list[dict], str]:
    """Return (segments, source_label)."""
    settings = get_settings()

    # 1) YouTube captions (cheapest, fastest)
    if meta.platform == "youtube" and meta.native_id:
        segs = _youtube_caption_transcript(meta.native_id)
        if segs:
            return segs, "captions"

    # 2) Whisper fallback — only for short videos to avoid multi-minute CPU hangs.
    #    Videos > MAX_WHISPER_DURATION_S (5 min) are skipped with a warning so the
    #    ingest request completes in a reasonable time.
    if settings.whisper_enabled:
        duration = meta.duration_seconds or 0
        if duration > MAX_WHISPER_DURATION_S:
            return [], "skipped_too_long"
        segs = _whisper_transcript(meta.source_url, settings.cache_dir)
        if segs:
            return segs, "whisper"

    return [], "none"


# --------------------------------------------------------------------------- #
# Public entry point
# --------------------------------------------------------------------------- #
def ingest_video(video_id: str, url: str) -> tuple[VideoMetadata, list[dict], list[str]]:
    """Return (metadata, transcript_segments, warnings)."""
    warnings: list[str] = []
    platform = detect_platform(url)
    if platform == "unknown":
        warnings.append(f"Video {video_id}: unrecognized platform for URL {url}")

    try:
        info = _cached_ydl_extract(url)
    except Exception as exc:  # pragma: no cover - network dependent
        warnings.append(
            f"Video {video_id}: metadata extraction failed ({type(exc).__name__}: {exc})"
        )
        info = {}

    meta = _build_metadata(video_id, url, platform, info)

    segments, source = get_transcript(meta)
    meta.transcript_source = source
    meta.transcript_chars = sum(len(s["text"]) for s in segments)
    if source == "none":
        warnings.append(
            f"Video {video_id}: no transcript available (no captions and audio STT failed)"
        )
    elif source == "skipped_too_long":
        dur = meta.duration_seconds or 0
        warnings.append(
            f"Video {video_id}: no English captions found and the video is {dur//60:.0f}m {dur%60:.0f}s long — "
            f"Whisper STT was skipped (limit: 5 min). Chat will work but answers may be limited."
        )

    return meta, segments, warnings
