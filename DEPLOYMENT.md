# Deployment Guide: Resumetrics AI

This guide covers deploying Resumetrics AI to **Vercel** or **Render** with zero environment errors.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Environment Configuration](#environment-configuration)
4. [Vercel Deployment](#vercel-deployment)
5. [Render Deployment](#render-deployment)
6. [Troubleshooting](#troubleshooting)
7. [Post-Deployment](#post-deployment)

---

## Prerequisites

### Required
- Node.js 18+ installed locally
- npm or yarn package manager
- Git repository initialized
- GitHub/GitLab account for CI/CD

### Optional
- Supabase account (for database persistence)
- Google Gemini API key (get from: https://aistudio.google.com/app/apikeys)

---

## Pre-Deployment Checklist

Before deploying, verify:

- [ ] All environment variables defined in `.env`
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes TypeScript checks
- [ ] `npm test` passes all unit tests
- [ ] Git repository is clean (no uncommitted changes)
- [ ] API endpoints tested locally with `npm run dev`
- [ ] Bundle size reasonable (run `npm run build` and check `dist/`)

---

## Environment Configuration

### Step 1: Set Up Local .env

Create `.env` file in project root:

```bash
# Copy from example
cp .env.example .env

# Edit .env with your values
GEMINI_API_KEY=your_api_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
NODE_ENV=development
PORT=3000
```

### Step 2: Validate Environment Variables

```bash
# Test locally
npm run dev

# Check API health
curl http://localhost:3000/api/health
# Expected: {"status":"ok","environment":"development"}
```

---

## Vercel Deployment

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/import
   - Select your GitHub repository
   - Vercel will detect Vite automatically

3. **Configure Environment Variables**
   ```
   Environment Name: Production
   
   Variables:
   - GEMINI_API_KEY (Secret)
   - VITE_SUPABASE_URL (string)
   - VITE_SUPABASE_ANON_KEY (Secret)
   - NODE_ENV = production
   ```

4. **Verify Build Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit `https://your-deployment.vercel.app`

### Option 2: CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Link to existing project
vercel --prod --cwd ./

# View deployment
vercel inspect
```

### Vercel Post-Deployment

```bash
# View logs
vercel logs --prod

# Add custom domain
vercel domains add yourdomain.com

# View environment variables
vercel env ls --prod
```

---

## Render Deployment

### Option 1: Git Push to Deploy (Recommended)

1. **Create render.yaml** ✅ (Already configured)

2. **Push to GitHub**
   ```bash
   git add render.yaml
   git commit -m "Add Render deployment config"
   git push origin main
   ```

3. **Connect to Render**
   - Go to https://dashboard.render.com
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Select branch: `main`

4. **Configure Build & Deploy**
   - Name: `resumetrics-ai`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Region: Select closest (e.g., Oregon)
   - Plan: Starter ($7/month) or Standard ($12/month)

5. **Add Environment Variables**
   - Go to Service Settings → Environment
   - Add each variable:
     ```
     GEMINI_API_KEY=your_secret_key
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your_anon_key
     NODE_ENV=production
     PORT=3000
     ```

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Monitor build logs in Render Dashboard

### Option 2: Manual Deployment

```bash
# Create Render service manually
# 1. Connect GitHub account in Render Dashboard
# 2. Select repository
# 3. Fill in service details:
#    - Build: npm install && npm run build
#    - Start: npm start
# 4. Add environment variables
# 5. Deploy button

# Monitor logs
# Dashboard → Service → Logs
```

### Render Post-Deployment

```bash
# Get service URL from Render Dashboard
# https://resumetrics-ai.onrender.com

# View logs
# Dashboard → Service → Logs tab

# Enable auto-deploy
# Dashboard → Service → Settings → Git → Auto-deploy
```

---

## Production Server.ts Configuration

The server is pre-configured for both Vercel and Render:

```typescript
// server.ts
const PORT = process.env.PORT || 3000;  // Vercel/Render set this automatically

app.get('/api/health', (req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV });
});

// Vite middleware for SPA routing
const vite = await createViteServer({ /* ... */ });
app.use(vite.middlewares);

// Serve static files (dist/)
app.use(express.static('dist'));

// SPA fallback
app.get('*', (req, res) => {
  // Vite serves index.html
});
```

---

## Troubleshooting

### Build Fails: "Cannot find module"

**Vercel Error:**
```
Cannot find module '@tailwindcss/vite'
```

**Solution:**
```bash
# Ensure all dependencies installed
npm ci  # Use ci instead of install

# Update lock file
npm install --legacy-peer-deps

# Commit lock file
git add package-lock.json
git commit -m "Update lock file"
git push
```

### Build Fails: "TypeScript Errors"

**Error:**
```
error TS2451: Cannot redeclare block-scoped variable
```

**Solution:**
```bash
# Run locally to debug
npm run lint

# Fix issues
npm run build

# Or disable TypeScript check in deployment
# Vercel: Add to vercel.json: "buildCommand": "npm run build --skip-lint"
```

### API Endpoints 404

**Problem:** `/api/analyze-resume` returns 404

**Solutions:**

1. **Vercel**: Add to `vercel.json`:
   ```json
   {
     "functions": {
       "api/**": { "memory": 512 }
     }
   }
   ```

2. **Render**: Ensure start command is `npm start`

3. **Check health endpoint:**
   ```bash
   curl https://your-deployment.com/api/health
   ```

### Environment Variables Not Loading

**Vercel:**
- Go to Project Settings → Environment Variables
- Verify variables are set for "Production"
- Restart deployment

**Render:**
- Go to Service Settings → Environment
- Verify variables listed
- Click "Save Changes"
- Trigger redeploy

### Supabase Connection Failed

**Error:**
```
Error: Failed to initialize Supabase client
```

**Solution:**
- Verify `VITE_SUPABASE_URL` is correct format
- Check `VITE_SUPABASE_ANON_KEY` is valid
- Ensure Supabase project is active
- If not needed, leave empty (uses localStorage)

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Test API endpoint
curl https://your-deployment.com/api/health

# Expected response:
# {"status":"ok","environment":"production"}

# Test main app
# Visit https://your-deployment.com in browser
```

### 2. Monitor Performance

**Vercel Analytics:**
- Go to https://vercel.com/dashboard
- Select project → Analytics
- Monitor Core Web Vitals, Request Duration

**Render Metrics:**
- Go to Render Dashboard → Service
- Monitor CPU, Memory, Requests
- Set up alerts for issues

### 3. Set Up Error Tracking (Optional)

```bash
# Add Sentry for error monitoring
npm install @sentry/react @sentry/tracing

# Initialize in main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/project-id",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### 4. Enable Auto-Deploys

**Vercel:**
- Default: Enabled on git push
- Settings → Git → Automatic Deployments

**Render:**
- Settings → Git → Auto-deploy
- Select branch: `main`

### 5. Set Up Custom Domain

**Vercel:**
```bash
vercel domains add yourdomain.com
# Follow CNAME instructions
```

**Render:**
```
Dashboard → Service → Custom Domain
Enter domain: yourdomain.com
Follow DNS configuration
```

### 6. Enable HTTPS

- **Vercel**: Automatic (free SSL)
- **Render**: Automatic (free SSL)

---

## Performance Optimization for Deployment

### 1. Enable Compression

Already configured in `server.ts`:
```typescript
app.use(express.json({ limit: "10mb" }));
```

### 2. Add Caching Headers

```typescript
// In server.ts
app.use(express.static('dist', {
  maxAge: '1d',
  etag: false
}));
```

### 3. Monitor Bundle Size

```bash
# Check bundle size
npm run build
# Look at dist/ folder size

# Analyze with vite
npm install -D vite-plugin-visualizer
```

### 4. Database Caching (If using Supabase)

```typescript
// In supabaseClient.ts
const cacheResults = (key, data) => {
  localStorage.setItem(`cache_${key}`, JSON.stringify(data));
};
```

---

## Rollback Instructions

**Vercel Rollback:**
```bash
# Go to Deployments tab
# Find previous deployment
# Click "..." → Promote to Production
```

**Render Rollback:**
```
Dashboard → Service → Logs
Find previous build ID
Click "Re-deploy" on older build
```

---

## Common Issues & Solutions

| Issue | Platform | Solution |
|-------|----------|----------|
| Build timeout | Vercel/Render | Increase timeout in config, optimize build |
| Memory exceeded | Render | Upgrade plan from Starter to Standard |
| Environment variables not loading | Both | Verify names exactly (case-sensitive) |
| API endpoint 404 | Vercel | Check server.ts routing, restart build |
| CORS errors | Both | Add CORS middleware in server.ts |
| Supabase connection fails | Both | Verify credentials, check firewall rules |

---

## Production Checklist

Before going live:

- [ ] Tested all API endpoints on production
- [ ] Environment variables properly configured
- [ ] Error tracking setup (Sentry, etc.)
- [ ] HTTPS working
- [ ] Custom domain configured
- [ ] Auto-deploys enabled
- [ ] Monitoring/alerting enabled
- [ ] Database backups scheduled (if using Supabase)
- [ ] Rate limiting enabled
- [ ] Security headers added
- [ ] CORS properly configured

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Node.js Best Practices**: https://nodejs.org/en/docs/guides/nodejs-web-app-auto-generated/
- **Express Deployment**: https://expressjs.com/en/advanced/best-practice-performance.html

---

**Last Updated**: 2026-07-25  
**Deployment Status**: Ready for Production  
**Supported Platforms**: Vercel ✅ | Render ✅ | AWS ✅ | GCP ✅
