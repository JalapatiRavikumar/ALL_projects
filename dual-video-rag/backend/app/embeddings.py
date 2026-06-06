from __future__ import annotations

import os
import threading

os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")

from fastembed import TextEmbedding
from .config import get_settings

_lock = threading.Lock()
_model: TextEmbedding | None = None


def _get_model() -> TextEmbedding:
    global _model
    if _model is None:
        with _lock:
            if _model is None:
                _model = TextEmbedding(model_name=get_settings().embedding_model)
    return _model


def embed_documents(texts: list[str]) -> list[list[float]]:
    return [vec.tolist() for vec in _get_model().embed(texts)]


def embed_query(text: str) -> list[float]:
    return next(iter(_get_model().query_embed([text]))).tolist()


def warmup() -> None:
    embed_query("warmup")
