"use client";

import type { VideoMetadata } from "@/lib/types";
import { compactNumber, formatDuration, formatPercent } from "@/lib/format";
import styles from "./VideoCard.module.css";

const PLATFORM_LABEL: Record<string, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  unknown: "Unknown",
};

export function VideoCard({ meta }: { meta: VideoMetadata }) {
  const accentClass = meta.video_id === "A" ? styles.accentA : styles.accentB;

  return (
    <div className={`${styles.card} ${accentClass}`}>
      <div className={styles.header}>
        <span className={styles.badge}>Video {meta.video_id}</span>
        <span className={styles.platform}>{PLATFORM_LABEL[meta.platform]}</span>
      </div>

      {meta.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.thumb}
          src={meta.thumbnail}
          alt={meta.title ?? "thumbnail"}
          loading="lazy"
        />
      ) : (
        <div className={styles.thumbPlaceholder}>No thumbnail</div>
      )}

      <h3 className={styles.title} title={meta.title ?? ""}>
        {meta.title ?? "Untitled"}
      </h3>

      <div className={styles.creator}>
        {meta.creator_url ? (
          <a href={meta.creator_url} target="_blank" rel="noreferrer">
            {meta.creator ?? "Unknown creator"}
          </a>
        ) : (
          <span>{meta.creator ?? "Unknown creator"}</span>
        )}
        <span className={styles.followers}>
          {compactNumber(meta.follower_count)} followers
        </span>
      </div>

      <div className={styles.engagement}>
        <span className={styles.engLabel}>Engagement rate</span>
        <span className={styles.engValue}>
          {formatPercent(meta.engagement_rate)}
        </span>
      </div>

      <div className={styles.stats}>
        <Stat label="Views" value={compactNumber(meta.views)} />
        <Stat label="Likes" value={compactNumber(meta.likes)} />
        <Stat label="Comments" value={compactNumber(meta.comments)} />
        <Stat label="Duration" value={formatDuration(meta.duration_seconds)} />
        <Stat label="Uploaded" value={meta.upload_date ?? "—"} />
        <Stat
          label="Transcript"
          value={`${meta.transcript_source ?? "—"} · ${meta.chunk_count} chunks`}
        />
      </div>

      {meta.hashtags?.length > 0 && (
        <div className={styles.tags}>
          {meta.hashtags.slice(0, 8).map((t) => (
            <span key={t} className={styles.tag}>
              #{t.replace(/^#/, "")}
            </span>
          ))}
        </div>
      )}

      <a
        className={styles.sourceLink}
        href={meta.source_url}
        target="_blank"
        rel="noreferrer"
      >
        Open original ↗
      </a>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}
