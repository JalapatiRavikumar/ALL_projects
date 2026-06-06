from __future__ import annotations

import logging
import traceback
from typing import Any, AsyncIterator

from langchain_core.messages import AIMessage, HumanMessage

from . import rag_graph, sessions

logger = logging.getLogger("ragapp")


def _config(session_id: str) -> dict:
    return {"configurable": {"thread_id": session_id}}


def _extract_text(chunk: Any) -> str:
    content = getattr(chunk, "content", None)
    if content is None:
        return ""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "".join(
            p if isinstance(p, str) else p.get("text", "") if isinstance(p, dict) else ""
            for p in content
        )
    return str(content)


async def stream_chat(session_id: str, message: str) -> AsyncIterator[dict[str, Any]]:
    metadata = sessions.get(session_id)
    if metadata is None:
        yield {"type": "error", "message": "Unknown session. Ingest videos first."}
        return

    graph = rag_graph.get_graph()
    config = _config(session_id)

    prior_messages = []
    try:
        snapshot = graph.get_state(config)
        if snapshot and snapshot.values:
            prior_messages = snapshot.values.get("messages", [])
    except Exception:
        pass

    user_msg = HumanMessage(content=message)
    history = [*prior_messages, user_msg]

    retrieve_state = {
        "messages": history,
        "session_id": session_id,
        "metadata": metadata,
        "retrieved": [],
        "question": message,
    }
    retrieved = rag_graph._retrieve_node(retrieve_state)["retrieved"]

    citations = [
        {
            "video_id": h["video_id"],
            "chunk_index": h["chunk_index"],
            "snippet": (h["text"][:160] + "…") if len(h["text"]) > 160 else h["text"],
            "score": round(float(h["score"]), 4),
            "start": h.get("start"),
            "end": h.get("end"),
        }
        for h in retrieved
    ]
    yield {"type": "citations", "citations": citations}

    turn_messages = rag_graph._build_turn_messages({
        "messages": history,
        "session_id": session_id,
        "metadata": metadata,
        "retrieved": retrieved,
        "question": message,
    })

    llm = rag_graph._get_llm()
    full_text = ""
    try:
        async for chunk in llm.astream(turn_messages):
            token = _extract_text(chunk)
            if token:
                full_text += token
                yield {"type": "token", "text": token}
    except Exception as exc:
        logger.error("LLM stream error: %s\n%s", exc, traceback.format_exc())
        msg = str(exc)
        if "429" in msg or "quota" in msg.lower() or "rate" in msg.lower():
            msg = f"LLM quota/rate-limit exceeded — check your API key. Detail: {exc}"
        elif "401" in msg or "auth" in msg.lower():
            msg = f"LLM auth failed — check your API key in .env. Detail: {exc}"
        else:
            msg = f"LLM error ({type(exc).__name__}): {exc}"
        yield {"type": "error", "message": msg}
        return

    try:
        graph.update_state(
            config,
            {
                "messages": [user_msg, AIMessage(content=full_text)],
                "session_id": session_id,
                "metadata": metadata,
                "question": message,
            },
        )
    except Exception:
        pass

    yield {"type": "done", "citations": citations}
