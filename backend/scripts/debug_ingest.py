"""Reproduce the full ingest pipeline with a visible traceback."""
import sys
import traceback

from app import chunking, ingest, vectorstore, sessions


def run(url_a: str, url_b: str):
    import uuid
    session_id = uuid.uuid4().hex
    for vid, url in (("A", url_a), ("B", url_b)):
        print(f"\n===== INGEST {vid}: {url} =====")
        try:
            meta, segments, warns = ingest.ingest_video(vid, url)
            print(f"  platform={meta.platform} title={meta.title!r}")
            print(f"  views={meta.views} likes={meta.likes} comments={meta.comments}")
            print(f"  engagement_rate={meta.engagement_rate}")
            print(f"  transcript_source={meta.transcript_source} segs={len(segments)}")
            print(f"  warnings={warns}")
            chunks = chunking.chunk_segments(segments)
            print(f"  chunks={len(chunks)}")
            stored = vectorstore.upsert_chunks(session_id, vid, chunks)
            print(f"  stored={stored}")
        except Exception:
            print(f"  !!! EXCEPTION on {vid} !!!")
            traceback.print_exc()


if __name__ == "__main__":
    a = sys.argv[1] if len(sys.argv) > 1 else "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    b = sys.argv[2] if len(sys.argv) > 2 else "https://www.youtube.com/watch?v=9bZkp7q19f0"
    run(a, b)
