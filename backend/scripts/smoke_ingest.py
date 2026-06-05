"""Manual smoke test: ingest one real YouTube URL end-to-end.

Run:  .venv\\Scripts\\python.exe scripts\\smoke_ingest.py <url>
"""
import sys

from app import chunking, ingest, vectorstore


def main():
    url = sys.argv[1] if len(sys.argv) > 1 else "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    print(f"Ingesting: {url}")
    meta, segments, warnings = ingest.ingest_video("A", url)
    print("--- METADATA ---")
    print(meta.model_dump_json(indent=2))
    print(f"--- SEGMENTS: {len(segments)} (source={meta.transcript_source}) ---")
    if segments[:2]:
        print(segments[:2])
    chunks = chunking.chunk_segments(segments)
    print(f"--- CHUNKS: {len(chunks)} ---")
    if chunks[:1]:
        c = chunks[0]
        print({"chunk_index": c["chunk_index"], "start": c["start"], "end": c["end"], "preview": c["text"][:120]})
    session_id = "smoke-session"
    stored = vectorstore.upsert_chunks(session_id, "A", chunks)
    print(f"--- STORED IN QDRANT: {stored} ---")
    hits = vectorstore.search(session_id, "what is this video about", top_k=3)
    print(f"--- SEARCH HITS: {len(hits)} ---")
    for h in hits:
        print(f"  [{h['video_id']}·{h['chunk_index']}] score={h['score']:.3f} {h['text'][:80]!r}")
    vectorstore.delete_session(session_id)
    print("Warnings:", warnings)


if __name__ == "__main__":
    main()
