# Getting Started with the Mall of America Interactive Sales Deck

Welcome! This guide will walk you through everything you need to know about this project.

## 📋 What You're Looking At

This is a fully interactive, browser-based sales presentation tool designed for Mall of America to pitch to:
- Prospective retail tenants (luxury brands, retailers, pop-ups)
- Corporate sponsors and brand partners
- Event promoters and producers

It replaces traditional pitch decks with an immersive, cinematic experience that drives business action.

## 🚀 Quick Start (3 Minutes)

### Step 1: Prerequisites
Make sure you have Node.js 18+ installed:
```bash
node --version  # Should show v18.0.0 or higher
```
Don't have Node.js? [Download it here](https://nodejs.org/)

### Step 2: Install Dependencies
```bash
npm install
```
This downloads all required packages (React, Tailwind, Framer Motion, etc.)

### Step 3: Start Development Server
```bash
npm run dev
```
The site will open at `http://localhost:5173`

### Step 4: Explore!
Click through the navigation, scroll through sections, and experience the interactive deck.

## 📁 Project Structure

```
mall-of-america-deck/
│
├── src/
│   ├── components/           # React components (one per section)
│   │   ├── Hero.jsx         # Opening cinematic hero
│   │   ├── Navigation.jsx   # Sticky navigation bar
│   │   ├── WhyMOA.jsx       # Why Mall of America section
│   │   ├── Retail.jsx       # Retail excellence section
│   │   ├── Luxury.jsx       # Luxury wing section
│   │   ├── Dining.jsx       # Dining & lifestyle section
│   │   ├── Attractions.jsx  # Attractions & entertainment
│   │   ├── Events.jsx       # Events platform section
│   │   ├── Venues.jsx       # Venue capabilities section
│   │   └── CallToAction.jsx # Final CTA section
│   │
│   ├── App.jsx              # Main app component (assembles all sections)
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles (Tailwind directives)
│
├── public/                   # Static assets
│   └── moa-icon.svg         # Favicon
│
├── Documentation/
│   ├── README.md            # Main documentation
│   ├── QUICKSTART.md        # Quick setup guide
│   ├── DEPLOYMENT.md        # How to deploy
│   ├── PROJECT_OVERVIEW.md  # Design & architecture deep dive
│   ├── WRITEUP.md           # Design rationale & AI usage
│   └── SUBMISSION_SUMMARY.md # Submission checklist
│
└── Configuration Files/
    ├── package.json         # Dependencies & scripts
    ├── vite.config.js       # Vite bundler config
    ├── tailwind.config.js   # Tailwind CSS config
    ├── postcss.config.js    # PostCSS config
    └── vercel.json          # Vercel deployment config
```

## 🎨 Key Features

### 1. Cinematic Hero Section
- Bold headline with gradient text effect
- Animated statistics bar
- Smooth scroll indicators
- Video-ready background (placeholder in current build)

### 2. Non-Linear Navigation
- Sticky navigation bar
- Jump to any section instantly
- Mobile-friendly hamburger menu
- Smooth scroll behavior

### 3. Video-First Storytelling
- Each section designed around video content
- Placeholders indicate where real MOA footage goes
- Background gradients create atmospheric depth

### 4. Scroll-Triggered Animations
- Content reveals as you scroll
- Staggered animations (0.1s delays) create rhythm
- Hover states add interactivity
- All animations are GPU-accelerated (60fps)

### 5. Data Visualization
- Large, bold numbers for key metrics
- Color-coded categories (blue/scale, red/energy, gold/performance)
- Contextual groupings
- Visual hierarchy

### 6. Responsive Design
- Mobile: < 640px (single column, touch-optimized)
- Tablet: 640px - 1024px (ideal for screen sharing)
- Desktop: 1024px+ (full feature set)
- Large: 1280px+ (enhanced spacing)

## 🛠️ Technology Stack

### Core
- **React 18**: Component-based UI framework
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Intersection Observer**: Scroll-based triggers

### Why These Choices?

**React**: Component modularity makes it easy to build and maintain complex UIs
**Vite**: Lightning-fast hot module replacement during development
**Tailwind**: Rapid styling without context switching
**Framer Motion**: Declarative animations that integrate seamlessly with React
**Intersection Observer**: Efficient scroll tracking without performance hit

## 📝 Making Modifications

### Updating Content

**Change Statistics:**
Find stat objects in components (e.g., `Hero.jsx`):
```javascript
{ value: '40M+', label: 'Annual Visitors' }
```
Update the `value` and `label` properties.

**Update Copy:**
Text content is inline in component JSX. Search for the text you want to change and edit directly.

**Add Sections:**
1. Create new component: `src/components/NewSection.jsx`
2. Import in `src/App.jsx`: `import NewSection from './components/NewSection'`
3. Add to JSX: `<NewSection />`
4. Add navigation item in `Navigation.jsx`

### Customizing Design

