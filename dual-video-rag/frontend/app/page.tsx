"use client";

import { useState } from "react";
import { ingestVideos } from "@/lib/api";
import type { IngestResponse } from "@/lib/types";
import { VideoCard } from "@/components/VideoCard";
import { ChatPanel } from "@/components/ChatPanel";
import { useMounted } from "@/lib/useMounted";
import styles from "./page.module.css";

export default function Home() {
  const mounted = useMounted();
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IngestResponse | null>(null);

  async function onIngest(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setData(null);
    try {
      const res = await ingestVideos(urlA.trim(), urlB.trim());
      setData(res);
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Ingestion failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <h1 className={styles.h1}>Dual-Video RAG Chatbot</h1>
        <p className={styles.sub}>
          Paste two video URLs → get metadata, transcripts, engagement stats,
          and a grounded AI assistant that cites every answer.
        </p>
      </header>

      {/* ── Ingest form ── */}
      {!mounted ? (
        <div className={styles.loading}>Loading…</div>
      ) : (
        <>
          <form
            className={styles.ingestForm}
            onSubmit={onIngest}
            suppressHydrationWarning
          >
            <div className={styles.field}>
              <label className={`${styles.label} ${styles.labelA}`}>
                Video A — YouTube or Instagram Reel URL
              </label>
              <input
                className={styles.input}
                value={urlA}
                onChange={(e) => setUrlA(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                suppressHydrationWarning
              />
            </div>

            <div className={styles.field}>
              <label className={`${styles.label} ${styles.labelB}`}>
                Video B — YouTube or Instagram Reel URL
              </label>
              <input
                className={styles.input}
                value={urlB}
                onChange={(e) => setUrlB(e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                suppressHydrationWarning
              />
            </div>

            <button
              className={styles.ingestBtn}
              disabled={loading || !urlA.trim() || !urlB.trim()}
              suppressHydrationWarning
            >
              {loading ? "Ingesting…" : "Ingest & Analyze"}
            </button>
          </form>

          {/* ── States ── */}
          {error && (
            <div className={styles.error}>⚠️ {error}</div>
          )}

          {loading && (
            <div className={styles.loading}>
              Pulling metadata + transcripts, chunking, embedding, and indexing
              in the vector DB… this can take up to a minute for audio transcription.
            </div>
          )}

          {/* ── Warnings ── */}
          {data && data.warnings.length > 0 && (
            <div className={styles.warnings}>
              {data.warnings.map((w, i) => (
                <div key={i}>• {w}</div>
              ))}
            </div>
          )}

          {/* ── Main workspace: video cards + chat ── */}
          {data && (
            <div className={styles.workspace}>
              <div className={styles.cards}>
                <VideoCard meta={data.video_a} />
                <VideoCard meta={data.video_b} />
              </div>
              <div className={styles.chat}>
                <ChatPanel sessionId={data.session_id} />
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
