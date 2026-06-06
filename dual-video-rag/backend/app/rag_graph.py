from __future__ import annotations

import os
from typing import Annotated, Any, TypedDict

from langchain.chat_models import init_chat_model
from langchain_core.messages import AIMessage, AnyMessage, HumanMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages

from . import vectorstore
from .config import get_settings


class RAGState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
    session_id: str
    metadata: dict[str, Any]
    retrieved: list[dict]
    question: str


_llm = None


def _get_llm():
    global _llm
    if _llm is None:
        settings = get_settings()
        if settings.google_api_key:
            os.environ.setdefault("GOOGLE_API_KEY", settings.google_api_key)
        if settings.openai_api_key:
            os.environ.setdefault("OPENAI_API_KEY", settings.openai_api_key)
        kwargs: dict = {
            "model_provider": settings.llm_provider,
            "temperature": settings.llm_temperature,
        }
        if settings.llm_provider == "openai" and settings.openai_base_url:
            kwargs["base_url"] = settings.openai_base_url
        _llm = init_chat_model(settings.llm_model, **kwargs)
    return _llm


def _retrieve_node(state: RAGState) -> dict:
    settings = get_settings()
    sid = state["session_id"]
    q = state["question"]

    overall = vectorstore.search(sid, q, settings.retrieval_top_k)
    per_k = max(2, settings.retrieval_top_k // 3)
    a_hits = vectorstore.search(sid, q, per_k, video_id="A")
    b_hits = vectorstore.search(sid, q, per_k, video_id="B")

    merged: dict[tuple, dict] = {}
    for hit in [*overall, *a_hits, *b_hits]:
        key = (hit["video_id"], hit["chunk_index"])
        if key not in merged or hit["score"] > merged[key]["score"]:
            merged[key] = hit

    return {"retrieved": sorted(merged.values(), key=lambda h: h["score"], reverse=True)}


def _format_metadata(metadata: dict[str, Any]) -> str:
    lines = []
    for vid in ("A", "B"):
        m = metadata.get(vid)
        if not m:
            continue
        lines.append(
            f"Video {vid} [{m.get('platform')}] \"{m.get('title')}\"\n"
            f"  creator={m.get('creator')} followers={m.get('follower_count')}\n"
            f"  views={m.get('views')} likes={m.get('likes')} comments={m.get('comments')}\n"
            f"  engagement_rate={m.get('engagement_rate')}% duration={m.get('duration_seconds')}s "
            f"upload_date={m.get('upload_date')}\n"
            f"  hashtags={', '.join(m.get('hashtags') or []) or 'none'}\n"
            f"  transcript_source={m.get('transcript_source')}"
        )
    return "\n".join(lines)


def _format_context(retrieved: list[dict]) -> str:
    if not retrieved:
        return "(no transcript chunks retrieved)"
    blocks = []
    for h in retrieved:
        ts = f" @ {h['start']:.0f}s-{(h.get('end') or h['start']):.0f}s" if h.get("start") is not None else ""
        blocks.append(f"[Video {h['video_id']} · chunk {h['chunk_index']}{ts}]\n{h['text']}")
    return "\n\n".join(blocks)


SYSTEM_PROMPT = (
    "You are a senior short-form content strategist analyzing two videos (Video A and Video B) for a creator.\n\n"
    "You have two grounded sources:\n"
    "1. STRUCTURED METADATA — authoritative numbers (views, likes, comments, engagement rate, "
    "follower count, hashtags, duration, upload date). Always trust these for factual/numeric questions.\n"
    "2. TRANSCRIPT CHUNKS — what was actually said in each video, tagged by video.\n\n"
    "Rules:\n"
    "- Ground every claim in the provided metadata or transcript chunks. Do NOT invent numbers or quotes.\n"
    "- Cite transcript chunks inline as [Video X · chunk N].\n"
    "- Engagement rate = (likes + comments) / views * 100. Show the formula with actual numbers when asked.\n"
    "- For hook questions, focus on the earliest chunks (lowest chunk index / start time).\n"
    "- If something isn't in the sources, say so instead of guessing.\n"
    "- Be concrete and actionable."
)


def _build_turn_messages(state: RAGState) -> list[AnyMessage]:
    grounding = SystemMessage(
        content=(
            f"{SYSTEM_PROMPT}\n\n"
            f"=== STRUCTURED METADATA ===\n{_format_metadata(state['metadata'])}\n\n"
            f"=== RETRIEVED TRANSCRIPT CHUNKS ===\n{_format_context(state['retrieved'])}"
        )
    )
    return [grounding, *list(state["messages"])]


_checkpointer = MemorySaver()


def _generate_node(state: RAGState) -> dict:
    resp = _get_llm().invoke(_build_turn_messages(state))
    return {"messages": [resp]}


def build_graph():
    g = StateGraph(RAGState)
    g.add_node("retrieve", _retrieve_node)
    g.add_node("generate", _generate_node)
    g.add_edge(START, "retrieve")
    g.add_edge("retrieve", "generate")
    g.add_edge("generate", END)
    return g.compile(checkpointer=_checkpointer)


_graph = None


def get_graph():
    global _graph
    if _graph is None:
        _graph = build_graph()
    return _graph
