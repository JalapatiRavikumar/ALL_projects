# Dual-Video RAG Chatbot

A full-stack **Retrieval-Augmented Generation** chatbot that takes two social media video URLs, pulls their transcripts and metadata dynamically, chunks and embeds them into a vector database, and lets a creator ask grounded, cited questions about both videos in a streaming chat interface.

**Live demo →** https://frontend-ten-alpha-67.vercel.app  
**GitHub →** https://github.com/JalapatiRavikumar/ALL_projects/tree/main/dual-video-rag

---

## What it does

1. **Paste two URLs** — YouTube or Instagram Reel (mandatory mix per task spec)
2. **Ingest pipeline runs automatically:**
   - Pulls metadata via `yt-dlp`: views, likes, comments, creator, follower count, hashtags, upload date, duration, thumbnail
   - Computes `engagement_rate = (likes + comments) / views × 100` dynamically
   - Fetches transcript via YouTube captions API (free, instant) or falls back to local Whisper STT on CPU
   - Chunks transcript at 800 chars / 120 overlap, embeds with local ONNX BGE model, stores in Qdrant with `video_id` tag (A or B)
3. **Ask anything in the chat:**
   - Why did Video A get more engagement than Video B?
   - What's the engagement rate of each?
   - Compare the hooks in the first 5 seconds
   - Who's the creator of Video B and what's their follower count?
   - Suggest improvements for B based on what worked in A
4. **Every answer:** streams token-by-token, cites which video + which chunk it used, maintains memory across turns

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| **Frontend** | Next.js 15 + React 19 | SSR + streaming-safe fetch, Vercel deploy |
| **Backend** | FastAPI + uvicorn | Async-native, SSE streaming, clean OpenAPI docs |
| **Orchestration** | LangGraph 1.2 + LangChain 1.3 | StateGraph with MemorySaver checkpointer gives cross-turn memory; retrieve → generate graph is inspectable and extendable |
| **Embeddings** | fastembed 0.8 (BAAI/bge-small-en-v1.5, ONNX) | **$0 marginal cost** — runs on CPU via onnxruntime, no torch, no GPU, no hosted API. At 1000 creators/day this is the single biggest cost lever |
| **Vector DB** | Qdrant 1.18 (embedded local → Qdrant Cloud) | Same client code for local dev and cloud. HNSW search, payload filtering by `session_id`/`video_id`, Rust core = fast + low memory |
| **LLM** | OpenRouter → `openai/gpt-4o-mini` (default) | Cheapest capable model. Swap to Gemini Flash, GPT-4o, or any OpenAI-compatible endpoint via `.env` — zero code change |
| **Transcripts** | `youtube-transcript-api` → `faster-whisper` fallback | Captions are free and instant for most YouTube videos. Whisper (local CPU, int8) covers Reels and caption-less clips |
| **Metadata** | `yt-dlp` | Works for both YouTube and Instagram without official API keys |
| **Tunnel** | ngrok (dev) | True SSE streaming — Cloudflare quick tunnels buffer responses, ngrok does not |

---

## Architecture

```
Browser (Vercel)
  │
  ├─ POST /api/ingest ──► FastAPI
  │                          │
  │                          ├─ yt-dlp          → metadata + engagement_rate
  │                          ├─ yt-transcript    → captions (YouTube)
  │                          ├─ faster-whisper   → audio STT fallback
  │                          ├─ RecursiveCharacterTextSplitter → chunks
  │                          ├─ fastembed BGE    → embeddings (local ONNX)
  │                          └─ Qdrant           → upsert(session_id, video_id, chunk)
  │
  └─ POST /api/chat ───► FastAPI → LangGraph
                              │
                              ├─ retrieve node:  Qdrant search (top-k overall
                              │                  + guaranteed per-video slice)
                              ├─ generate node:  LLM.astream(system + metadata
                              │                  + chunks + history)
                              └─ SSE stream ───► browser (token by token)
                                                 MemorySaver checkpointer
                                                 persists turns in-process
```

---

## Why these specific numbers

| Parameter | Value | Reasoning |
|---|---|---|
| `CHUNK_SIZE` | 800 chars (~200 tokens) | Large enough to hold a complete hook/thought; small enough for precise retrieval without blowing context |
| `CHUNK_OVERLAP` | 120 chars (15%) | Prevents semantic meaning from being cut across a boundary; standard practice |
| `RETRIEVAL_TOP_K` | 6 | 3 per video guaranteed + top-k overall ensures comparative questions always have both sides |
| `WHISPER_MODEL` | tiny (int8 CPU) | Fastest on CPU, good enough for short-form content; upgrade to `base` or `small` for longer videos |
| Embedding dim | 384 (bge-small) | MTEB-competitive at a fraction of the cost of larger models; keeps Qdrant memory small at scale |

