# ShopZone — React E-Commerce Platform

A modern, responsive e-Commerce platform built with React, Vite, and Redux Toolkit. Consumes the FakeStore API.

## 🚀 Live Demo

[Live on Netlify](#) *(deployment link will be added after deploy)*

## 🛠 Tech Stack

- **Framework:** React JS (Vite)
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS v4
- **API:** Native Fetch API
- **Icons:** lucide-react

## 📦 Features

### Core
- Authentication UI (Login & Signup) — mocked with Redux state
- Home Page with hero banners, category browsing, and featured products
- Product Listing with category filtering, sorting, and search
- Product Details page with ratings and Add to Cart / Wishlist
- Cart with quantity controls and order summary
- Wishlist — toggle favourites
- Checkout (shipping + payment UI, mock order)
- Responsive design for mobile, tablet, and desktop

### Bonus
- Debounced search (500ms, custom `useDebounce` hook)
- Protected routes (`/checkout` redirects unauthenticated users)
- Light/Dark mode toggle (Tailwind dark: classes + localStorage)
- Toast notifications (custom `ToastContext`)
- Lazy loading + code splitting (React.lazy + Suspense)
- Skeleton loading screens (animate-pulse)
- Page transitions and hover animations

## 🏗 Redux Architecture

| Slice | Responsibility |
|-------|---------------|
| `authSlice` | isAuthenticated, user data, login/signup/logout |
| `productSlice` | fetchProducts, fetchCategories, filters, sort, search |
| `cartSlice` | add/remove/increment/decrement/clear |
| `wishlistSlice` | toggle/remove wishlist items |

## ⚙️ Setup

```bash
git clone https://github.com/JalapatiRavikumar/ALL_projects.git
cd ALL_projects
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Demo credentials
- Email: `demo@store.com`
- Password: `demo123`

## 📂 Structure

```
src/
├── app/store.js
├── features/
│   ├── auth/authSlice.js
│   ├── products/productSlice.js
│   ├── cart/cartSlice.js
│   └── wishlist/wishlistSlice.js
├── components/          # Navbar, ProductCard, SkeletonCard, ProtectedRoute
├── pages/               # Home, Login, Signup, ProductList, ProductDetails, Cart, Wishlist, Checkout
├── hooks/useDebounce.js
├── context/             # ToastContext, ThemeContext
├── App.jsx
└── main.jsx
```
