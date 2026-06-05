"""Local embedding provider using fastembed (ONNX runtime).

Why local ONNX BGE instead of a hosted embedding API:
  * $0 marginal cost — embeddings are the highest-volume call in RAG ingestion
    (one per chunk). At 1000 creators/day this is the single biggest cost lever.
  * No network round-trips => lower latency + no rate limits during ingestion.
  * bge-small-en-v1.5 is MTEB-competitive at 384 dims, so vectors are small and
    cheap to store/search.

The model is loaded lazily once and reused (thread-safe singleton). fastembed
runs on CPU via onnxruntime, so no GPU/torch is required.
"""
from __future__ import annotations

import os
import threading

# Quiet the Windows symlink warning from huggingface_hub used by fastembed.
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
                settings = get_settings()
                _model = TextEmbedding(model_name=settings.embedding_model)
    return _model


def embed_documents(texts: list[str]) -> list[list[float]]:
    """Embed a batch of document chunks."""
    model = _get_model()
    return [vec.tolist() for vec in model.embed(texts)]


def embed_query(text: str) -> list[float]:
    """Embed a single query.

    bge models recommend a retrieval instruction prefix on the *query* side to
    improve asymmetric search quality. fastembed's query_embed handles this.
    """
    model = _get_model()
    return next(iter(model.query_embed([text]))).tolist()


def warmup() -> None:
    """Trigger model download/load at startup so the first request is fast."""
    embed_query("warmup")
