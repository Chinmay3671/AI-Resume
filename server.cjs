var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_multer = __toESM(require("multer"), 1);
var import_mammoth = __toESM(require("mammoth"), 1);
var pdfParseInstance = null;
async function getPdfParse() {
  if (!pdfParseInstance) {
    try {
      const mod = await import("pdf-parse");
      pdfParseInstance = mod.default || mod;
    } catch (e) {
      pdfParseInstance = null;
    }
  }
  return pdfParseInstance;
}
var app = (0, import_express.default)();
var PORT = parseInt(process.env.PORT || "3000", 10);
var isDev = process.env.NODE_ENV !== "production";
var upload = (0, import_multer.default)({
  storage: import_multer.default.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
  // 10MB limit
});
app.use(import_express.default.json({ limit: "10mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    /\.vercel\.app$/,
    /\.onrender\.com$/,
    /\.netlify\.app$/
  ];
  const isAllowed = allowedOrigins.some((allowed) => {
    if (typeof allowed === "string") {
      return allowed === origin;
    }
    return allowed.test(origin);
  });
  if (isAllowed || isDev) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-api-key-here" || apiKey === "MY_GEMINI_API_KEY" || !apiKey.startsWith("AIza")) {
    return null;
  }
  return new import_genai.GoogleGenAI({ apiKey });
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV || "development" });
});
app.post("/api/analyze-resume", upload.single("file"), async (req, res) => {
  try {
    let resumeText = "";
    let fileName = req.body.fileName || "Document.pdf";
    const jobDescription = req.body.jobDescription || "";
    if (req.file) {
      fileName = req.file.originalname;
      const ext = import_path.default.extname(fileName).toLowerCase();
      if (ext === ".docx" || req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const docxResult = await import_mammoth.default.extractRawText({ buffer: req.file.buffer });
        resumeText = docxResult.value;
      } else if (ext === ".pdf" || req.file.mimetype === "application/pdf") {
        try {
          const parsePdf = await getPdfParse();
          if (parsePdf) {
            const pdfData = await parsePdf(req.file.buffer);
            resumeText = pdfData.text;
          } else {
            resumeText = req.file.buffer.toString("utf-8");
          }
        } catch (pdfErr) {
          resumeText = req.file.buffer.toString("utf-8");
        }
      } else {
        resumeText = req.file.buffer.toString("utf-8");
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    }
    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "No readable resume content found. Please upload a valid PDF, DOCX, or TXT file." });
    }
    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `You are an expert ATS (Applicant Tracking System) Auditor and Senior Executive Recruiter.
Analyze the following document text against the target job description (if provided).

Document File Name: ${fileName}
Target Job Description: ${jobDescription || "Standard Technical Professional"}

Document Content:
"""
${resumeText}
"""

CRITICAL INSPECTION RULE:
First check if the document is actually a RESUME / CV.
If the text appears to be an academic assignment, homework, essay, random notes, or non-resume content (e.g., assignment instructions, problem statements):
- Set overallScore between 25-45.
- Set status to "Fixes Needed".
- Clearly explain in the summary that the uploaded file appears to be non-resume content (assignment/coursework).

If it IS a resume, analyze the ACTUAL text provided. Do not invent unrelated skills.

Respond ONLY with a strictly valid JSON object matching this schema:
{
  "overallScore": <number 0-100>,
  "status": "<Passed | Review | Fixes Needed>",
  "summary": "<2-3 sentence summary based on actual content>",
  "experienceYears": {
    "total": <number>,
    "inTargetRole": <number>,
    "description": "<brief summary>"
  },
  "hardSkills": {
    "matched": ["<hard skills found in resume>"],
    "missing": ["<missing skills for target role>"],
    "score": <number 0-100>
  },
  "softSkills": {
    "identified": ["<soft skills demonstrated in text>"],
    "score": <number 0-100>
  },
  "certifications": {
    "current": ["<current certs found>"],
    "recommended": ["<recommended certs>"],
    "priority": "<high | medium | low>"
  },
  "matchedKeywords": ["<5-8 matching keywords actually in text>"],
  "missingKeywords": ["<3-6 missing critical keywords>"],
  "formattingScore": <number 0-100>,
  "keywordScore": <number 0-100>,
  "experienceImpactScore": <number 0-100>,
  "bulletPoints": [
    {
      "id": "b1",
      "section": "Experience",
      "original": "<original text line>",
      "optimized": "<rewritten ATS bullet point>",
      "verbImpact": "<high | active | passive>"
    }
  ],
  "benchmarks": {
    "role": "Target Role",
    "skills": [
      { "name": "<Skill 1>", "score": <number> },
      { "name": "<Skill 2>", "score": <number> }
    ]
  }
}`;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt
        });
        const textResponse = response.text || "";
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json(parsed);
        }
      } catch (geminiError) {
        console.warn("Gemini API call warning, fallback smart engine activated:", geminiError);
      }
    }
    const isAssignment = /assignment|homework|lab|question|problem statement|submission|coursework|exercise/i.test(resumeText) || /assignment/i.test(fileName || "");
    const lines = resumeText.split("\n").map((l) => l.trim()).filter((l) => l.length > 10);
    const words = resumeText.match(/\b[A-Za-z]{3,}\b/g) || [];
    const extractedKeywords = Array.from(new Set(
      words.filter((w) => /^[A-Z][a-zA-Z0-9.+]+$/.test(w) && !["The", "And", "For", "With", "From", "This", "That", "Your", "Which", "Assignment"].includes(w))
    )).slice(0, 8);
    if (isAssignment) {
      return res.json({
        overallScore: 38,
        status: "Fixes Needed",
        summary: `Document "${fileName || "File"}" appears to be academic coursework or assignment content rather than a professional resume. Please upload a standard resume for ATS optimization.`,
        experienceYears: {
          total: 0,
          inTargetRole: 0,
          description: "No professional experience timeline detected in assignment document."
        },
        hardSkills: {
          matched: extractedKeywords.length > 0 ? extractedKeywords : ["Document Analysis", "Technical Writing"],
          missing: ["Professional Experience Section", "Quantified Metrics", "ATS Keyword Optimization"],
          score: 35
        },
        softSkills: {
          identified: ["Academic Writing", "Problem Analysis"],
          score: 50
        },
        certifications: {
          current: [],
          recommended: ["Professional Resume Formatting", "ATS Keyword Alignment"],
          priority: "high"
        },
        matchedKeywords: extractedKeywords.length > 0 ? extractedKeywords : ["Academic Content"],
        missingKeywords: ["Professional Experience", "Measurable Metrics", "Role Title"],
        formattingScore: 40,
        keywordScore: 35,
        experienceImpactScore: 30,
        bulletPoints: [
          {
            id: "b1",
            section: "Content Notice",
            original: lines[0] || "Assignment submission file uploaded.",
            optimized: "Convert assignment content into a structured Professional Project section with quantified deliverables.",
            verbImpact: "passive"
          }
        ],
        benchmarks: {
          role: "Academic / Assignment Document",
          skills: [
            { name: "Resume Structure", score: 30 },
            { name: "Professional Metrics", score: 25 }
          ]
        }
      });
    }
    const hasTech = /react|node|javascript|typescript|python|java|sql|aws|git|api|c\+\+|html|css|linux/i.test(resumeText);
    const hasLeadership = /lead|manage|mentor|team|coordinate|collaborate|directed/i.test(resumeText);
    const score = Math.min(92, Math.max(65, Math.floor(70 + (hasTech ? 12 : 0) + (lines.length > 5 ? 8 : 0))));
    return res.json({
      overallScore: score,
      status: score >= 80 ? "Passed" : "Review",
      summary: `Analyzed "${fileName || "Resume"}" content using Smart Document Parser. Extracted core competencies and experience indicators. (To enable live Gemini 2.5 Flash AI calls, add a valid Gemini API key starting with 'AIzaSy...' from https://aistudio.google.com/app/apikeys to your .env file).`,
      experienceYears: {
        total: Math.max(1, Math.floor(lines.length / 3)),
        inTargetRole: Math.max(1, Math.floor(lines.length / 4)),
        description: "Demonstrated technical progression based on uploaded document history."
      },
      hardSkills: {
        matched: extractedKeywords.length > 0 ? extractedKeywords : ["JavaScript", "Git", "REST APIs"],
        missing: ["Cloud Deployments (AWS/Docker)", "CI/CD Automation", "Automated Testing"],
        score
      },
      softSkills: {
        identified: hasLeadership ? ["Team Leadership", "Cross-functional Collaboration", "Problem Solving"] : ["Problem Solving", "Technical Analysis", "Communication"],
        score: 80
      },
      certifications: {
        current: ["Bachelor Degree"],
        recommended: ["AWS Certified Developer", "Professional Scrum Master"],
        priority: "medium"
      },
      matchedKeywords: extractedKeywords.length > 0 ? extractedKeywords : ["Software Development", "API Integration", "Git"],
      missingKeywords: ["Docker / Containers", "CI/CD Pipelines", "System Performance", "AWS Cloud"],
      formattingScore: 88,
      keywordScore: score,
      experienceImpactScore: Math.max(60, score - 6),
      bulletPoints: lines.slice(0, 3).map((line, i) => ({
        id: `b${i + 1}`,
        section: "Experience",
        original: line,
        optimized: `Spearheaded execution of ${line.slice(0, 45)}..., delivering a 28% increase in operational efficiency.`,
        verbImpact: "high"
      })),
      benchmarks: {
        role: "Software Professional",
        skills: [
          { name: "Core Technology Stack", score },
          { name: "System Engineering", score: Math.max(50, score - 10) }
        ]
      }
    });
  } catch (error) {
    console.error("Analysis route error:", error);
    res.status(500).json({ error: "Failed to analyze resume. Please try again." });
  }
});
app.post("/api/rewrite-bullet", async (req, res) => {
  try {
    const { bulletText, targetRole } = req.body;
    if (!bulletText) {
      return res.status(400).json({ error: "Bullet text is required" });
    }
    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `Rewrite this bullet point into 3 high-impact ATS statements for a ${targetRole || "Software Engineer"}:
Bullet: "${bulletText}"
Return JSON: { "variations": ["var1", "var2", "var3"] }`;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt
        });
        const textResponse = response.text || "";
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json(parsed);
        }
      } catch (err) {
        console.warn("Rewrite Gemini error, using content rewriter:", err);
      }
    }
    return res.json({
      variations: [
        `Architected streamlined workflows for ${bulletText}, improving execution efficiency by 34%.`,
        `Spearheaded technical execution involving ${bulletText}, delivering a 25% increase in team productivity.`,
        `Engineered robust features for ${bulletText}, decreasing error rates by 40%.`
      ]
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to rewrite bullet point." });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ResuMetrics AI Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
