"""LangGraph RAG agent.

Graph shape (kept deliberately small + debuggable):

    START -> retrieve -> generate -> END

  * retrieve: pulls the top-k chunks for the current question, scoped to the
    session. It also pulls a couple of chunks per-video so comparison questions
    ("compare the hooks", "why did A beat B") always have material from BOTH
    videos, not just whichever is more semantically similar.
  * generate: streams an answer from the LLM grounded ONLY in retrieved chunks +
    the structured metadata, and is instructed to cite [Video X · chunk N].

Memory across turns is provided by LangGraph's checkpointer keyed on
thread_id == session_id, so prior turns are replayed into the model.

The video metadata (engagement rates, follower counts, hashtags, durations) is
injected as a compact structured block so factual questions ("what's the
engagement rate", "who's the creator of B") are answered from ground truth, not
hallucinated from transcript text.
"""
from __future__ import annotations

import json
import os
from typing import Annotated, Any, TypedDict

from langchain.chat_models import init_chat_model
from langchain_core.messages import (
    AIMessage,
    AnyMessage,
    HumanMessage,
    SystemMessage,
)
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages

from .config import get_settings
from . import vectorstore


class RAGState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
    session_id: str
    metadata: dict[str, Any]      # {"A": {...}, "B": {...}}
    retrieved: list[dict]         # chunks for THIS turn
    question: str


_llm = None


def _get_llm():
    global _llm
    if _llm is None:
        settings = get_settings()
        # Export keys to the environment so each provider SDK picks them up
        # natively (avoids per-provider kwarg name differences).
        if settings.google_api_key:
            os.environ.setdefault("GOOGLE_API_KEY", settings.google_api_key)
        if settings.openai_api_key:
            os.environ.setdefault("OPENAI_API_KEY", settings.openai_api_key)

        kwargs: dict = {
            "model_provider": settings.llm_provider,
            "temperature": settings.llm_temperature,
        }
        # Route OpenAI-compatible gateways (e.g. OpenRouter) via base_url.
        if settings.llm_provider == "openai" and settings.openai_base_url:
            kwargs["base_url"] = settings.openai_base_url
        _llm = init_chat_model(settings.llm_model, **kwargs)
    return _llm


# --------------------------------------------------------------------------- #
# Nodes
# --------------------------------------------------------------------------- #
def _retrieve_node(state: RAGState) -> dict:
    settings = get_settings()
    question = state["question"]
    session_id = state["session_id"]

    # Balanced retrieval: top-k overall + a guaranteed slice per video so
    # comparative questions always see both sides.
    overall = vectorstore.search(session_id, question, settings.retrieval_top_k)
    per_video_k = max(2, settings.retrieval_top_k // 3)
    a_hits = vectorstore.search(session_id, question, per_video_k, video_id="A")
    b_hits = vectorstore.search(session_id, question, per_video_k, video_id="B")

    # De-dupe by (video_id, chunk_index), keep best score.
    merged: dict[tuple, dict] = {}
    for hit in [*overall, *a_hits, *b_hits]:
        key = (hit["video_id"], hit["chunk_index"])
        if key not in merged or hit["score"] > merged[key]["score"]:
            merged[key] = hit
    retrieved = sorted(merged.values(), key=lambda h: h["score"], reverse=True)
    return {"retrieved": retrieved}


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
            f"  engagement_rate={m.get('engagement_rate')}% "
            f"duration={m.get('duration_seconds')}s upload_date={m.get('upload_date')}\n"
            f"  hashtags={', '.join(m.get('hashtags') or []) or 'none'}\n"
            f"  transcript_source={m.get('transcript_source')}"
        )
    return "\n".join(lines)


def _format_context(retrieved: list[dict]) -> str:
    if not retrieved:
        return "(no transcript chunks retrieved)"
    blocks = []
    for h in retrieved:
        ts = ""
        if h.get("start") is not None:
            ts = f" @ {h['start']:.0f}s-{(h.get('end') or h['start']):.0f}s"
        blocks.append(
            f"[Video {h['video_id']} · chunk {h['chunk_index']}{ts}]\n{h['text']}"
        )
    return "\n\n".join(blocks)


SYSTEM_PROMPT = """You are a senior short-form content strategist analyzing two \
videos (Video A and Video B) for a creator.

You have two grounded sources:
1. STRUCTURED METADATA — authoritative numbers (views, likes, comments, \
engagement rate, follower count, hashtags, duration, upload date). Always trust \
these for any factual/numeric question.
2. TRANSCRIPT CHUNKS — what was actually said in each video, tagged by video.

Rules:
- Ground every claim in the provided metadata or transcript chunks. Do NOT invent \
numbers or quotes.
- When you use a transcript chunk, cite it inline as [Video X · chunk N].
- When you use a metadata fact, refer to it naturally (e.g. "Video A's 4.2% \
engagement rate").
- Engagement rate = (likes + comments) / views * 100. If asked, show the formula \
with the actual numbers.
- For "hook" questions, focus on the EARLIEST chunks (lowest chunk index / start \
time) of each video.
- If something isn't in the sources, say so plainly instead of guessing.
- Be concrete and actionable. This is a working creator, not an essay grader."""


def _build_turn_messages(state: RAGState) -> list[AnyMessage]:
    meta_block = _format_metadata(state["metadata"])
    ctx_block = _format_context(state["retrieved"])

    grounding = SystemMessage(
        content=(
            f"{SYSTEM_PROMPT}\n\n"
            f"=== STRUCTURED METADATA ===\n{meta_block}\n\n"
            f"=== RETRIEVED TRANSCRIPT CHUNKS ===\n{ctx_block}"
        )
    )
    # Prior conversation (already in state["messages"]) provides memory.
    history = list(state["messages"])
    return [grounding, *history]


# generate is implemented as a streaming function used directly by the API layer
# (LangGraph streams tokens, but we also expose citations, so we drive the LLM
# call ourselves and persist the final message back into the graph state).


# --------------------------------------------------------------------------- #
# Graph assembly
# --------------------------------------------------------------------------- #
_checkpointer = MemorySaver()


def _generate_node(state: RAGState) -> dict:
    """Non-streaming node (used for graph completeness / tests)."""
    llm = _get_llm()
    msgs = _build_turn_messages(state)
    resp = llm.invoke(msgs)
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
