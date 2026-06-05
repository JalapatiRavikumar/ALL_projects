"""Debug exactly what shape the LLM streaming chunks have."""
import asyncio, os, sys
sys.path.insert(0, ".")
from app import rag_graph

async def main():
    llm = rag_graph._get_llm()
    print("LLM type:", type(llm).__name__)
    chunks_seen = []
    async for chunk in llm.astream("Say exactly three words: hello world test"):
        chunks_seen.append(chunk)
        content = getattr(chunk, "content", "NO_CONTENT_ATTR")
        additional = getattr(chunk, "additional_kwargs", {})
        print(f"  chunk type={type(chunk).__name__!r} content={content!r} additional={additional}")
        if len(chunks_seen) > 20:
            print("  ... (truncated)")
            break
    print(f"\nTotal chunks: {len(chunks_seen)}")
    if chunks_seen:
        text_via_helper = "".join(rag_graph._chunk_text(c) for c in chunks_seen)
        print(f"Text via _chunk_text: {text_via_helper!r}")

asyncio.run(main())
