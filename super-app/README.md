# 🎬 Super App — Multi-View Entertainment Dashboard

A premium, multi-page Next.js entertainment dashboard featuring registration, category selection, a real-time widget dashboard, and a genre-filtered movie discovery page.

## 🚀 Live Demo

**[https://super-app-dashboard-psi.vercel.app](https://super-app-dashboard-psi.vercel.app)**

## 🚀 Live Features

| Page | Route | Description |
|------|-------|-------------|
| Registration | `/` | Split-screen sign-up with live form validation |
| Onboarding | `/onboarding` | 9-grid animated genre picker (min. 3 required) |
| Dashboard | `/dashboard` | 5-widget grid: Profile, Weather, Notes, Timer, News |
| Movies | `/movies` | Genre-filtered movie rows with detail modal |

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **State:** Zustand with localStorage persistence
- **Styling:** Tailwind CSS v4 — fully custom, no component libraries
- **Icons:** lucide-react
- **Fonts:** Inter + Pacifico (Google Fonts)

## 📦 Key Components

### Pages
- **Register** (`/`) — Name, Username, Email, Mobile validation; regex email check; 10-digit mobile check
- **Onboarding** (`/onboarding`) — 9 genre tiles (Action, Drama, Romance, Thriller, Sci-Fi, Horror, Comedy, Western, Fantasy) with neon active-glow border
- **Dashboard** (`/dashboard`) — Responsive 3-column grid
- **Movies** (`/movies`) — Horizontal scroll rows per genre with hover animations

### Dashboard Widgets
- **ProfileCard** — Avatar (DiceBear), name, email, username + selected category pills
- **WeatherWidget** — Live clock (pink header) + mock weather metrics grid
- **NotesWidget** — Auto-saving textarea bound to Zustand store
- **TimerWidget** — Radial SVG ring countdown with +/- spinners, Start/Pause/Reset
- **NewsFeed** — Auto-cycling news articles every 2s with fade transition

### Movie Discovery
- **MovieRow** — Horizontal snap-scroll row per genre
- **MovieCard** — Hover scale + green glow shadow + rating overlay
- **MovieModal** — Full-screen details (poster, plot, cast, runtime, IMDB rating)

## ⚙️ Setup

```bash
cd super-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
super-app/
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, fonts
│   │   ├── page.tsx            # Registration page
│   │   ├── onboarding/page.tsx # Genre picker
│   │   ├── dashboard/page.tsx  # Widget dashboard
│   │   └── movies/page.tsx     # Movie discovery
│   ├── components/
│   │   ├── ui/                 # Input, Button, Modal
│   │   ├── dashboard/          # ProfileCard, Weather, Notes, Timer, News
│   │   └── movies/             # MovieCard, MovieRow, MovieModal
│   ├── constants/data.ts       # All mock data (movies, news, weather, categories)
│   ├── hooks/                  # useTimer, useWeather
│   ├── store/useSuperStore.ts  # Zustand global state
│   └── types/index.ts          # TypeScript interfaces
├── next.config.ts
├── tailwind.config (via @theme in globals.css)
└── tsconfig.json
```

## 🎨 Design System

| Token | Value |
|-------|-------|
| Brand Green | `#72DB73` |
| Brand Pink | `#FF4ADE` |
| Brand Orange | `#FF5209` |
| Profile BG | `#5746EA` |
| Notes BG | `#F1C75B` |
| Timer BG | `#1E1E2F` |
| Weather BG | `#101744` |
