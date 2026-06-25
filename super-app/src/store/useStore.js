// Re-export the canonical store so every component can import from here.
// This keeps the old import path working while the canonical store lives at useSuperStore.js
export { useSuperStore as useStore } from './useSuperStore';
