import type { Citation, IngestResponse } from "./types";

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const HEADERS: Record<string, string> = {
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
    headers: { "Content-Type": "application/json", ...HEADERS },
    body: JSON.stringify({ url_a: urlA, url_b: urlB }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = `Ingest failed (${res.status})`;
    try {
      const body = JSON.parse(text);
      const detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail ?? body);
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

function parseFrame(frame: string, handlers: StreamHandlers, state: { done: boolean }) {
  for (const line of frame.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;
    const raw = trimmed.slice(5).trim();
    if (!raw || raw === "[DONE]") continue;
    try {
      const evt = JSON.parse(raw);
      if (evt.type === "citations") handlers.onCitations?.(evt.citations || []);
      else if (evt.type === "token" && evt.text) handlers.onToken?.(evt.text);
      else if (evt.type === "done") { state.done = true; handlers.onDone?.(evt.citations || []); }
      else if (evt.type === "error") handlers.onError?.(evt.message || "Unknown error");
    } catch { /* ignore malformed frame */ }
  }
}

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
      headers: { "Content-Type": "application/json", ...HEADERS },
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
      const d = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail ?? body);
      detail = body.error ? `${body.error}: ${d}` : d;
    } catch {
      if (raw) detail = `${detail}: ${raw}`;
    }
    handlers.onError?.(detail);
    return;
  }

  if (!res.body) {
    handlers.onError?.("No response body.");
    return;
  }

  const state = { done: false };
  let buffer = "";
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += value;
      const frames = buffer.split(/\n\n+/);
      buffer = frames.pop() ?? "";
      for (const frame of frames) {
        if (frame.trim()) parseFrame(frame, handlers, state);
      }
    }
    if (buffer.trim()) parseFrame(buffer, handlers, state);
  } catch (err: unknown) {
    const e = err as Error;
    if (e?.name !== "AbortError") handlers.onError?.(`Stream error: ${e?.message ?? String(err)}`);
  } finally {
    reader.cancel().catch(() => {});
    if (!state.done) handlers.onDone?.([]);
  }
}
