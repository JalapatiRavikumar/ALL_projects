"""Audio transcription fallback using faster-whisper (local, CPU).

This is the *last resort* used only when a platform provides no captions
(common for Instagram Reels). faster-whisper bundles audio decoding via PyAV,
so it works even without a system ffmpeg install.

Why a local Whisper fallback instead of always calling a hosted STT API:
  * Captions exist for the majority of YouTube videos => $0 for those.
  * For the minority needing STT, local `tiny`/`base` keeps marginal cost ~$0.
  * At scale you can route long/low-quality audio to a hosted API (AssemblyAom /
    Deepgram) and keep short clips local — a cost/quality knob, not a rewrite.
"""
from __future__ import annotations

import threading
from typing import Any

from .config import get_settings

_lock = threading.Lock()
_model: Any = None


def _get_model():
    global _model
    if _model is None:
        with _lock:
            if _model is None:
                from faster_whisper import WhisperModel

                settings = get_settings()
                # int8 quantization => fast + low memory on CPU.
                _model = WhisperModel(
                    settings.whisper_model,
                    device="cpu",
                    compute_type="int8",
                )
    return _model


def transcribe(audio_path: str) -> list[dict]:
    """Return a list of {text, start, end} segments."""
    model = _get_model()
    segments, _info = model.transcribe(audio_path, beam_size=1, vad_filter=True)
    out = []
    for seg in segments:
        text = (seg.text or "").strip()
        if text:
            out.append({"text": text, "start": seg.start, "end": seg.end})
    return out