**Change Brand Colors:**
Edit `tailwind.config.js`:
```javascript
colors: {
  'moa-blue': '#003DA5',    // Replace with your color
  'moa-red': '#E31837',     // Replace with your color
  'moa-gold': '#D4AF37',    // Replace with your color
}
```

**Modify Animations:**
In components, find `motion` components and adjust properties:
```javascript
<motion.div
  initial={{ opacity: 0, y: 30 }}        // Starting state
  animate={{ opacity: 1, y: 0 }}         // End state
  transition={{ duration: 0.8 }}         // Timing
>
```

**Adjust Spacing:**
Tailwind classes control spacing:
- `mb-4` = margin-bottom (1rem / 16px)
- `p-8` = padding (2rem / 32px)
- `gap-6` = grid/flex gap (1.5rem / 24px)

See [Tailwind docs](https://tailwindcss.com/docs) for all utilities.

## 🚢 Deploying Your Site

### Option 1: Vercel (Recommended - Easiest)
```bash
npm install -g vercel
vercel
```
Follow prompts, get instant deployment URL.

### Option 2: Netlify
```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages
See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.

## 📊 Performance Optimization

The project is already optimized for speed:

**Code Splitting:**
- Vendor code (React, Framer Motion) split into separate chunk
- Enables parallel downloads and better caching

**Lazy Loading:**
- Components load only when needed
- Images/video load when entering viewport

**Animation Performance:**
- All animations use `transform` and `opacity` (GPU-accelerated)
- No layout-triggering properties

**CSS Optimization:**
- Tailwind purges unused styles in production
- Typical reduction: 3MB → <10KB

**Target Metrics:**
- Lighthouse Performance: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Bundle Size: < 150KB

## 🔍 Testing & Quality Assurance

**Run Lighthouse Audit:**
1. Open site in Chrome
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Click "Generate report"
5. Target: 90+ in all categories

**Test Responsiveness:**
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Test on: iPhone, iPad, Desktop sizes

**Cross-Browser Testing:**
Test in Chrome, Firefox, Safari, Edge

## 📚 Documentation Guide

- **README.md**: Start here for comprehensive overview
- **QUICKSTART.md**: Fast setup for developers
- **DEPLOYMENT.md**: Publishing instructions
- **PROJECT_OVERVIEW.md**: Design philosophy & architecture
- **WRITEUP.md**: Design rationale & AI usage (2 pages)
- **SUBMISSION_SUMMARY.md**: Deliverables checklist

## 🤖 AI Integration

This project leveraged AI tools for:

**Code Generation:**
- Component scaffolding (Claude/ChatGPT)
- Boilerplate reduction
- Animation patterns

**Content Strategy:**
- Copy refinement (GPT-4)
- Messaging optimization
- Tone consistency

**Problem-Solving:**
- Debugging assistance
- Performance optimization
- Best practices

**Asset Strategy:**
- Supplemental imagery (Midjourney/DALL-E - planned)
- Icon customization
- Pattern generation

## 🔮 Future Enhancements (Phase 2)

The architecture supports expansion into:

**Events Module:**
- Interactive event calendar
- Booking flow with availability
- Case studies with metrics

**Sponsorship Module:**
- Tiered partnership packages
- ROI calculators
- Activation examples

**Leasing Module:**
- Category-specific pitches
- Available spaces with floor plans
- Virtual tours

**Technical Improvements:**
- Real MOA video footage
- 3D venue tours
- Live data integration
- CMS for easy updates

## 🆘 Troubleshooting

**"Port 5173 already in use"**
Vite will automatically try next available port.

**Dependencies won't install**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build fails**
Check Node.js version:
```bash
node --version  # Must be 18+
```

**Animations are laggy**
1. Check browser DevTools Performance tab
2. Reduce animation complexity
3. Test on different device

**Videos not playing (when added)**
1. Check video format (MP4 H.264 most compatible)
2. Ensure proper MIME types
3. Verify CORS headers if using CDN

## 💡 Tips for Success

1. **Start with Content**: Replace placeholder text with your actual content first
2. **Then Visuals**: Add real images and videos
3. **Test Early**: Check on mobile/tablet frequently
4. **Optimize Assets**: Compress images/videos before adding
5. **Keep It Fast**: Run Lighthouse regularly
6. **Version Control**: Commit changes frequently

## 📞 Getting Help

**Documentation:**
- This guide (you're reading it!)
- Other .md files in project root
- Inline code comments

**External Resources:**
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion)

**Issues:**
- Check existing GitHub issues
- Create new issue with detailed description
- Include error messages and screenshots

## ✅ Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Explore the site in browser
4. ✅ Read PROJECT_OVERVIEW.md for design insights
5. ✅ Review component code to understand structure
6. ✅ Make your first modification (change a color!)
7. ✅ Deploy to Vercel for live URL

---

**You're all set! Happy coding! 🚀**

Questions? Check the other documentation files or review the code comments.
