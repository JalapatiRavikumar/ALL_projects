"""Qdrant-backed vector store.

Why Qdrant:
  * Runs *embedded* (local on-disk, no Docker) for dev AND scales to a managed
    cluster by only changing QDRANT_URL — identical code path.
  * Rust core => fast HNSW search and low memory per vector.
  * First-class payload filtering, which we use to scope retrieval by video_id
    (the task requires tagging every chunk with A/B and citing sources).

Each session gets its own logical namespace via a `session_id` payload field so
many creators can share one collection without cross-contamination. At scale you
would shard by collection or use multitenancy keys; the filter approach keeps
the demo simple while remaining correct.
"""
from __future__ import annotations

import uuid
from typing import Any

from qdrant_client import QdrantClient, models

from .config import get_settings
from . import embeddings

_client: QdrantClient | None = None


def get_client() -> QdrantClient:
    global _client
    if _client is None:
        settings = get_settings()
        if settings.qdrant_url:
            _client = QdrantClient(
                url=settings.qdrant_url,
                api_key=settings.qdrant_api_key,
            )
        else:
            # Embedded, persistent local mode — no server/Docker required.
            _client = QdrantClient(path=settings.qdrant_path)
        _ensure_collection(_client, settings)
    return _client


def _ensure_collection(client: QdrantClient, settings) -> None:
    existing = {c.name for c in client.get_collections().collections}
    if settings.qdrant_collection not in existing:
        client.create_collection(
            collection_name=settings.qdrant_collection,
            vectors_config=models.VectorParams(
                size=settings.embedding_dim,
                distance=models.Distance.COSINE,
            ),
        )
        # Indexed payload fields make session/video filtering O(log n).
        for field in ("session_id", "video_id"):
            client.create_payload_index(
                collection_name=settings.qdrant_collection,
                field_name=field,
                field_schema=models.PayloadSchemaType.KEYWORD,
            )


def upsert_chunks(
    session_id: str,
    video_id: str,
    chunks: list[dict[str, Any]],
) -> int:
    """chunks: list of {text, chunk_index, start, end}."""
    settings = get_settings()
    client = get_client()
    vectors = embeddings.embed_documents([c["text"] for c in chunks])
    points = []
    for chunk, vector in zip(chunks, vectors):
        points.append(
            models.PointStruct(
                id=str(uuid.uuid4()),
                vector=vector,
                payload={
                    "session_id": session_id,
                    "video_id": video_id,
                    "chunk_index": chunk["chunk_index"],
                    "text": chunk["text"],
                    "start": chunk.get("start"),
                    "end": chunk.get("end"),
                },
            )
        )
    if points:
        client.upsert(collection_name=settings.qdrant_collection, points=points)
    return len(points)


def search(
    session_id: str,
    query: str,
    top_k: int,
    video_id: str | None = None,
) -> list[dict[str, Any]]:
    settings = get_settings()
    client = get_client()
    qvec = embeddings.embed_query(query)

    must = [
        models.FieldCondition(
            key="session_id", match=models.MatchValue(value=session_id)
        )
    ]
    if video_id:
        must.append(
            models.FieldCondition(
                key="video_id", match=models.MatchValue(value=video_id)
            )
        )

    hits = client.query_points(
        collection_name=settings.qdrant_collection,
        query=qvec,
        query_filter=models.Filter(must=must),
        limit=top_k,
        with_payload=True,
    ).points

    results = []
    for h in hits:
        payload = h.payload or {}
        results.append(
            {
                "video_id": payload.get("video_id"),
                "chunk_index": payload.get("chunk_index"),
                "text": payload.get("text", ""),
                "start": payload.get("start"),
                "end": payload.get("end"),
                "score": h.score,
            }
        )
    return results


def delete_session(session_id: str) -> None:
    settings = get_settings()
    client = get_client()
    client.delete(
        collection_name=settings.qdrant_collection,
        points_selector=models.FilterSelector(
            filter=models.Filter(
                must=[
                    models.FieldCondition(
                        key="session_id",
                        match=models.MatchValue(value=session_id),
                    )
                ]
            )
        ),
    )
