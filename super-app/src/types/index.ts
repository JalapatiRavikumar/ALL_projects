// ─── User ───────────────────────────────────────────────────────────────────
export interface UserProfile {
  name: string;
  username: string;
  email: string;
  mobile: string;
  isRegistered: boolean;
}

// ─── Categories ──────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  color: string;
  image: string;
}

// ─── Weather ─────────────────────────────────────────────────────────────────
export interface WeatherData {
  condition: string;
  temp: number;
  pressure: string;
  wind: string;
  humidity: string;
  icon: string;
}

// ─── News ────────────────────────────────────────────────────────────────────
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

// ─── Movies ──────────────────────────────────────────────────────────────────
export interface Movie {
  id: string;
  title: string;
  year: string;
  rating: string;
  runtime: string;
  genre: string;
  plot: string;
  cast: string;
  image: string;
  poster: string;
}

// ─── Store ───────────────────────────────────────────────────────────────────
export interface SuperStoreState {
  user: UserProfile;
  categoryIds: string[];
  notes: string;
  setUser: (user: UserProfile) => void;
  setCategoryIds: (ids: string[]) => void;
  setNotes: (text: string) => void;
  resetStore: () => void;
}
