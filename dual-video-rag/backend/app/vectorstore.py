from __future__ import annotations

import uuid
from typing import Any

from qdrant_client import QdrantClient, models

from . import embeddings
from .config import get_settings

_client: QdrantClient | None = None


def get_client() -> QdrantClient:
    global _client
    if _client is None:
        settings = get_settings()
        if settings.qdrant_url:
            _client = QdrantClient(url=settings.qdrant_url, api_key=settings.qdrant_api_key)
        else:
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
        for field in ("session_id", "video_id"):
            client.create_payload_index(
                collection_name=settings.qdrant_collection,
                field_name=field,
                field_schema=models.PayloadSchemaType.KEYWORD,
            )


def upsert_chunks(session_id: str, video_id: str, chunks: list[dict[str, Any]]) -> int:
    settings = get_settings()
    client = get_client()
    vectors = embeddings.embed_documents([c["text"] for c in chunks])
    points = [
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
        for chunk, vector in zip(chunks, vectors)
    ]
    if points:
        client.upsert(collection_name=settings.qdrant_collection, points=points)
    return len(points)


def search(session_id: str, query: str, top_k: int, video_id: str | None = None) -> list[dict[str, Any]]:
    settings = get_settings()
    client = get_client()

    must = [models.FieldCondition(key="session_id", match=models.MatchValue(value=session_id))]
    if video_id:
        must.append(models.FieldCondition(key="video_id", match=models.MatchValue(value=video_id)))

    hits = client.query_points(
        collection_name=settings.qdrant_collection,
        query=embeddings.embed_query(query),
        query_filter=models.Filter(must=must),
        limit=top_k,
        with_payload=True,
    ).points

    return [
        {
            "video_id": (h.payload or {}).get("video_id"),
            "chunk_index": (h.payload or {}).get("chunk_index"),
            "text": (h.payload or {}).get("text", ""),
            "start": (h.payload or {}).get("start"),
            "end": (h.payload or {}).get("end"),
            "score": h.score,
        }
        for h in hits
    ]


def delete_session(session_id: str) -> None:
    settings = get_settings()
    client = get_client()
    client.delete(
        collection_name=settings.qdrant_collection,
        points_selector=models.FilterSelector(
            filter=models.Filter(
                must=[models.FieldCondition(key="session_id", match=models.MatchValue(value=session_id))]
            )
        ),
    )
