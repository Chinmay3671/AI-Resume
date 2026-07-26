# Quick Start Guide - Resumetrics AI

## 🚀 Get Started in 5 Minutes

### 1. Installation
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Gemini API key to .env
# GEMINI_API_KEY=your_key_here
```

### 2. Development
```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### 3. Build & Test
```bash
# Run linting
npm run lint

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ✨ New Features

### 🌓 Theme Toggle
- Click the Sun/Moon icon in the Navbar
- Switch between dark and light modes
- Your preference is saved automatically

### 📄 PDF Export
1. Analyze a resume
2. Click "Export PDF" button in results
3. A formatted report downloads automatically

### 📊 Skill Radar Chart
- Visit Analytics Hub
- View interactive radar comparing your skills to job requirements
- See areas for improvement highlighted

### 💾 Database Persistence (Optional)
Add Supabase credentials to `.env`:
```bash
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```
Scans will now be saved to the database!

---

## 📋 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # TypeScript checks
npm test             # Run unit tests
npm test:ui          # Interactive test UI
npm start            # Start production server
npm run preview      # Preview production build
npm run clean        # Clean build artifacts
```

---

## 🔑 Environment Variables

Required:
- `GEMINI_API_KEY` - Get from https://aistudio.google.com/app/apikeys

Optional:
- `VITE_SUPABASE_URL` - For database persistence
- `VITE_SUPABASE_ANON_KEY` - For database persistence

---

## 🌐 Deploy

### Vercel
```bash
vercel --prod
```

### Render
- Push to GitHub
- Connect repository to Render
- Deploy automatically

See `DEPLOYMENT.md` for detailed instructions.

---

## 📚 Documentation

- **IMPLEMENTATION_SUMMARY.md** - Complete feature overview
- **DEPLOYMENT.md** - Deployment guide for Vercel/Render
- **PRODUCTION_CHECKLIST.md** - Pre-deployment verification
- **CODE_AUDIT.md** - Code quality report

---

## 🆘 Troubleshooting

**Build fails?**
```bash
npm run clean
npm install --legacy-peer-deps
npm run build
```

**Types error?**
```bash
npm run lint
# Fix any errors shown
```

**Tests fail?**
```bash
npm test -- --reporter=verbose
```

**Port 3000 in use?**
```bash
PORT=3001 npm start
```

---

## ✅ Next Steps

1. ✅ Install & configure locally
2. ✅ Test all features
3. ✅ Add your Gemini API key
4. ✅ (Optional) Set up Supabase
5. ✅ Deploy to Vercel or Render

---

**Need help?** Check the documentation files or review `CODE_AUDIT.md` for architecture details.

Happy analyzing! 🎉
