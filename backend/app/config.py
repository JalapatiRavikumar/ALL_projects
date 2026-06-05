"""Central configuration.

Everything is driven by env vars so the same code runs locally (free, fully
offline embeddings + embedded vector DB) or in the cloud (managed Qdrant +
hosted LLM). Nothing here is hard-coded per-video — only operational defaults.
"""
from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ---- LLM ----
    # provider:model  e.g. "google_genai:gemini-2.0-flash" or "openai:gpt-4o-mini"
    llm_provider: Literal["google_genai", "openai"] = "google_genai"
    llm_model: str = "gemini-2.0-flash"
    llm_temperature: float = 0.2

    openai_api_key: str | None = None
    google_api_key: str | None = None
    # Optional custom base URL for OpenAI-compatible gateways (e.g. OpenRouter,
    # Together, local vLLM). Leave empty for the official OpenAI endpoint.
    openai_base_url: str | None = None

    # ---- Embeddings (local ONNX BGE by default — free, no torch) ----
    # If you'd rather use a hosted embedder, swap embeddings.py — interface is stable.
    embedding_model: str = "BAAI/bge-small-en-v1.5"
    embedding_dim: int = 384  # bge-small-en-v1.5 dimensionality

    # ---- Vector DB (Qdrant) ----
    # Embedded mode writes to a local folder; set QDRANT_URL to use a server/cloud.
    qdrant_url: str | None = None
    qdrant_api_key: str | None = None
    qdrant_path: str = "./.qdrant_data"
    qdrant_collection: str = "video_chunks"

    # ---- Chunking ----
    chunk_size: int = 800          # characters, ~180-220 tokens
    chunk_overlap: int = 120       # ~15% overlap preserves cross-boundary context

    # ---- Retrieval ----
    retrieval_top_k: int = 6       # per query, across both videos

    # ---- Transcription fallback ----
    # Used only when no platform captions exist (common for Reels).
    whisper_model: str = "tiny"    # tiny/base/small — tiny is fastest on CPU
    whisper_enabled: bool = True

    # ---- Instagram authentication ----
    # Instagram blocks anonymous yt-dlp requests ("login required / rate-limit").
    # Two ways to authenticate (cookies stay local, never logged or committed):
    #   1) cookies_from_browser: e.g. "chrome", "edge", "firefox" — yt-dlp reads
    #      the logged-in session straight from your browser profile.
    #   2) cookies_file: path to a Netscape-format cookies.txt exported via a
    #      browser extension. Useful on servers with no browser.
    cookies_from_browser: str | None = None
    cookies_file: str | None = None

    # ---- App ----
    data_dir: str = "./data"
    cache_dir: str = "./.cache"
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
