# Production Build Checklist

## Pre-Build Verification

### Code Quality
- [ ] Run `npm run lint` - TypeScript checks pass
- [ ] Run `npm test` - All tests pass (or tests are comprehensive)
- [ ] Check for console.log statements in production code
- [ ] Review commented-out code and remove if not needed
- [ ] Verify all environment variables are used correctly
- [ ] Check for hardcoded sensitive data (API keys, tokens)

### Type Safety
- [ ] No `any` types in critical components
- [ ] All function parameters typed
- [ ] All return types specified
- [ ] No implicit `any` from tsconfig

### Performance
- [ ] Check bundle size: `npm run build`
  - Target: < 250KB gzipped
  - Critical: < 500KB
- [ ] Verify lazy loading for large components
- [ ] Check for unused imports
- [ ] Review React.memo usage for heavy components
- [ ] Verify useMemo/useCallback in complex components

### Dependencies
- [ ] Run `npm audit` - No high/critical vulnerabilities
- [ ] All dependencies are up-to-date or pinned intentionally
- [ ] No duplicate dependencies
- [ ] Peer dependencies satisfied

### Testing
- [ ] Unit tests: `npm test`
- [ ] Integration tests pass (if implemented)
- [ ] Manual testing of critical flows:
  - [ ] Resume upload
  - [ ] API analysis
  - [ ] PDF export
  - [ ] Theme toggle
  - [ ] Responsive design (mobile/tablet/desktop)

### Security
- [ ] No hardcoded API keys
- [ ] Environment variables properly configured
- [ ] CORS policy configured for production domains
- [ ] Security headers present in server.ts
- [ ] No direct DOM manipulation (innerHTML, eval, etc.)
- [ ] Input validation on API endpoints
- [ ] Rate limiting configured

### Browser Compatibility
- [ ] Tested in Chrome (latest)
- [ ] Tested in Firefox (latest)
- [ ] Tested in Safari (latest)
- [ ] Tested in Edge (latest)
- [ ] Mobile browsers tested

---

## Build Process

### Local Build
```bash
# 1. Clean previous builds
npm run clean

# 2. Run linting
npm run lint

# 3. Run tests
npm test

# 4. Build frontend
npm run build

# 5. Verify build output
ls -lah dist/
```

### Verification
- [ ] dist/ folder contains:
  - [ ] index.html
  - [ ] assets/ folder with CSS and JS
  - [ ] No source maps in production (or production source maps only)
- [ ] Build completes without warnings (or only acceptable warnings)
- [ ] No TypeScript errors
- [ ] Bundle size acceptable

---

## Environment Configuration

### Environment Variables Required
- [ ] GEMINI_API_KEY - Google Gemini API key
- [ ] NODE_ENV - Set to "production"
- [ ] PORT - Set to 3000 (or configured for platform)
- [ ] VITE_SUPABASE_URL - (Optional) Supabase URL
- [ ] VITE_SUPABASE_ANON_KEY - (Optional) Supabase key

### Verification
```bash
# Verify all required env vars are set
env | grep -E 'GEMINI|SUPABASE|NODE_ENV|PORT'

# Test locally with production config
NODE_ENV=production npm start
# Visit http://localhost:3000/api/health
# Expected: {"status":"ok","environment":"production"}
```

---

## Platform-Specific Checks

### Vercel Deployment
- [ ] vercel.json configured correctly
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Framework detected as Vite
- [ ] Environment variables set in Vercel dashboard
- [ ] Git integration enabled
- [ ] Preview deployments working

### Render Deployment
- [ ] render.yaml configured correctly
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Health check path: `/api/health`
- [ ] Environment variables set in Render dashboard
- [ ] Git auto-deploy enabled
- [ ] Region selected (Oregon recommended for US)

### Both Platforms
- [ ] Database migrations applied (if using Supabase)
- [ ] API endpoint health check working: `/api/health`
- [ ] Static assets serving correctly
- [ ] SPA routing working (refresh works on subpages)
- [ ] CORS configured properly

---

## Production Deployment

### Pre-Deploy
- [ ] Tag release in git: `git tag -a v1.0.0 -m "Production release"`
- [ ] Push tags: `git push origin --tags`
- [ ] Create release notes (if applicable)
- [ ] Notify team of deployment
- [ ] Have rollback plan ready

### Deploy
```bash
# Option 1: Vercel
vercel --prod

# Option 2: Render
# Push to main branch, auto-deploy triggers

# Option 3: Manual
git push origin main
# Monitor deployment in platform dashboard
```

### Post-Deploy
- [ ] Visit production URL and verify it loads
- [ ] Test critical user flows:
  - [ ] Upload resume
  - [ ] Analyze with API
  - [ ] Export PDF
  - [ ] Toggle theme
  - [ ] View analytics
- [ ] Check API endpoints: `/api/health`, `/api/analyze-resume`
- [ ] Verify error handling (try invalid request)
- [ ] Check console for JavaScript errors
- [ ] Test on multiple devices/browsers

---

## Monitoring & Maintenance

### Production Monitoring Setup
- [ ] Error tracking configured (Sentry, Rollbar, etc.)
- [ ] Application performance monitoring (APM)
- [ ] Server logs accessible
- [ ] Database backups enabled (if applicable)
- [ ] Alerts configured for:
  - [ ] High error rate
  - [ ] API response time
  - [ ] Database connection issues
  - [ ] Deployment failures

### Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Check error logs weekly
- [ ] Monitor performance metrics
- [ ] Test disaster recovery plan quarterly
- [ ] Review and update deployment processes

---

## Rollback Plan

### If Deployment Fails

1. **Immediate Actions**
   - [ ] Stop traffic to new deployment (if possible)
   - [ ] Alert team immediately
   - [ ] Gather error logs and information

2. **Rollback Process**
   ```bash
   # Vercel
   # Go to Deployments → Select previous working version → Promote to Production
   
   # Render
   # Dashboard → Logs → Find previous build → Re-deploy
   ```

3. **Investigation**
   - [ ] Review error logs
   - [ ] Check environment variables
   - [ ] Verify database connectivity
   - [ ] Test locally with same config

4. **Fix & Redeploy**
   - [ ] Fix issues in code
   - [ ] Run full test suite
   - [ ] Deploy to staging first (if available)
   - [ ] Deploy to production

---

## Sign-Off

- **Deployed By**: ___________________
- **Date**: ___________________
- **Production URL**: ___________________
- **Verified By**: ___________________
- **Rollback Tested**: [ ] Yes [ ] No

---

## Quick Reference

### Health Check
```bash
curl https://your-domain.com/api/health
# Expected: {"status":"ok","environment":"production"}
```

### View Logs
- **Vercel**: https://vercel.com/dashboard → Select project → Logs
- **Render**: Render Dashboard → Service → Logs

### Environment Variables
- **Vercel**: Project Settings → Environment Variables
- **Render**: Service Settings → Environment

### Restart Service
- **Vercel**: Not typically needed (auto-restart on deploy)
- **Render**: Dashboard → Service → Manual Deploy (or re-push code)

---

**Last Updated**: 2026-07-25  
**Version**: 1.0  
**Platforms Tested**: Vercel ✅ | Render ✅
