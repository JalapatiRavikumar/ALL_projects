"use client";

import { useEffect, useRef, useState } from "react";
import { streamChat } from "@/lib/api";
import type { ChatMessage, Citation } from "@/lib/types";
import styles from "./ChatPanel.module.css";

const SUGGESTIONS = [
  "Why did Video A get more engagement than Video B?",
  "What's the engagement rate of each?",
  "Compare the hooks in the first 5 seconds.",
  "Who's the creator of Video B and what's their follower count?",
  "Suggest improvements for B based on what worked in A.",
];

let idCounter = 0;
const newId = () => `m${++idCounter}-${Date.now()}`;

export function ChatPanel({ sessionId }: { sessionId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [sessionId]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const userMsg: ChatMessage = { id: newId(), role: "user", content };
    const assistantId = newId();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      citations: [],
      streaming: true,
    };

    setMessages((m) => [...m, userMsg, assistantMsg]);
    setInput("");
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const patch = (fn: (m: ChatMessage) => ChatMessage) =>
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantId ? fn(msg) : msg))
      );

    try {
      await streamChat(
        sessionId,
        content,
        {
          onCitations: (c: Citation[]) =>
            patch((m) => ({ ...m, citations: c })),
          onToken: (t: string) =>
            patch((m) => ({ ...m, content: m.content + t })),
          onDone: (c: Citation[]) =>
            patch((m) => ({ ...m, citations: c, streaming: false })),
          onError: (msg: string) => {
            const friendly =
              msg.includes("404") ||
              msg.toLowerCase().includes("unknown session")
                ? 'Session expired — click "Ingest & Analyze" again.'
                : msg;
            patch((m) => ({
              ...m,
              content: (m.content ? m.content + "\n\n" : "") + "⚠️ " + friendly,
              streaming: false,
            }));
          },
        },
        controller.signal
      );
    } catch (e: unknown) {
      const err = e as Error;
      if (err?.name !== "AbortError") {
        const msg = err?.message ?? "Request failed";
        const friendly =
          msg.includes("404") || msg.toLowerCase().includes("unknown session")
            ? 'Session expired — click "Ingest & Analyze" again.'
            : msg;
        patch((m) => ({
          ...m,
          content: (m.content ? m.content + "\n\n" : "") + "⚠️ " + friendly,
          streaming: false,
        }));
      }
    } finally {
      patch((m) => ({ ...m, streaming: false }));
      setBusy(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
    setBusy(false);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <span className={styles.title}>RAG Assistant</span>
        <span className={styles.session}>session {sessionId.slice(0, 8)}</span>
      </div>

      <div className={styles.messages} ref={scrollRef}>
        {messages.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Ask anything about the two videos</p>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className={styles.suggestion}
                  onClick={() => send(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <form
        className={styles.inputRow}
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          className={styles.input}
          value={input}
          placeholder="Ask about Video A vs Video B…"
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
        />
        {busy ? (
          <button type="button" className={styles.stopBtn} onClick={stop}>
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!input.trim()}
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`${styles.msg} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.role}>{isUser ? "You" : "Assistant"}</div>
      <div className={styles.content}>
        {message.content}
        {message.streaming && <span className={styles.caret} />}
      </div>
      {!isUser && message.citations && message.citations.length > 0 && (
        <div className={styles.citations}>
          <span className={styles.citLabel}>Sources</span>
          <div className={styles.citList}>
            {message.citations.map((c, i) => (
              <CitationPill
                key={`${c.video_id}-${c.chunk_index}-${i}`}
                c={c}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CitationPill({ c }: { c: Citation }) {
  const ts =
    c.start !== null && c.start !== undefined
      ? ` @ ${Math.round(c.start)}s`
      : "";
  return (
    <span
      className={`${styles.pill} ${
        c.video_id === "A" ? styles.pillA : styles.pillB
      }`}
      title={c.snippet}
    >
      Video {c.video_id} · chunk {c.chunk_index}
      {ts}
    </span>
  );
}
