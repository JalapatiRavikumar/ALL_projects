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
                _model = WhisperModel(settings.whisper_model, device="cpu", compute_type="int8")
    return _model


def transcribe(audio_path: str) -> list[dict]:
    model = _get_model()
    segments, _ = model.transcribe(audio_path, beam_size=1, vad_filter=True)
    return [
        {"text": seg.text.strip(), "start": seg.start, "end": seg.end}
        for seg in segments
        if seg.text.strip()
    ]
