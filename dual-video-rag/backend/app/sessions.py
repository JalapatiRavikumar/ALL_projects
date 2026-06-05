"""Session registry — disk-backed JSON so backend restarts preserve active sessions.

Each session is a single JSON file: ./data/<session_id>.json
Falls back gracefully to in-memory if disk I/O fails.
Conversation history lives in the LangGraph MemorySaver (keyed by thread_id).
"""
from __future__ import annotations

import json
import os
import threading
from typing import Any

_lock = threading.Lock()
_store: dict[str, dict[str, Any]] = {}      # in-memory cache
_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def _path(session_id: str) -> str:
    return os.path.join(_DATA_DIR, f"{session_id}.json")


def _load_from_disk(session_id: str) -> dict[str, Any] | None:
    try:
        with open(_path(session_id), "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def _save_to_disk(session_id: str, metadata: dict[str, Any]) -> None:
    try:
        os.makedirs(_DATA_DIR, exist_ok=True)
        with open(_path(session_id), "w", encoding="utf-8") as f:
            json.dump(metadata, f, ensure_ascii=False)
    except OSError:
        pass  # disk write failed — in-memory cache still works


def save(session_id: str, metadata: dict[str, Any]) -> None:
    with _lock:
        _store[session_id] = metadata
    _save_to_disk(session_id, metadata)


def get(session_id: str) -> dict[str, Any] | None:
    with _lock:
        if session_id in _store:
            return _store[session_id]
    # Try loading from disk (covers backend-restart scenario).
    data = _load_from_disk(session_id)
    if data is not None:
        with _lock:
            _store[session_id] = data
    return data


def delete(session_id: str) -> None:
    with _lock:
        _store.pop(session_id, None)
    try:
        os.remove(_path(session_id))
    except FileNotFoundError:
        pass


def exists(session_id: str) -> bool:
    return get(session_id) is not None
