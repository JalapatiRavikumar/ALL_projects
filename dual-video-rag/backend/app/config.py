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

    llm_provider: Literal["google_genai", "openai"] = "google_genai"
    llm_model: str = "gemini-2.0-flash"
    llm_temperature: float = 0.2

    openai_api_key: str | None = None
    google_api_key: str | None = None
    openai_base_url: str | None = None

    embedding_model: str = "BAAI/bge-small-en-v1.5"
    embedding_dim: int = 384

    qdrant_url: str | None = None
    qdrant_api_key: str | None = None
    qdrant_path: str = "./.qdrant_data"
    qdrant_collection: str = "video_chunks"

    chunk_size: int = 800
    chunk_overlap: int = 120
    retrieval_top_k: int = 6

    whisper_model: str = "tiny"
    whisper_enabled: bool = True

    cookies_from_browser: str | None = None
    cookies_file: str | None = None

    data_dir: str = "./data"
    cache_dir: str = "./.cache"
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
