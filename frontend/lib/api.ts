import type { Citation, IngestResponse } from "./types";

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

// ngrok free tunnels require this header to skip the browser warning page.
// Cloudflare quick tunnels use "bypass-tunnel-reminder".
// We send both so switching tunnels doesn't break anything.
const TUNNEL_HEADERS: Record<string, string> = {
  "bypass-tunnel-reminder": "true",
  "ngrok-skip-browser-warning": "true",
};

export async function ingestVideos(
  urlA: string,
  urlB: string,
  signal?: AbortSignal
): Promise<IngestResponse> {
  const res = await fetch(`${BACKEND}/api/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...TUNNEL_HEADERS },
    body: JSON.stringify({ url_a: urlA, url_b: urlB }),
    signal,
  });
  if (!res.ok) {
    const text = await res.text();
    let message = `Ingest failed (${res.status})`;
    try {
      const body = JSON.parse(text);
      const detail =
        typeof body.detail === "string"
          ? body.detail
          : JSON.stringify(body.detail ?? body);
      message = body.error ? `${body.error}: ${detail}` : detail;
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

function parseSSEFrame(frame: string, handlers: StreamHandlers, gotDone: { v: boolean }) {
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
          gotDone.v = true;
          handlers.onDone?.(evt.citations || []);
          break;
        case "error":
          handlers.onError?.(evt.message || "Unknown server error");
          break;
      }
    } catch {
      // ignore malformed frame
    }
  }
}

/**
 * Streams chat tokens over SSE.
 *
 * Key design decisions:
 * 1. Calls backend DIRECTLY (not through Next.js proxy) — the proxy buffers
 *    the entire response before forwarding, which kills streaming.
 * 2. Uses TransformStream + TextDecoderStream for true incremental reading —
 *    guarantees tokens appear as they arrive, even through Cloudflare HTTP/2.
 * 3. Sends bypass-tunnel-reminder header so Cloudflare doesn't inject a
 *    warning page in front of the SSE stream.
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
      headers: {
        "Content-Type": "application/json",
        ...TUNNEL_HEADERS,
      },
      body: JSON.stringify({ session_id: sessionId, message }),
      signal,
    });
  } catch (err: unknown) {
    const e = err as Error;
    if (e?.name === "AbortError") return;
    handlers.onError?.(`Cannot reach backend: ${e?.message ?? String(err)}`);
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

  const gotDone = { v: false };
  let buffer = "";

  // Use pipeThrough(TextDecoderStream) for true incremental decoding.
  // This is the most reliable approach across Chrome/Firefox/Safari and
  // works correctly through Cloudflare's HTTP/2 tunnel.
  const reader = res.body
    .pipeThrough(new TextDecoderStream())
    .getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += value;

      // Split on SSE frame separator (one or more blank lines).
      const frames = buffer.split(/\n\n+/);
      // Keep incomplete trailing frame in buffer.
      buffer = frames.pop() ?? "";

      for (const frame of frames) {
        if (frame.trim()) parseSSEFrame(frame, handlers, gotDone);
      }
    }
    // Flush anything remaining after stream ends.
    if (buffer.trim()) parseSSEFrame(buffer, handlers, gotDone);
  } catch (err: unknown) {
    const e = err as Error;
    if (e?.name !== "AbortError") {
      handlers.onError?.(`Stream read error: ${e?.message ?? String(err)}`);
    }
  } finally {
    reader.cancel().catch(() => {});
    // Always exit streaming state even if done event never arrived.
    if (!gotDone.v) handlers.onDone?.([]);
  }
}
