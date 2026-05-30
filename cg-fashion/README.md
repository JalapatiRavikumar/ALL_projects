# CG Fashion - Sicuaura Global Frontend Engineering Assessment

A production-ready, high-performance e-commerce frontend implementation built for the Sicuaura Global Frontend Engineering Internship assessment. This application translates a premium fashion catalog layout into a responsive, fluid, and optimized Next.js 14 App Router application.

### 🔗 Deployment & Codebase
* **Live Deployment URL**: [https://sicuaura-global-frontend.vercel.app](https://sicuaura-global-frontend.vercel.app)
* **GitHub Repository (Nested)**: [JalapatiRavikumar/ALL_projects/cg-fashion](https://github.com/JalapatiRavikumar/ALL_projects/tree/main/cg-fashion)

---

## ⚡ Core Features (Delivered)
1. **Product Catalog**: Beautiful interactive grid loaded with live product items retrieved from the DummyJSON API.
2. **Advanced Search & Filtering**:
   - Debounced search query input (500ms delay) to prevent excessive network calls.
   - Dynamic sidebar categories selection, rating sort, and **fully functional price range selectors** (Under $50, $50-$100, $100-$200, Over $200).
   - Synchronization of parameters with browser URL query strings (`?q=...&category=...`) to support shareable and indexable search results.
3. **Cart & Wishlist Drawer**: Slide-in overlay context panels managing bags, increments, item deletion, and bookmarks.
4. **Order Confirmation & Checkout**: Secure billing forms, tax calculation, transaction loading indicators, and simulated timelines tracking processed status.
5. **Optimal User Experience States**:
   - Elegant skeletons preventing Cumulative Layout Shift (CLS).
   - Safe illustration-centered fallback empty states when search criteria return zero products.

---

## 🧠 Architectural & Technical Decisions

### 1. Hybrid Rendering Strategy (Next.js 14 App Router)
- **Server Components (SSR)**: The landing page (`page.tsx`) utilizes server-side data fetching (`revalidate: 3600`) to render featured collections instantly on the server. This guarantees optimal Largest Contentful Paint (LCP) speed and allows search engines to index our meta metadata seamlessly.
- **Client Components ("use client")**: Used strictly for interactive modules like search panels, checkout steps, and drawers to keep the JS bundles lightweight.

### 2. Solving API Filtering Limitations
- **Problem**: The DummyJSON API does not natively support querying by *both* a search text string and a category identifier at the same time.
- **Solution**: We retrieve the matching search text dataset (up to 100 entries) and execute category filters, price-range checks, and price/rating sorting **locally on the client side**. This prevents API routing errors and enables instantaneous, fluid filter adjustments.

### 3. Hydration-Safe State Persistence
- We utilized React Context (`store.tsx`) to avoid bloating the application with heavy state packages like Redux.
- **SSR Mismatch Mitigation**: Reading from browser `localStorage` on initial server compilation results in "Hydration Mismatch" runtime crashes. We resolved this by mounting the app first (`isMounted: true`) before syncing browser states, achieving smooth SSR compatibility.

### 4. Zero-Dependency Social Icons
- Newer versions of `lucide-react` deprecate brand marks (Facebook, Instagram, Twitter) to focus on structural glyphs. Rather than pulling in extra bulky SVG packages, we designed inline custom SVG icons in our footer, ensuring successful, zero-warning TypeScript compiles.

### 5. Suspense Boundaries
- Wrapped search layouts in Next.js `<Suspense>` boundaries to satisfy static compiler generation rules and prevent layout generation blocks during build pipelines.

---

## 💻 Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch dev environment:
   ```bash
   npm run dev
   ```
3. Run optimized production compiles:
   ```bash
   npm run build
   ```
