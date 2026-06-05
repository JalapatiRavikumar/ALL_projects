"""Reproduce the chat stream end-to-end and print every SSE event."""
import asyncio
import json
import sys

import httpx


async def main(session_id: str, question: str):
    print(f"session_id: {session_id}")
    print(f"question  : {question}")
    print("-" * 60)

    tokens = []
    citations = []
    errors = []
    buffer = ""

    async with httpx.AsyncClient(timeout=120) as client:
        async with client.stream(
            "POST",
            "http://127.0.0.1:8000/api/chat",
            json={"session_id": session_id, "message": question},
            headers={"Accept": "text/event-stream"},
        ) as resp:
            print(f"HTTP status: {resp.status_code}")
            print(f"Content-Type: {resp.headers.get('content-type','?')}")
            print("-" * 60)

            async for raw_chunk in resp.aiter_text():
                buffer += raw_chunk
                while "\n\n" in buffer:
                    frame, buffer = buffer.split("\n\n", 1)
                    for line in frame.split("\n"):
                        if not line.startswith("data:"):
                            continue
                        raw = line[5:].strip()
                        if not raw:
                            continue
                        try:
                            evt = json.loads(raw)
                        except Exception as e:
                            print(f"  [PARSE ERROR] {e!r} raw={raw!r}")
                            continue

                        etype = evt.get("type")
                        print(f"  [EVENT type={etype!r}]", end=" ")
                        if etype == "token":
                            tok = evt.get("text", "")
                            tokens.append(tok)
                            print(repr(tok))
                        elif etype == "citations":
                            citations = evt.get("citations", [])
                            print(f"{len(citations)} citations")
                            for c in citations:
                                print(f"    Video {c['video_id']} chunk {c['chunk_index']} score={c['score']:.3f} | {c['snippet'][:60]!r}")
                        elif etype == "done":
                            print("STREAM COMPLETE")
                        elif etype == "error":
                            errors.append(evt.get("message", ""))
                            print(f"ERROR: {evt.get('message')}")
                        else:
                            print(evt)

    print("-" * 60)
    print(f"Total tokens received : {len(tokens)}")
    print(f"Full answer           : {''.join(tokens)[:400]}")
    if errors:
        print(f"ERRORS: {errors}")


if __name__ == "__main__":
    session = sys.argv[1] if len(sys.argv) > 1 else open("C:/Users/rravi/Downloads/new/backend/.last_session").read().strip()
    q = sys.argv[2] if len(sys.argv) > 2 else "What is the engagement rate of each video?"
    asyncio.run(main(session, q))
