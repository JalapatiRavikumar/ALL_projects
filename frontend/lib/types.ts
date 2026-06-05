export interface VideoMetadata {
  video_id: "A" | "B";
  platform: "youtube" | "instagram" | "unknown";
  source_url: string;
  native_id?: string | null;
  title?: string | null;
  creator?: string | null;
  creator_url?: string | null;
  follower_count?: number | null;
  views?: number | null;
  likes?: number | null;
  comments?: number | null;
  upload_date?: string | null;
  duration_seconds?: number | null;
  hashtags: string[];
  thumbnail?: string | null;
  engagement_rate?: number | null;
  transcript_chars: number;
  transcript_source?: string | null;
  chunk_count: number;
}

export interface IngestResponse {
  session_id: string;
  video_a: VideoMetadata;
  video_b: VideoMetadata;
  warnings: string[];
}

export interface Citation {
  video_id: string;
  chunk_index: number;
  snippet: string;
  score: number;
  start?: number | null;
  end?: number | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  streaming?: boolean;
}
