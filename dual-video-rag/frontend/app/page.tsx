"use client";

import { useState, useEffect, useRef } from "react";
import { ingestVideos } from "@/lib/api";
import type { IngestResponse } from "@/lib/types";
import { VideoCard } from "@/components/VideoCard";
import { ChatPanel } from "@/components/ChatPanel";
import { useMounted } from "@/lib/useMounted";
import styles from "./page.module.css";

const DEFAULTS = {
  a: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  b: "",
};

export default function Home() {
  const mounted = useMounted();
  const [urlA, setUrlA] = useState(DEFAULTS.a);
  const [urlB, setUrlB] = useState(DEFAULTS.b);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IngestResponse | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // Live elapsed-time counter while ingesting.
  useEffect(() => {
    if (!loading) { setElapsed(0); return; }
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [loading]);

  async function onIngest(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setData(null);

    // 5-minute hard timeout — backend Whisper on CPU can take a while.
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), 5 * 60 * 1000);

    try {
      const res = await ingestVideos(urlA.trim(), urlB.trim(), controller.signal);
      setData(res);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setError("Request timed out after 5 minutes. The backend is still processing — refresh and try again, or use shorter/caption-enabled videos.");
      } else {
        setError(err?.message ?? "Ingestion failed");
      }
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.h1}>Dual-Video RAG Chatbot</h1>
          <p className={styles.sub}>
            Pull transcripts + metadata for two videos, then chat with grounded,
            cited answers.
          </p>
        </div>
      </header>

      {!mounted ? (
        // Stable, form-free skeleton for SSR + first hydration pass. This avoids
        // hydration mismatches caused by browser extensions (autofill/form
        // fillers) that mutate inputs/buttons before React hydrates.
        <div className={styles.loading}>Loading interface…</div>
      ) : (
        <>
          <form className={styles.ingestForm} onSubmit={onIngest} suppressHydrationWarning>
            <div className={styles.field}>
              <label className={`${styles.label} ${styles.labelA}`}>
                Video A URL
              </label>
              <input
                className={styles.input}
                value={urlA}
                onChange={(e) => setUrlA(e.target.value)}
                placeholder="YouTube or Instagram Reel URL"
                suppressHydrationWarning
              />
            </div>
            <div className={styles.field}>
              <label className={`${styles.label} ${styles.labelB}`}>
                Video B URL
              </label>
              <input
                className={styles.input}
                value={urlB}
                onChange={(e) => setUrlB(e.target.value)}
                placeholder="YouTube or Instagram Reel URL"
                suppressHydrationWarning
              />
            </div>
            <button
              className={styles.ingestBtn}
              disabled={loading || !urlA || !urlB}
              suppressHydrationWarning
            >
              {loading ? "Ingesting…" : "Ingest & Analyze"}
            </button>
          </form>

          {error && <div className={styles.error}>⚠️ {error}</div>}

          {loading && (
            <div className={styles.loading}>
              ⏳ Pulling metadata + transcripts, chunking, embedding, and indexing…
              {elapsed > 0 && <> ({elapsed}s)</>}
              {elapsed > 30 && <> — transcribing audio on CPU, please wait…</>}
            </div>
          )}

          {data && (
            <>
              {data.warnings.length > 0 && (
                <div className={styles.warnings}>
                  {data.warnings.map((w, i) => (
                    <div key={i}>• {w}</div>
                  ))}
                </div>
              )}
              <div className={styles.workspace}>
                <div className={styles.cards}>
                  <VideoCard meta={data.video_a} />
                  <VideoCard meta={data.video_b} />
                </div>
                <div className={styles.chat}>
                  <ChatPanel sessionId={data.session_id} />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
