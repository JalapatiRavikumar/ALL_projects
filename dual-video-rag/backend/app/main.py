from __future__ import annotations

import asyncio
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
from .models import ChatRequest, IngestRequest, IngestResponse, VideoMetadata

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
)
logger = logging.getLogger("ragapp")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        embeddings.warmup()
        vectorstore.get_client()
        logger.info("startup complete")
    except Exception as exc:
        logger.warning("startup warmup skipped: %s", exc)
    yield


app = FastAPI(title="Dual-Video RAG Chatbot", version="1.0.0", lifespan=lifespan)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_error_handler(request: Request, exc: Exception):
    logger.error("Unhandled error on %s:\n%s", request.url.path, traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"error": type(exc).__name__, "detail": str(exc), "path": request.url.path},
    )


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/ingest", response_model=IngestResponse)
async def ingest_videos(req: IngestRequest):
    if not req.url_a or not req.url_b:
        raise HTTPException(status_code=422, detail="Both url_a and url_b are required.")

    session_id = uuid.uuid4().hex

    async def process(vid: str, url: str):
        warns: list[str] = []
        try:
            meta, segments, w = await asyncio.to_thread(ingest.ingest_video, vid, url)
            warns.extend(w)
        except Exception as exc:
            logger.error("ingest failed for %s: %s", vid, traceback.format_exc())
            warns.append(f"Video {vid}: {type(exc).__name__}: {exc}")
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
        except Exception as exc:
            logger.error("index failed for %s: %s", vid, traceback.format_exc())
            warns.append(f"Video {vid}: indexing error: {exc}")

        return meta, warns

    (meta_a, warns_a), (meta_b, warns_b) = await asyncio.gather(
        process("A", req.url_a),
        process("B", req.url_b),
    )

    sessions.save(session_id, {"A": meta_a.model_dump(), "B": meta_b.model_dump()})

    return IngestResponse(
        session_id=session_id,
        video_a=meta_a,
        video_b=meta_b,
        warnings=[*warns_a, *warns_b],
    )


@app.post("/api/chat")
async def chat(req: ChatRequest):
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
