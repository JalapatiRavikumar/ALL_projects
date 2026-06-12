# 🛰️ Orbital Ops Dashboard — Cognitive Operations Cockpit

> **High-Stakes Situational Awareness Interface** built with React 19 + TypeScript + Vite + Tailwind CSS.  
> Modeled on the **Endsley 3-Level SA Model** (Perception → Comprehension → Projection) and the **Astro UXDS** status color system.

---

## 📸 Overview

A fully live, dark-cockpit command interface for monitoring **20 operational assets** across a geospatial AOR (Area of Responsibility). Designed for high-information-density environments where every pixel of color carries meaning.

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔴 COGNITIVE OPERATIONS COCKPIT    ACTIVE: 13/20   ALERTS: 7   ⏱  │
├──────────────────┬──────────────────────────────┬───────────────────┤
│  🔴 ALERT FEED   │  🔵 ASSET ROSTER (sortable)  │                   │
│                  ├──────────────────────────────┤  🟢/🔵/🟡/🔴     │
│  HIGH  → red     │  🟢 TACTICAL MAP (SVG radar) │  DETAIL PANEL     │
│  MED   → amber   │  • Pan + Zoom                │  (dynamic color   │
│  LOW   → yellow  │  • Hover tooltips            │   per asset state)│
│                  │  • Per-type dot colors       │                   │
└──────────────────┴──────────────────────────────┴───────────────────┘
```

---

## ✨ Features

### 🎨 Color-Coded Zone System
Every panel has a distinct ambient glow identity:

| Panel | Zone Color | Purpose |
|-------|-----------|---------|
| Header Bar | 🔴 Red `#FF3838` | Critical ops identity, threat awareness |
| Alert Feed | 🔴 Red → Amber → Yellow | Per-priority danger gradient |
| Asset Roster | 🔵 Cyan `#2DCCFF` | Intel / data panel |
| Tactical Map | 🟢 Neon-Green `#39FF14` | Radar / operational view |
| Detail Panel | **Dynamic** | Switches color based on selected asset status |

### 🗺️ Asset Type Colors (consistent across ALL panels)
| Type | Color | Hex |
|------|-------|-----|
| Patrol | 🔵 Cyan | `#2DCCFF` |
| Rescue | 🟢 Neon-Green | `#39FF14` |
| Support | 🟠 Orange | `#FF9500` |

### 📡 Tactical Map (SVG Radar)
- Asset dots colored by **type** (Patrol/Rescue/Support)
- Status shown via colored **outer ring** (Active=green, Standby=cyan, Unstable=yellow, SignalLoss=red pulsing blob)
- **Bearing arrows** per asset type color
- **Hover tooltips** — name, status, signal%, velocity, coordinates
- **Animated radar sweep** with trail fade
- **Pan** (drag) + **Zoom** (scroll wheel) + **Reset** button
- SVG `<filter>` glows per type — dots emit real light

### 🚨 Alert Triage Feed
- Real-time priority-sorted alert log
- **High** → red glow card | **Medium** → amber glow card | **Low** → yellow glow card
- Search by ID, asset, or message
- Filter tabs per priority level
- **Acknowledge** button heals the alert count in the header
- Selected asset highlights matching alert cards with cyan ring

### 📋 Asset Roster Table
- **20 assets** across 3 types
- Sortable by: Name, Type, Status, Signal, Battery, Velocity
- Filter chips for type and status
- Live signal bars with color-coded fill
- Selected row gets a cyan left-accent bar

### 🔍 Asset Detail Panel
- Full telemetry: Signal %, Battery %, Velocity, Bearing (with compass label), Last Ping
- **MiniSparklines** for signal and battery history trends
- Position history breadcrumbs (lat/lon per tick)
- **SA Level-3 Projection** — delta trends + risk index (LOW/MEDIUM/HIGH)
- Panel glow **changes color** based on selected asset's operational status

### ⚡ Live Simulation
- Telemetry nudges every tick (signal, battery, position drift along bearing)
- New alerts spawn automatically at random
- Pause / Resume + Speed control (×1, ×2, ×5)
- UTC clock updates every second

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript ~6.0 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 3.4 + Custom CSS Glow System |
| Icons | Lucide React |
| Maps | Pure SVG (no external map lib) |
| State | React `useState` + `useEffect` (no Redux) |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Root — layout + simulation loop + state
├── types.ts                   # Strict types: Asset, Alert, AstroStatus, etc.
├── mockData.ts                # 20 assets + 10 initial alerts (Mumbai AOR)
├── index.css                  # Glow color system + Tailwind base
└── components/
    ├── GlobalStatusBar.tsx    # Top bar — KPIs + UTC clock
    ├── AlertFeed.tsx          # Left column — priority-sorted alert triage
    ├── AssetRoster.tsx        # Center top — sortable asset table
    ├── TacticalMap.tsx        # Center bottom — SVG radar map
    ├── AssetDetailPanel.tsx   # Right column — full telemetry + SA L3
    ├── MiniSparkline.tsx      # Inline SVG trend chart
    └── StatusShape.tsx        # Astro UXDS dual-coded status shapes
```

---

## 🎯 Design System

### Astro UXDS Status Shapes
Dual-coded (color + shape) for colorblind accessibility:

| Status | Shape | Color |
|--------|-------|-------|
| Critical | ■ Square | `#FF3838` Red |
| Serious | ▲ Triangle | `#FFB302` Amber |
| Caution | ◆ Diamond | `#FCE83A` Yellow |
| Normal | ● Circle | `#56F000` Green |
| Standby | ▬ Rounded Rect | `#2DCCFF` Cyan |
| Off | ⬡ Hexagon | `#9EA7AD` Gray |

### Endsley SA Model Mapping
| Level | SA Stage | Panel |
|-------|----------|-------|
| L1 | Perception | Global Status Bar + Alert Feed |
| L2 | Comprehension | Asset Roster |
| L3 | Projection | Asset Detail Panel (SA L3 section) |

---

## 🔧 Key Implementation Details

- **No external map library** — geospatial projection done with a simple linear lat/lon → SVG pixel mapping
- **SVG glow filters** — each asset type has a dedicated `<filter>` for authentic neon glow
- **Dynamic panel theming** — detail panel's `box-shadow` and `border` switch CSS class based on selected asset's `AssetStatus`
- **Stable SVG gradient IDs** — `useId()` hook prevents duplicate `id` collisions in sparklines
- **Radar sweep** — pure JS-driven `setInterval` animating 28 fade trail lines + main sweep line with glow filter
- **TypeScript strict mode** — `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`

---

## 📊 Data Model

```typescript
interface Asset {
  id: string;               // e.g. "A001"
  name: string;             // e.g. "Patrol-Alpha"
  type: 'Patrol' | 'Rescue' | 'Support';
  status: 'Active' | 'Standby' | 'Unstable' | 'SignalLoss';
  lat: number;              // WGS84
  lon: number;
  bearing: number;          // 0–359°
  velocity: number;         // km/h
  signalStrength: number;   // 0–100%
  batteryLevel: number;     // 0–100%
  signalHistory: number[];  // rolling 5-tick window
  batteryHistory: number[];
  positionHistory: [number, number][];
}
```

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/JalapatiRavikumar">JalapatiRavikumar</a></sub>
</div>
