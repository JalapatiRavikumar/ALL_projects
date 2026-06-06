from __future__ import annotations

import json
import os
import threading
from typing import Any

_lock = threading.Lock()
_store: dict[str, dict[str, Any]] = {}
_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def _path(session_id: str) -> str:
    return os.path.join(_DATA_DIR, f"{session_id}.json")


def save(session_id: str, metadata: dict[str, Any]) -> None:
    with _lock:
        _store[session_id] = metadata
    try:
        os.makedirs(_DATA_DIR, exist_ok=True)
        with open(_path(session_id), "w", encoding="utf-8") as f:
            json.dump(metadata, f, ensure_ascii=False)
    except OSError:
        pass


def get(session_id: str) -> dict[str, Any] | None:
    with _lock:
        if session_id in _store:
            return _store[session_id]
    try:
        with open(_path(session_id), "r", encoding="utf-8") as f:
            data = json.load(f)
        with _lock:
            _store[session_id] = data
        return data
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def delete(session_id: str) -> None:
    with _lock:
        _store.pop(session_id, None)
    try:
        os.remove(_path(session_id))
    except FileNotFoundError:
        pass


def exists(session_id: str) -> bool:
    return get(session_id) is not None
