# Quick Start Guide

## Get Running in 3 Minutes

### Prerequisites
- Node.js 18 or higher ([Download here](https://nodejs.org/))
- npm (comes with Node.js) or yarn

Check your version:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

### Installation & Setup

1. **Clone or download this repository**
```bash
git clone [repository-url]
cd mall-of-america-deck
```

2. **Install dependencies**
```bash
npm install
```
This will take 1-2 minutes to download all required packages.

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to: `http://localhost:5173`

You should see the Mall of America interactive sales deck!

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

### Project Structure

```
mall-of-america-deck/
├── public/              # Static assets (icons, etc.)
├── src/
│   ├── components/      # React components
│   │   ├── Hero.jsx
│   │   ├── Navigation.jsx
│   │   ├── WhyMOA.jsx
│   │   ├── Retail.jsx
│   │   ├── Luxury.jsx
│   │   ├── Dining.jsx
│   │   ├── Attractions.jsx
│   │   ├── Events.jsx
│   │   ├── Venues.jsx
│   │   └── CallToAction.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

### Making Changes

1. **Edit Components**: Modify files in `src/components/`
2. **Hot Reload**: Changes appear instantly in browser (no refresh needed)
3. **Add Styling**: Use Tailwind utility classes or modify `src/index.css`
4. **Update Content**: Edit component JSX for text, stats, and structure

### Common Customizations

#### Change Brand Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'moa-blue': '#003DA5',
  'moa-red': '#E31837',
  'moa-gold': '#D4AF37',
}
```

#### Update Statistics
Search for stat objects in components (e.g., `Hero.jsx`):
```javascript
{ value: '40M+', label: 'Annual Visitors' }
```

#### Add New Sections
1. Create new component in `src/components/NewSection.jsx`
2. Import in `src/App.jsx`
3. Add to navigation in `src/components/Navigation.jsx`

### Deploying

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy to Vercel:**
```bash
npm install -g vercel
vercel
```

### Troubleshooting

**Port already in use:**
```bash
# Vite will try the next available port automatically
# or specify a different port:
npm run dev -- --port 3000
```

**Dependencies won't install:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build fails:**
```bash
# Check Node.js version
node --version  # Must be 18+

# Try clearing Vite cache
rm -rf node_modules/.vite
npm run build
```

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Next Steps

1. Review [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for architecture details
2. Read [WRITEUP.md](./WRITEUP.md) for design rationale
3. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for publishing instructions
4. Customize content for your needs
5. Replace placeholder videos/images with real assets

### Getting Help

- Check the README.md for comprehensive documentation
- Review component code for implementation examples
- Consult Vite docs: https://vitejs.dev
- Consult React docs: https://react.dev
- Consult Tailwind docs: https://tailwindcss.com
- Consult Framer Motion docs: https://www.framer.com/motion

---

**You're ready to go! Start the dev server and begin customizing.**
