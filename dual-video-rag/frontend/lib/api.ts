import type { Citation, IngestResponse } from "./types";

// The backend URL. In the browser we hit the Next.js rewrite proxy for ingest
// (one-shot JSON), but for SSE streaming we MUST call the backend directly
// because the Next.js proxy buffers the entire response before forwarding it,
// which breaks token-by-token streaming entirely.
const BACKEND =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000")
    : "http://127.0.0.1:8000";

export async function ingestVideos(
  urlA: string,
  urlB: string,
  signal?: AbortSignal
): Promise<IngestResponse> {
  const apiBase = ""; // Route through Next.js proxy to avoid CORS
  const res = await fetch(`${apiBase}/api/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url_a: urlA, url_b: urlB }),
    signal,
  });
  if (!res.ok) {
    let message = `Ingest failed (${res.status})`;
    const text = await res.text();
    try {
      const body = JSON.parse(text);
      // FastAPI validation -> {detail}, our handler -> {error, detail}
      const detail =
        typeof body.detail === "string"
          ? body.detail
          : JSON.stringify(body.detail ?? body);
      message = `${body.error ? body.error + ": " : ""}${detail}`;
    } catch {
      message = `${message}: ${text}`;
    }
    throw new Error(message);
  }
  return res.json();
}

export interface StreamHandlers {
  onCitations?: (c: Citation[]) => void;
  onToken?: (t: string) => void;
  onDone?: (c: Citation[]) => void;
  onError?: (msg: string) => void;
}

/**
 * Streams a chat answer over SSE. We POST (body needed) and parse the
 * text/event-stream manually since EventSource only supports GET.
 */
export async function streamChat(
  sessionId: string,
  message: string,
  handlers: StreamHandlers,
  signal?: AbortSignal
): Promise<void> {
  let res: Response;

  try {
    res = await fetch(`${BACKEND}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, message }),
      signal,
    });
  } catch (err: any) {
    // Network-level failure (server down, aborted, etc.)
    if (err?.name === "AbortError") return;
    handlers.onError?.(`Cannot reach the backend: ${err?.message ?? err}`);
    return;
  }

  // Non-2xx: read body once and surface the real detail.
  if (!res.ok) {
    const raw = await res.text().catch(() => "");
    let detail = `Chat request failed (HTTP ${res.status})`;
    try {
      const body = JSON.parse(raw);
      const d = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail ?? body);
      detail = body.error ? `${body.error}: ${d}` : d;
    } catch {
      if (raw) detail = `${detail}: ${raw}`;
    }
    handlers.onError?.(detail);
    return;
  }

  if (!res.body) {
    handlers.onError?.("Server returned no response body.");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let gotDone = false;

  const processFrame = (frame: string) => {
    for (const line of frame.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const raw = trimmed.slice(5).trim();
      if (!raw || raw === "[DONE]") continue;
      try {
        const evt = JSON.parse(raw);
        switch (evt.type) {
          case "citations":
            handlers.onCitations?.(evt.citations || []);
            break;
          case "token":
            if (evt.text) handlers.onToken?.(evt.text);
            break;
          case "done":
            gotDone = true;
            handlers.onDone?.(evt.citations || []);
            break;
          case "error":
            handlers.onError?.(evt.message || "Unknown server error");
            break;
        }
      } catch {
        // ignore malformed SSE frame
      }
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE frames are separated by one or more blank lines (\n\n).
      // We split on every double-newline and keep the incomplete tail.
      const frames = buffer.split(/\n\n+/);
      // Last element may be an incomplete frame — keep it in buffer.
      buffer = frames.pop() ?? "";
      for (const frame of frames) {
        if (frame.trim()) processFrame(frame);
      }
    }
    // Flush any remaining data in buffer after stream ends.
    if (buffer.trim()) processFrame(buffer);
  } finally {
    reader.releaseLock();
    if (!gotDone) handlers.onDone?.([]);
  }
}
