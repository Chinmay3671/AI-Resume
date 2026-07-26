# ResuMetrics AI - Technical Documentation & Architecture Report

## 1. Executive Summary
**ResuMetrics AI** is an AI-powered Applicant Tracking System (ATS) resume optimization platform designed to analyze resume compatibility, extract technical competencies, calculate match scores, and provide real-time bullet point optimizations using **Google Gemini 2.5 Flash AI**.

---

## 2. Technical Stack & Languages

### 2.1 Programming Languages
- **TypeScript (v5.8.2)**: Used across frontend and backend for strict compile-time type safety.
- **JavaScript (ES6+)**: Used for asynchronous execution, event handling, and ES modules.
- **HTML5 & CSS3**: Structured DOM markup with custom HSL tokens, Tailwind CSS utility classes, and glassmorphism styling.

### 2.2 Frontend Framework & Libraries
- **React (v19.0.1)**: UI component architecture utilizing functional components and hooks (`useState`, `useEffect`, `useMemo`).
- **Vite (v6.2.3)**: Next-generation frontend build tool providing fast HMR and production code-splitting.
- **Tailwind CSS (v4.1.14)**: Utility-first CSS framework with real-time dark and light theme switching.
- **Recharts (v3.10.1)**: SVG data visualization library powering Skill Match Radar charts, ATS Gauges, and Bar Charts.
- **Lucide React (v0.546.0)**: SVG icon set.
- **jsPDF (v4.2.1)**: Dynamic PDF report generation library (lazy-loaded on demand).

### 2.3 Backend & Runtime Environment
- **Node.js (v22+)**: Asynchronous JavaScript runtime environment.
- **Express.js (v4.21.2)**: Lightweight RESTful web server framework.
- **tsx / esbuild**: Development execution engine (`tsx`) and production bundler (`esbuild`).

### 2.4 Artificial Intelligence & APIs
- **Google Gemini 2.5 Flash API (`@google/genai` v2.4.0)**: Used for ATS resume audits, bullet point rewrites, and skill gap identification.

---

## 3. Backend API Specifications

### `GET /api/health`
- **Description**: Verifies backend server health and environment status.
- **Response**:
```json
{
  "status": "ok",
  "environment": "development"
}
```

### `POST /api/analyze-resume`
- **Description**: Evaluates resume text against a target job description using Gemini 2.5 Flash AI.
- **Request Body**:
```json
{
  "resumeText": "String containing raw resume text",
  "fileName": "Resume.pdf",
  "jobDescription": "Target job description text"
}
```
- **Response Structure**:
```json
{
  "overallScore": 84,
  "status": "Passed",
  "summary": "ATS analysis summary...",
  "formattingScore": 92,
  "keywordScore": 84,
  "experienceImpactScore": 85,
  "hardSkills": {
    "matched": ["React.js", "TypeScript", "Node.js"],
    "missing": ["GraphQL", "Docker"]
  },
  "softSkills": {
    "identified": ["Problem-solving", "Teamwork"]
  },
  "certifications": {
    "current": ["B.S. Computer Science"],
    "recommended": ["AWS Solutions Architect"]
  },
  "matchedKeywords": ["React.js", "TypeScript", "Node.js"],
  "missingKeywords": ["GraphQL", "Docker"],
  "bulletPoints": [
    {
      "id": "b1",
      "section": "Experience",
      "original": "Worked on React app",
      "optimized": "Architected responsive React/TypeScript interfaces, improving page load by 35%.",
      "verbImpact": "high"
    }
  ]
}
```

### `POST /api/rewrite-bullet`
- **Description**: Generates 3 alternative ATS bullet point variations for a selected experience entry.
- **Request Body**:
```json
{
  "bulletText": "Worked on building APIs",
  "targetRole": "Software Engineer"
}
```
- **Response Structure**:
```json
{
  "variations": [
    "Engineered scalable RESTful APIs handling 15,000+ daily requests.",
    "Architected robust microservices backend, reducing latency by 30%.",
    "Spearheaded API optimization sprint, improving throughput by 25%."
  ]
}
```

---

## 4. Component & UI Architecture

1. **`App.tsx`**: Main application router, global theme state manager, and modal dialog container.
2. **`Navbar.tsx`**: Top navigation header, mobile drawer toggle, theme switcher, and user profile button.
3. **`ScannerView.tsx`**: File upload zone, live AI analysis progress radar, score breakdown cards, keyword matrix, and bullet point optimizer.
4. **`DashboardView.tsx`**: Key metrics summary, live search bar, status dropdown filter, scan history table, and 5-item page navigation controls.
5. **`AnalyticsHubView.tsx`**: Score progression chart, dynamic role benchmark filter, Recharts Skill Match Radar, and Action Verb Matrix.
6. **`PricingView.tsx`**: Monthly/Yearly subscription tier cards with upgrade toast feedback.

---

## 5. Security & Environment Setup

- **Environment File (`.env`)**:
  ```env
  GEMINI_API_KEY="AIzaSy..."
  NODE_ENV="development"
  PORT="3000"
  ```
- **Git Security**: `.env` and `.env.local` are explicitly listed in `.gitignore` to prevent committing sensitive keys to public repositories.

---

## 6. Execution & Verification Commands

```bash
# Start development server
npm run dev

# Run unit test suite
npx vitest run

# Run TypeScript compilation check
npm run lint

# Clean build artifacts
npm run clean

# Build for production
npm run build
```
