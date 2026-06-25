import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

import Register   from '../pages/Register';
import Categories from '../pages/Categories';
import Dashboard  from '../pages/Dashboard';
import Movies     from '../pages/Movies';

// ── Route Guards ──────────────────────────────────────────────────────────────

/** Requires the user to have registered (name exists in store) */
function RequireUser({ children }) {
  const name = useStore(s => s.user.name);
  if (!name) return <Navigate to="/" replace />;
  return children;
}

/** Requires the user to have selected at least 3 categories */
function RequireCategories({ children }) {
  const name        = useStore(s => s.user.name);
  const categoryIds = useStore(s => s.categoryIds);
  if (!name)              return <Navigate to="/"           replace />;
  if (categoryIds.length < 3) return <Navigate to="/categories" replace />;
  return children;
}

// ── Route Definitions ─────────────────────────────────────────────────────────

export default function AppRoutes() {
  return (
    <Routes>
      {/* Step 1 — Registration (public) */}
      <Route path="/" element={<Register />} />

      {/* Step 2 — Category Selection (requires registration) */}
      <Route
        path="/categories"
        element={
          <RequireUser>
            <Categories />
          </RequireUser>
        }
      />

      {/* Step 3 — Dashboard (requires registration + ≥3 categories) */}
      <Route
        path="/dashboard"
        element={
          <RequireCategories>
            <Dashboard />
          </RequireCategories>
        }
      />

      {/* Step 4 — Movies (requires registration + ≥3 categories) */}
      <Route
        path="/movies"
        element={
          <RequireCategories>
            <Movies />
          </RequireCategories>
        }
      />

      {/* Catch-all — redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
