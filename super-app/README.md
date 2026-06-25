# 🚀 The Super App

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-FF6B6B?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
</div>

<br/>

> **The Super App** is an all-in-one personalized web dashboard that consolidates weather updates, live news, productivity tools (notes & timer), and entertainment discovery into a single, beautifully designed React application.

---

## 🚀 Live Demo

**[https://super-app-vite.vercel.app](https://super-app-vite.vercel.app)**

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| **Registration** | Split-pane layout with form validation |
| **Category Selection** | Interactive 3×3 colored grid |
| **Dashboard** | 5-widget modular layout |
| **Movies** | Genre-based horizontal scroll discovery |

---

## ✨ Features

### 🔐 User Registration
- Split-pane layout — background image on the left, dark form on the right
- Full client-side validation:
  - **Name & Username** — Required fields
  - **Email** — RFC regex validation `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - **Mobile** — Exactly 10 numeric digits
  - **Checkbox** — Must be checked to proceed
- Inline error messages with red border highlights
- Data saved to **Zustand global store** on success
- Navigates to `/categories` after successful submission

### 🎬 Category Selection
- 9 entertainment categories displayed in a **3×3 colored card grid**
- Each card has a unique themed background (Action 🔴, Drama 💜, Romance 🟢, etc.)
- **Minimum 3 categories** must be selected to proceed
- Visual selection indicator (green ring around selected cards)
- Selected categories shown as dismissible pills on the left
- Error message displayed if fewer than 3 are selected

### 📊 Super Dashboard (5 Widgets)

| Widget | Description |
|--------|-------------|
| 👤 **Profile Widget** | Displays avatar, name, email, username, and selected category chips |
| 🌤️ **Weather Widget** | Live weather via OpenWeatherMap — temp, humidity, wind, pressure |
| 📰 **News Widget** | Auto-rotating headlines every **2 seconds** using `setInterval` |
| ⏱️ **Timer Widget** | Circular SVG countdown timer with H/M/S controls, start/pause/reset |
| 📝 **Notes Widget** | Auto-saves to `localStorage` via Zustand for persistent memos |

### 🎥 Movies Discovery
- Genre-based movie rows fetched from the **OMDB API**
- Horizontal scrolling with hidden scrollbar for a native feel
- **Hover effects** — `scale-105` transform + drop shadow
- **Movie Detail Modal** — Click any movie card to see:
  - Poster, Title, Genre, Rating, Runtime, Plot, and Cast

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React.js** (Vite) | Core UI framework |
| **React Router DOM v6** | Client-side routing & route protection |
| **Zustand** | Lightweight global state management |
| **Tailwind CSS v4** | Utility-first responsive styling |
| **Axios** | HTTP client for all API integrations |
| **Lucide React** | Icon library |

---

## 🗂️ Project Structure

```
super-app/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ProfileWidget.jsx     # User info & categories display
│   │   ├── WeatherWidget.jsx     # OpenWeatherMap integration
│   │   ├── NewsWidget.jsx        # Auto-rotating news feed
│   │   ├── TimerWidget.jsx       # SVG circular countdown timer
│   │   ├── NotesWidget.jsx       # LocalStorage persistent notes
│   │   └── MovieModal.jsx        # Movie details overlay modal
│   ├── pages/
│   │   ├── Register.jsx          # Registration with validation
│   │   ├── Categories.jsx        # Genre selection grid
│   │   ├── Dashboard.jsx         # Main dashboard layout
│   │   └── Movies.jsx            # Entertainment discovery
│   ├── services/
│   │   └── apiServices.js        # Axios instances + fallback mock data
│   ├── store/
│   │   └── useStore.js           # Zustand global store
│   ├── App.jsx                   # Router setup & protected routes
│   └── main.jsx                  # React entry point
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚦 Application Routes

| Route | Page | Protection |
|-------|------|-----------|
| `/` | Registration | Public |
| `/categories` | Category Selection | Requires completed registration |
| `/dashboard` | Dashboard | Requires completed registration |
| `/movies` | Movie Discovery | Requires completed registration |

> ⚠️ Unregistered users are automatically redirected to `/` if they try to access protected routes.

---

## 🌐 API Integrations

| API | Provider | Usage | Fallback |
|-----|----------|-------|---------|
| Weather | [OpenWeatherMap](https://openweathermap.org/api) | Temperature, Humidity, Wind, Pressure | ✅ Mock data |
| News | [NewsAPI](https://newsapi.org/) | Top headlines with images | ✅ Mock data |
| Movies | [OMDB API](https://www.omdbapi.com/) | Genre-based movie search & details | ✅ Mock data |

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** or **yarn**

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/super-app.git
cd super-app
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the development server**
```bash
npm run dev
```

**4. Open in browser**
```
http://localhost:5173
```

---

## 🔑 Environment Variables (Optional API Keys)

The app ships with fallback **mock data** so it works out-of-the-box. To enable live API data, update the API keys in `src/services/apiServices.js`:

```js
// Weather (https://openweathermap.org/api)
const WEATHER_API_KEY = "your_openweathermap_key";

// News (https://newsapi.org/)
const NEWS_API_KEY = "your_newsapi_key";

// Movies (https://www.omdbapi.com/)
const OMDB_API_KEY = "your_omdb_key";
```

---

## 🧠 State Management (Zustand)

The global store (`src/store/useStore.js`) manages three slices of state:

```js
{
  user: { name, username, email, mobile },   // Registered user info
  categories: [],                             // Selected genre categories
  notes: "",                                  // Synced with localStorage
}
```

**Actions:**
- `setUser(userData)` — Saves registration form data
- `setCategories(categoryArray)` — Saves selected genres
- `setNotes(text)` — Saves notes + syncs to `localStorage`
- `resetStore()` — Clears all state

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `super-green` | `#72DB73` | Primary brand color, buttons, logo |
| `super-red` | `#FF0000` | Error states, validation |
| `super-profile` | `#5746EA` | Profile widget background |
| `super-notes` | `#F1C75B` | Notes widget background |
| `super-timer-bg` | `#1E1E2F` | Timer widget background |

**Typography:**
- Logo: `Pacifico` (cursive) — Google Fonts
- Body: `Inter` (sans-serif) — Google Fonts

---

## 📦 Key Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "zustand": "^4.x",
  "axios": "^1.x",
  "lucide-react": "^0.x",
  "tailwindcss": "^4.x",
  "@tailwindcss/postcss": "^4.x"
}
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy on **Vercel**, **Netlify**, or any static hosting provider.

---

## 🧪 Validation Rules

| Field | Rule |
|-------|------|
| Name | Required, non-empty |
| Username | Required, non-empty |
| Email | Must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Mobile | Must be exactly 10 numeric digits |
| Checkbox | Must be checked |
| Categories | Minimum 3 must be selected |

---

## 📁 Component Responsibilities

### `ProfileWidget.jsx`
Reads `user` and `categories` from Zustand and renders a styled card with avatar, name, email, username, and category pills.

### `WeatherWidget.jsx`
Fetches weather on mount using `useEffect`. Displays date/time (live-updated every minute), weather icon, temperature, pressure, wind, and humidity.

### `NewsWidget.jsx`
Fetches news articles on mount. Uses `setInterval` to advance `currentIndex` every 2 seconds. Cleans up interval on unmount to prevent memory leaks.

### `TimerWidget.jsx`
Manages `hours`, `minutes`, `seconds` state. Converts to total seconds on Start. Uses `useEffect` + `setInterval` for the countdown. Renders an SVG `<circle>` with `strokeDashoffset` proportional to remaining time.

### `NotesWidget.jsx`
Debounced `textarea` — updates local state on every keystroke and syncs to Zustand (+ `localStorage`) after a 500ms delay.

### `MovieModal.jsx`
Fetches detailed movie data from OMDB on mount using the `imdbID` prop. Renders a full-screen backdrop overlay. Closes on backdrop click or `X` button.

---

## 📄 License

This project was built as part of a **Frontend Development Assignment**. Feel free to use it as a reference for learning React, Zustand, Tailwind, and API integration.

---

<div align="center">
  <b>Built with ❤️ using React + Vite + Zustand + Tailwind CSS</b>
</div>
