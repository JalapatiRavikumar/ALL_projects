import type { Citation, IngestResponse } from "./types";

// Direct backend URL — bypasses the Next.js proxy which buffers SSE responses
// and breaks token streaming. Set NEXT_PUBLIC_BACKEND_URL in .env.local.
// Falls back to http://127.0.0.1:8000 for local development.
const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

export async function ingestVideos(
  urlA: string,
  urlB: string
): Promise<IngestResponse> {
  const res = await fetch(`${BACKEND}/api/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url_a: urlA, url_b: urlB }),
  });
  if (!res.ok) {
    let message = `Ingest failed (${res.status})`;
    const text = await res.text();
    try {
      const body = JSON.parse(text);
      const detail =
        typeof body.detail === "string"
          ? body.detail
          : JSON.stringify(body.detail ?? body);
      message = `${body.error ? body.error + ": " : ""}${detail}`;
    } catch {
      if (text) message = `${message}: ${text}`;
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
 * Streams a chat answer over SSE directly to the backend.
 * Must NOT go through the Next.js proxy — it buffers the whole response
 * before forwarding, which breaks token-by-token streaming.
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
  } catch (err: unknown) {
    const e = err as Error;
    if (e?.name === "AbortError") return;
    handlers.onError?.(`Cannot reach backend at ${BACKEND}: ${e?.message ?? err}`);
    return;
  }

  if (!res.ok) {
    const raw = await res.text().catch(() => "");
    let detail = `Chat failed (HTTP ${res.status})`;
    try {
      const body = JSON.parse(raw);
      const d =
        typeof body.detail === "string"
          ? body.detail
          : JSON.stringify(body.detail ?? body);
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

      // Split on blank lines — SSE frame separator.
      const frames = buffer.split(/\n\n+/);
      buffer = frames.pop() ?? "";
      for (const frame of frames) {
        if (frame.trim()) processFrame(frame);
      }
    }
    // Flush any remaining buffered data.
    if (buffer.trim()) processFrame(buffer);
  } finally {
    reader.releaseLock();
    // Guarantee the UI always exits streaming state even if done never arrived.
    if (!gotDone) handlers.onDone?.([]);
  }
}
