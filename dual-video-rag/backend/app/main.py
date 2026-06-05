"""FastAPI application: ingest + streaming RAG chat."""
from __future__ import annotations

import json
import logging
import traceback
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse

from . import chat_service, chunking, embeddings, ingest, sessions, vectorstore
from .config import get_settings
from .models import ChatRequest, IngestRequest, IngestResponse

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
)
logger = logging.getLogger("ragapp")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm the embedding model + vector store so first request is snappy.
    try:
        embeddings.warmup()
        vectorstore.get_client()
        logger.info("startup warmup complete (embeddings + vector store ready)")
    except Exception as exc:  # pragma: no cover
        logger.warning("startup warmup skipped: %s", exc)
    yield


app = FastAPI(title="Dual-Video RAG Chatbot", version="1.0.0", lifespan=lifespan)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Surface real error detail instead of a blank 'Internal Server Error'."""
    logger.error("Unhandled error on %s:\n%s", request.url.path, traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={
            "error": type(exc).__name__,
            "detail": str(exc),
            "path": request.url.path,
        },
    )


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/ingest", response_model=IngestResponse)
async def ingest_videos(req: IngestRequest):
    """Pull metadata + transcripts for both videos, chunk, embed, store.

    Both videos are processed CONCURRENTLY via asyncio.gather so the total
    wall-clock time is ~max(time_A, time_B) instead of time_A + time_B.
    Each stage is guarded so a failure on one video degrades gracefully into
    a warning instead of failing the whole request.
    """
    import asyncio

    if not req.url_a or not req.url_b:
        raise HTTPException(status_code=422, detail="Both url_a and url_b are required.")

    session_id = uuid.uuid4().hex

    async def _process_one(vid: str, url: str) -> tuple[any, list[dict], list[str]]:
        """Ingest + chunk + embed one video. Returns (meta, chunks_stored, warnings)."""
        warns: list[str] = []
        try:
            meta, segments, w = await asyncio.to_thread(ingest.ingest_video, vid, url)
            warns.extend(w)
        except Exception as exc:
            logger.error("ingest_video failed for %s: %s", vid, traceback.format_exc())
            warns.append(f"Video {vid}: ingestion error ({type(exc).__name__}: {exc})")
            from .models import VideoMetadata
            meta = VideoMetadata(
                video_id=vid,  # type: ignore[arg-type]
                platform=ingest.detect_platform(url),  # type: ignore[arg-type]
                source_url=url,
                transcript_source="none",
            )
            segments = []

        try:
            chunks = await asyncio.to_thread(chunking.chunk_segments, segments)
            stored = await asyncio.to_thread(vectorstore.upsert_chunks, session_id, vid, chunks)
            meta.chunk_count = stored
            logger.info("ingest %s: stored %d chunks (source=%s)", vid, stored, meta.transcript_source)
        except Exception as exc:
            logger.error("index failed for %s: %s", vid, traceback.format_exc())
            warns.append(f"Video {vid}: indexing error ({type(exc).__name__}: {exc})")
            meta.chunk_count = 0

        return meta, warns

    # Run A and B at the same time — cuts wall-clock time roughly in half.
    logger.info("ingest A+B concurrently: %s | %s", req.url_a, req.url_b)
    (meta_a, warns_a), (meta_b, warns_b) = await asyncio.gather(
        _process_one("A", req.url_a),
        _process_one("B", req.url_b),
    )

    all_warnings = [*warns_a, *warns_b]
    sessions.save(session_id, {"A": meta_a.model_dump(), "B": meta_b.model_dump()})

    return IngestResponse(
        session_id=session_id,
        video_a=meta_a,
        video_b=meta_b,
        warnings=all_warnings,
    )


@app.post("/api/chat")
async def chat(req: ChatRequest):
    """Server-Sent Events stream of tokens + citations."""
    if not sessions.exists(req.session_id):
        raise HTTPException(status_code=404, detail="Unknown session_id")

    async def event_generator():
        async for event in chat_service.stream_chat(req.session_id, req.message):
            yield {"data": json.dumps(event)}

    return EventSourceResponse(event_generator())


@app.get("/api/session/{session_id}")
def get_session(session_id: str):
    meta = sessions.get(session_id)
    if meta is None:
        raise HTTPException(status_code=404, detail="Unknown session_id")
    return meta


@app.delete("/api/session/{session_id}")
def delete_session(session_id: str):
    sessions.delete(session_id)
    vectorstore.delete_session(session_id)
    return {"status": "deleted"}
