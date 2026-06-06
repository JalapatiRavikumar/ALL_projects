from __future__ import annotations

from langchain_text_splitters import RecursiveCharacterTextSplitter
from .config import get_settings


def chunk_segments(segments: list[dict]) -> list[dict]:
    if not segments:
        return []

    settings = get_settings()
    parts: list[str] = []
    offsets: list[tuple[int, int, float, float]] = []
    cursor = 0

    for seg in segments:
        text = seg["text"].strip()
        if not text:
            continue
        start_char = cursor
        parts.append(text)
        cursor += len(text) + 1
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
        chunks.append({
            "text": piece,
            "chunk_index": idx,
            "start": _time_at(offsets, start_char, "start"),
            "end": _time_at(offsets, end_char, "end"),
        })
    return chunks


def _time_at(offsets, char_pos: int, which: str) -> float | None:
    best = None
    for start_char, end_char, t_start, t_end in offsets:
        if start_char <= char_pos <= end_char:
            return t_start if which == "start" else t_end
        if char_pos > end_char:
            best = t_end if which == "end" else t_start
    return best
