# Deployment Guide

## Quick Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. From project root, run:
```bash
vercel
```

3. Follow the prompts:
   - Set up and deploy? Yes
   - Which scope? Select your account
   - Link to existing project? No
   - What's your project's name? mall-of-america-deck
   - In which directory is your code located? ./
   - Want to modify settings? No

4. Your project will be deployed and you'll receive a live URL.

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Mall of America Interactive Deck"
git branch -M main
git remote add origin [your-github-repo-url]
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. Click "Deploy"

## Alternative: Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

## Alternative: Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. Update vite.config.js with base path:
```javascript
export default defineConfig({
  base: '/mall-of-america-deck/',
  // ... rest of config
})
```

4. Deploy:
```bash
npm run deploy
```

## Environment Variables (if needed)

Create `.env` file for any API keys or configuration:
```
VITE_API_KEY=your_api_key_here
```

## Performance Checklist

Before deploying, ensure:
- [ ] All images are optimized (use WebP/AVIF)
- [ ] Videos are compressed and in multiple formats
- [ ] Lazy loading is implemented
- [ ] Bundle size is minimized
- [ ] Lighthouse score is 90+

## Post-Deployment

1. Test on multiple devices
2. Check all navigation links
3. Verify video playback
4. Test CTAs and buttons
5. Validate responsive behavior
6. Run Lighthouse audit

## Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

## Monitoring

- Set up analytics (Google Analytics, Vercel Analytics)
- Monitor performance metrics
- Track user engagement
- Set up error logging (Sentry)

## Troubleshooting

### Build fails:
- Check Node.js version (needs 18+)
- Clear node_modules and reinstall
- Check for TypeScript/ESLint errors

### Videos not playing:
- Ensure proper MIME types on server
- Check video format compatibility
- Verify CORS headers if using external CDN

### Performance issues:
- Reduce image/video sizes
- Enable code splitting
- Implement proper lazy loading
- Use CDN for assets
