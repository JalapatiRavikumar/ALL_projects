"""Pydantic models shared across API + services."""
from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


class IngestRequest(BaseModel):
    url_a: str = Field(..., description="YouTube or Instagram Reel URL for Video A")
    url_b: str = Field(..., description="YouTube or Instagram Reel URL for Video B")


class VideoMetadata(BaseModel):
    video_id: Literal["A", "B"]
    platform: Literal["youtube", "instagram", "unknown"]
    source_url: str
    native_id: Optional[str] = None
    title: Optional[str] = None
    creator: Optional[str] = None
    creator_url: Optional[str] = None
    follower_count: Optional[int] = None
    views: Optional[int] = None
    likes: Optional[int] = None
    comments: Optional[int] = None
    upload_date: Optional[str] = None        # ISO-ish (YYYY-MM-DD)
    duration_seconds: Optional[int] = None
    hashtags: list[str] = Field(default_factory=list)
    thumbnail: Optional[str] = None
    engagement_rate: Optional[float] = None  # (likes + comments) / views * 100
    transcript_chars: int = 0
    transcript_source: Optional[str] = None  # "captions" | "whisper" | "none"
    chunk_count: int = 0


class IngestResponse(BaseModel):
    session_id: str
    video_a: VideoMetadata
    video_b: VideoMetadata
    warnings: list[str] = Field(default_factory=list)


class ChatRequest(BaseModel):
    session_id: str
    message: str


class Citation(BaseModel):
    video_id: str
    chunk_index: int
    snippet: str
    score: float
    start: Optional[float] = None
    end: Optional[float] = None
