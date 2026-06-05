"""Transcript chunking.

We join timestamped segments into a continuous transcript, then split with a
RecursiveCharacterTextSplitter. Each resulting chunk keeps an approximate
start/end timestamp by mapping character offsets back onto the segment timeline.
This lets citations point at *when* in the video a claim comes from.

Chunk size rationale (see README "Why these numbers"):
  * 800 chars (~200 tokens) is large enough to hold a complete thought/hook but
    small enough that retrieval stays precise and we don't blow the LLM context
    when stuffing 6 chunks.
  * 120-char (~15%) overlap avoids cutting a sentence's meaning across a boundary.
"""
from __future__ import annotations

from langchain_text_splitters import RecursiveCharacterTextSplitter

from .config import get_settings


def chunk_segments(segments: list[dict]) -> list[dict]:
    """segments: [{text, start, end}] -> [{text, chunk_index, start, end}]."""
    if not segments:
        return []

    settings = get_settings()

    # Build full text and a char-offset -> timestamp map.
    parts: list[str] = []
    offsets: list[tuple[int, int, float, float]] = []  # (start_char, end_char, t_start, t_end)
    cursor = 0
    for seg in segments:
        text = seg["text"].strip()
        if not text:
            continue
        start_char = cursor
        parts.append(text)
        cursor += len(text) + 1  # +1 for the joining space
        offsets.append((start_char, cursor, seg.get("start"), seg.get("end")))

    full_text = " ".join(parts)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", "? ", "! ", " ", ""],
        length_function=len,
    )
    pieces = splitter.split_text(full_text)

    chunks: list[dict] = []
    search_from = 0
    for idx, piece in enumerate(pieces):
        loc = full_text.find(piece, search_from)
        if loc == -1:
            loc = full_text.find(piece)
        start_char = loc if loc != -1 else search_from
        end_char = start_char + len(piece)
        search_from = start_char + max(1, len(piece) - settings.chunk_overlap)

        t_start = _time_at(offsets, start_char, which="start")
        t_end = _time_at(offsets, end_char, which="end")

        chunks.append(
            {
                "text": piece,
                "chunk_index": idx,
                "start": t_start,
                "end": t_end,
            }
        )
    return chunks


def _time_at(offsets, char_pos: int, which: str) -> float | None:
    best = None
    for start_char, end_char, t_start, t_end in offsets:
        if start_char <= char_pos <= end_char:
            return t_start if which == "start" else t_end
        if char_pos > end_char:
            best = t_end if which == "end" else t_start
    return best
