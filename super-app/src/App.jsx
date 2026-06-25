import React from 'react';
import AppRoutes from './routes/AppRoutes';

/**
 * App.jsx — Root component.
 * All routing is delegated to AppRoutes.
 * BrowserRouter is provided by main.jsx.
 */
export default function App() {
  return <AppRoutes />;
}