---

## Project structure

```
dual-video-rag/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, ingest + SSE chat endpoints
│   │   ├── config.py        # All settings via pydantic-settings + .env
│   │   ├── models.py        # Pydantic request/response models
│   │   ├── ingest.py        # yt-dlp metadata, transcript sources, fallback
│   │   ├── chunking.py      # RecursiveCharacterTextSplitter + timestamp mapping
│   │   ├── embeddings.py    # fastembed BGE singleton (lazy, thread-safe)
│   │   ├── vectorstore.py   # Qdrant client, upsert, search, delete
│   │   ├── rag_graph.py     # LangGraph StateGraph (retrieve → generate)
│   │   ├── chat_service.py  # Streaming orchestration, citation emission
│   │   ├── sessions.py      # In-process session registry (swap Redis at scale)
│   │   └── transcription.py # faster-whisper STT fallback
│   ├── scripts/
│   │   ├── smoke_ingest.py  # Manual end-to-end ingest test
│   │   └── debug_chat.py    # Manual SSE chat test
│   ├── requirements.txt
│   ├── .env.example
│   └── run.ps1              # Auto-frees port 8000, starts uvicorn
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main page: ingest form + workspace
│   │   ├── layout.tsx
│   │   └── globals.css      # Dark theme CSS variables
│   ├── components/
│   │   ├── VideoCard.tsx    # Metadata card per video
│   │   └── ChatPanel.tsx    # SSE streaming chat UI, citation pills
│   ├── lib/
│   │   ├── api.ts           # ingestVideos + streamChat (direct, bypass proxy)
│   │   ├── types.ts         # Shared TypeScript types
│   │   ├── format.ts        # compactNumber, formatDuration, formatPercent
│   │   └── useMounted.ts    # Hydration-safe client-only hook
│   ├── vercel.json
│   └── next.config.mjs
│
├── .gitignore
└── README.md
```

---

## Local setup

### Prerequisites
- Python 3.11+ (tested on 3.14.3)
- Node.js 18+
- An LLM API key — OpenRouter (default) or OpenAI or Google Gemini

### Backend

```bash
cd backend

# Create venv and install
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt   # Windows
# source .venv/bin/activate && pip install -r requirements.txt  # Mac/Linux

# Configure
cp .env.example .env
# Edit .env — set at minimum one of:
#   OPENAI_API_KEY + OPENAI_BASE_URL=https://openrouter.ai/api/v1
#   GOOGLE_API_KEY (Gemini)

# Run
.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

API docs: http://127.0.0.1:8000/docs

### Frontend

```bash
cd frontend
npm install

# Point at your local backend
echo "NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000" > .env.local

npm run dev
# → http://localhost:3000
```

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `LLM_PROVIDER` | `google_genai` | `openai` or `google_genai` |
| `LLM_MODEL` | `gemini-2.0-flash` | Any model supported by the provider |
| `OPENAI_API_KEY` | — | OpenAI or OpenRouter key |
| `OPENAI_BASE_URL` | — | Set to `https://openrouter.ai/api/v1` for OpenRouter |
| `GOOGLE_API_KEY` | — | Gemini API key |
| `EMBEDDING_MODEL` | `BAAI/bge-small-en-v1.5` | Any fastembed-supported model |
| `QDRANT_URL` | — | Leave empty for embedded local mode |
| `QDRANT_API_KEY` | — | Required if using Qdrant Cloud |
| `CHUNK_SIZE` | `800` | Chars per chunk |
| `CHUNK_OVERLAP` | `120` | Overlap between chunks |
| `RETRIEVAL_TOP_K` | `6` | Chunks retrieved per query |
| `WHISPER_MODEL` | `tiny` | `tiny` / `base` / `small` |
| `WHISPER_ENABLED` | `true` | Set `false` to skip audio fallback |
| `COOKIES_FROM_BROWSER` | — | `chrome`/`edge`/`firefox` — for Instagram auth |
| `COOKIES_FILE` | — | Path to Netscape cookies.txt — for Instagram auth |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed origins |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Backend URL the **browser** calls directly for SSE streaming |

---

## Instagram support

