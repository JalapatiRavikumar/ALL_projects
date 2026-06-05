"""Streaming chat orchestration.

We use the LangGraph graph for retrieval + memory, but drive token streaming
ourselves so we can emit citations alongside the streamed text.

Flow per turn:
  1. Append the user message into graph state (persisted by the checkpointer ->
     gives us cross-turn memory automatically).
  2. Run the `retrieve` node to get this turn's chunks.
  3. Stream tokens from the LLM grounded in metadata + chunks.
  4. Persist the final assistant message back into the checkpointer so the next
     turn remembers it.

Yields dict events: {"type": "citations"|"token"|"done"|"error", ...}.
"""
from __future__ import annotations

from typing import Any, AsyncIterator

from langchain_core.messages import AIMessage, HumanMessage

from . import rag_graph, sessions


def _config(session_id: str) -> dict:
    return {"configurable": {"thread_id": session_id}}


async def stream_chat(session_id: str, message: str) -> AsyncIterator[dict[str, Any]]:
    metadata = sessions.get(session_id)
    if metadata is None:
        yield {"type": "error", "message": "Unknown session. Ingest videos first."}
        return

    graph = rag_graph.get_graph()
    config = _config(session_id)

    # 1) Load prior history from the checkpointer for memory.
    prior_messages = []
    try:
        snapshot = graph.get_state(config)
        if snapshot and snapshot.values:
            prior_messages = snapshot.values.get("messages", [])
    except Exception:
        prior_messages = []

    user_msg = HumanMessage(content=message)
    history = [*prior_messages, user_msg]

    # 2) Retrieve chunks for this turn.
    retrieve_state = {
        "messages": history,
        "session_id": session_id,
        "metadata": metadata,
        "retrieved": [],
        "question": message,
    }
    retrieved = rag_graph._retrieve_node(retrieve_state)["retrieved"]

    # Emit citations up-front so the UI can render source pills immediately.
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

    # 3) Stream the grounded answer.
    gen_state: dict = {
        "messages": history,
        "session_id": session_id,
        "metadata": metadata,
        "retrieved": retrieved,
        "question": message,
    }
    turn_messages = rag_graph._build_turn_messages(gen_state)

    llm = rag_graph._get_llm()
    full_text = ""
    try:
        async for chunk in llm.astream(turn_messages):
            token = _chunk_text(chunk)
            if token:
                full_text += token
                yield {"type": "token", "text": token}
    except Exception as exc:
        import logging, traceback
        logging.getLogger("ragapp").error(
            "LLM stream error: %s\n%s", exc, traceback.format_exc()
        )
        err_msg = str(exc)
        # Surface quota / auth errors clearly so the user knows what to fix.
        if "429" in err_msg or "quota" in err_msg.lower() or "rate" in err_msg.lower():
            err_msg = f"LLM quota / rate-limit exceeded. Check your API key and billing. Detail: {exc}"
        elif "401" in err_msg or "auth" in err_msg.lower() or "api key" in err_msg.lower():
            err_msg = f"LLM authentication failed. Check your API key in backend/.env. Detail: {exc}"
        else:
            err_msg = f"LLM error ({type(exc).__name__}): {exc}"
        yield {"type": "error", "message": err_msg}
        return

    # 4) Persist this turn (user + assistant) into the checkpointer for memory.
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


def _chunk_text(chunk: Any) -> str:
    content = getattr(chunk, "content", None)
    if content is None:
        return ""
    if isinstance(content, str):
        return content
    # Some providers stream content as a list of parts.
    if isinstance(content, list):
        out = []
        for part in content:
            if isinstance(part, str):
                out.append(part)
            elif isinstance(part, dict) and "text" in part:
                out.append(part["text"])
        return "".join(out)
    return str(content)
