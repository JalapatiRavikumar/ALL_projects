# Dual-Video RAG Chatbot

A full-stack RAG chatbot that compares two social media videos. Paste a YouTube and Instagram URL, and it pulls the metadata, transcripts, and engagement stats for both — then lets you chat with an AI that actually cites where its answers come from.

**Live demo:** https://frontend-ten-alpha-67.vercel.app  
**Repo:** https://github.com/JalapatiRavikumar/ALL_projects/tree/main/dual-video-rag

---

## What it does

You give it two video URLs. It:

- Pulls metadata via yt-dlp — views, likes, comments, creator, follower count, hashtags, upload date, duration
- Computes engagement rate as `(likes + comments) / views × 100`
- Gets the transcript from YouTube captions if available, otherwise falls back to local Whisper STT
- Chunks and embeds the transcripts, stores them in Qdrant tagged with `video_id` A or B
- Gives you a chat interface where every answer streams token by token and cites the exact chunk it used

The chat remembers previous turns so you can ask follow-up questions naturally.

Sample questions it handles well:
- Why did Video A get more engagement than Video B?
- What's the engagement rate of each?
- Compare the hooks in the first 5 seconds
- Who's the creator of Video B and what's their follower count?
- Suggest improvements for B based on what worked in A

---

## Stack

| Layer | What | Why |
|---|---|---|
| Frontend | Next.js 15 | SSR, clean deploy to Vercel |
| Backend | FastAPI + uvicorn | Async-native, easy SSE streaming |
| Orchestration | LangGraph + LangChain | StateGraph with MemorySaver gives cross-turn memory out of the box |
| Embeddings | fastembed BGE small (ONNX) | Runs on CPU, no torch, no API key, zero cost per chunk |
| Vector DB | Qdrant | Works embedded locally and on Qdrant Cloud with the same code |
| LLM | OpenRouter → gpt-4o-mini | Cheapest capable model, easy to swap via .env |
| Transcripts | youtube-transcript-api + faster-whisper | Captions are free and instant, Whisper covers everything else |
| Metadata | yt-dlp | Handles YouTube and Instagram without needing official API keys |

---

## How it's structured

```
dual-video-rag/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI routes
│   │   ├── config.py        # Settings from .env
│   │   ├── models.py        # Pydantic models
│   │   ├── ingest.py        # yt-dlp + transcript logic
│   │   ├── chunking.py      # Text splitting with timestamp mapping
│   │   ├── embeddings.py    # fastembed wrapper
│   │   ├── vectorstore.py   # Qdrant operations
│   │   ├── rag_graph.py     # LangGraph retrieve → generate
│   │   ├── chat_service.py  # Streaming + citations
│   │   ├── sessions.py      # Session storage (disk-backed)
│   │   └── transcription.py # Whisper fallback
│   ├── requirements.txt
│   ├── .env.example
│   └── run.ps1
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main page
│   │   └── globals.css
│   ├── components/
│   │   ├── VideoCard.tsx    # Per-video metadata display
│   │   └── ChatPanel.tsx    # Streaming chat UI
│   ├── lib/
│   │   ├── api.ts           # fetch wrappers + SSE parser
│   │   ├── types.ts
│   │   └── format.ts
│   └── next.config.mjs
│
└── README.md
```

---

## Running it locally

### Backend

```bash
cd backend

python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt

cp .env.example .env
# edit .env and add your LLM key

.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000" > .env.local
npm run dev
```

Open http://localhost:3000, paste two video URLs, click Ingest & Analyze.

---

## Environment variables

### backend/.env

```
LLM_PROVIDER=openai
LLM_MODEL=openai/gpt-4o-mini
OPENAI_API_KEY=your-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1

# or use Gemini
# LLM_PROVIDER=google_genai
# LLM_MODEL=gemini-2.0-flash
# GOOGLE_API_KEY=your-key

EMBEDDING_MODEL=BAAI/bge-small-en-v1.5
QDRANT_PATH=./.qdrant_data

CHUNK_SIZE=800
CHUNK_OVERLAP=120
RETRIEVAL_TOP_K=6

WHISPER_ENABLED=true
WHISPER_MODEL=tiny

CORS_ORIGINS=http://localhost:3000
```

### frontend/.env.local

```
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
```

---

## Instagram

Instagram blocks anonymous requests. You need to pass cookies.

The easiest way on your own machine:

1. Install the "Get cookies.txt LOCALLY" extension in Chrome
2. Log into instagram.com, click the extension, export cookies
3. Save the file as `backend/ig_cookies.txt`
4. Add `COOKIES_FILE=./ig_cookies.txt` to your `.env`

Note: Chrome locks its cookie DB while running. If `COOKIES_FROM_BROWSER=chrome` doesn't work, close Chrome first or use the cookies.txt approach above.

---

## Deploying

Frontend goes to Vercel:

```bash
cd frontend
npx vercel --prod
```

For the backend, expose your local server with ngrok (not Cloudflare quick tunnels — those buffer SSE responses and break streaming):

```bash
npx ngrok http 8000
# copy the https URL into frontend/.env.local as NEXT_PUBLIC_BACKEND_URL
# redeploy frontend
```

For a proper production setup, host the backend on Railway or Render, point `QDRANT_URL` at Qdrant Cloud, and set your env vars in the dashboard.

---

## Cost at scale (1000 creators/day)

| Thing | Cost |
|---|---|
| Embeddings | $0 — local ONNX |
| Transcripts | $0 — YouTube captions cover ~80%, Whisper covers the rest locally |
| Vector storage | ~$0.001/session on Qdrant Cloud |
| LLM (gpt-4o-mini, ~5 turns/session) | ~$0.01–0.02/session |
| **Total** | **~$10–20/day** |

The main cost lever is the LLM. If you need to cut further, swap to a free model on OpenRouter (gemma-2, llama-3) — the rest of the stack doesn't change.

What breaks at scale and how to fix it:

- **In-process session store** → swap `sessions.py` for Redis
- **Embedded Qdrant** → point `QDRANT_URL` at Qdrant Cloud, same client code
- **LangGraph MemorySaver** → replace with a Redis or Postgres checkpointer
- **Single uvicorn worker** → `--workers 4` once you have external Qdrant + Redis

---

## Known limitations

- Instagram needs auth cookies to work (see section above)
- Conversation history is lost on backend restart (MemorySaver is in-process)
- Embedded Qdrant only works with a single process — use Qdrant Cloud for multi-worker setups
- ngrok free tier changes URL on restart, so you need to update NEXT_PUBLIC_BACKEND_URL and redeploy