Instagram blocks anonymous requests with "login required". Two options:

**Option 1 — Browser cookies (easiest on your own machine):**
```
COOKIES_FROM_BROWSER=chrome   # must have instagram.com open and logged in
```
> Note: Chrome/Edge lock the cookie DB while running. Close the browser first, or use Firefox.

**Option 2 — cookies.txt file (works on servers, recommended):**
1. Install the "Get cookies.txt LOCALLY" Chrome extension
2. Go to instagram.com while logged in → export cookies
3. Save as `backend/ig_cookies.txt`
4. Set `COOKIES_FILE=./ig_cookies.txt` in `.env`

---

## Deployment

### Frontend → Vercel (free)

```bash
cd frontend
npx vercel --prod
# Set NEXT_PUBLIC_BACKEND_URL to your public backend URL when prompted
```

### Backend → expose locally via ngrok

```bash
# In one terminal — run the backend
cd backend
.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# In another terminal — expose it
npx ngrok http 8000
# Copy the https URL → paste into frontend/.env.local as NEXT_PUBLIC_BACKEND_URL
# Redeploy Vercel with the new URL
```

> Use **ngrok**, not Cloudflare quick tunnels. Cloudflare buffers SSE responses which breaks token streaming. ngrok streams correctly.

### Backend → production cloud

For persistent deployment without a local machine:

| Service | Config |
|---|---|
| **Railway / Render** | Push `backend/` as a Python service, set env vars in dashboard |
| **Qdrant Cloud** | Set `QDRANT_URL` + `QDRANT_API_KEY` in `.env` — zero code change |
| **Embeddings** | fastembed runs on CPU in any container — no GPU needed |

---

## Scalability analysis — 1000 creators/day

### Cost breakdown per creator session

| Component | Cost | Notes |
|---|---|---|
| Embeddings | **$0** | Local ONNX BGE on CPU — marginal cost is electricity |
| Vector storage | ~$0.001 | ~20 chunks × 384 dims per session in Qdrant Cloud |
| Transcript (YT captions) | **$0** | Free API, covers ~80% of YouTube videos |
| Transcript (Whisper) | **$0** | Local CPU — covers Reels and caption-less clips |
| LLM (gpt-4o-mini via OpenRouter) | ~$0.002–0.005 | ~2000 input + 500 output tokens per chat turn |
| **Total per session (5 turns)** | **~$0.01–0.025** | At 1000 creators/day → ~$10–25/day |

### Bottlenecks at scale and fixes

| Bottleneck | Fix |
|---|---|
| In-process session store | Swap `sessions.py` for Redis — the interface is `get/set/delete`, one file change |
| Embedded Qdrant (single process) | Point `QDRANT_URL` at Qdrant Cloud or a managed instance — zero code change |
| LangGraph MemorySaver (in-process) | Replace with `AsyncRedisSaver` or Postgres checkpointer from langgraph-checkpoint |
| Single uvicorn worker | `uvicorn --workers 4` or deploy behind gunicorn; stateless once Redis/Qdrant are external |
| Whisper on CPU is slow for long videos | Route videos >5min to AssemblyAI/Deepgram via `WHISPER_ENABLED=false` + hosted STT |

### Is this the most efficient stack?

For the **free/trial tier**, yes:
- Local embeddings eliminate the biggest per-request cost line
- `bge-small-en-v1.5` at 384 dims is the sweet spot — MTEB-competitive, half the storage of `bge-base`, 6× cheaper than OpenAI `text-embedding-3-small`
- `gpt-4o-mini` via OpenRouter is 15× cheaper than GPT-4o for the same quality on factual Q&A tasks

**If cost is the only constraint:** replace the LLM with `google/gemma-2-9b-it` (free on OpenRouter) and the answer quality stays acceptable for engagement analysis. That brings the LLM cost to $0.

**If quality is the only constraint:** upgrade to `gpt-4o` or `claude-3-5-sonnet` and keep everything else the same — the retrieval and embedding stack doesn't change.

---

## Limitations and known issues

- **Instagram requires authentication** — see Instagram support section above
- **Qdrant embedded mode** is single-process only — multiple uvicorn workers will conflict; use Qdrant Cloud for multi-worker deploys
- **ngrok free tier** changes URL on restart — update `NEXT_PUBLIC_BACKEND_URL` and redeploy Vercel when this happens
- **MemorySaver** is in-process — conversation history is lost on backend restart; users must re-ingest

---

## License

MIT
