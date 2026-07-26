import React, { useState, useRef } from 'react';
import { ScanItem, BulletPoint } from '../types';
import { SAMPLE_RESUME_TEXT, SAMPLE_JOB_DESCRIPTION } from '../data/initialData';
import {
  UploadCloud,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Zap,
  Download,
  Award,
  BookOpen,
  Briefcase,
  CheckSquare
} from 'lucide-react';

interface ScannerViewProps {
  onScanCompleted: (newScan: ScanItem) => void;
  activeScanResult?: ScanItem | null;
  onClearActiveResult?: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  onScanCompleted,
  activeScanResult,
  onClearActiveResult
}) => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'results'>(
    activeScanResult ? 'results' : 'upload'
  );
  const [resumeText, setResumeText] = useState(activeScanResult?.resumeText || '');
  const [fileName, setFileName] = useState(activeScanResult?.documentName || '');
  const [jobDescription, setJobDescription] = useState(activeScanResult?.jobDescription || '');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('Parsing Document Structure...');
  const [currentScan, setCurrentScan] = useState<ScanItem | null>(activeScanResult || null);
  const [dragActive, setDragActive] = useState(false);
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});
  const [rewritingBulletId, setRewritingBulletId] = useState<string | null>(null);
  const [bulletVariations, setBulletVariations] = useState<{ [key: string]: string[] }>({});
  const [isExporting, setIsExporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize when activeScanResult prop changes
  React.useEffect(() => {
    if (activeScanResult) {
      setCurrentScan(activeScanResult);
      setStep('results');
    }
  }, [activeScanResult]);

  const handleLoadSample = () => {
    setErrorMessage(null);
    setUploadedFile(null);
    setResumeText(SAMPLE_RESUME_TEXT);
    setFileName('Alex_M_Software_Engineer_Resume.pdf');
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
  };

  // Helper to sanitize binary files (PDF/DOCX) when read as text
  const processUploadedText = (rawText: string, file: File) => {
    if (file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
      const cleaned = rawText
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleaned.length > 50 && !cleaned.startsWith('%PDF')) {
        return cleaned;
      }
      return rawText;
    }
    return rawText;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setErrorMessage(null);
      setUploadedFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(processUploadedText(text || '', file));
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dropEffect !== 'none') {
      const file = e.dataTransfer.files[0];
      if (file) {
        setErrorMessage(null);
        setUploadedFile(file);
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (ev) => {
          setResumeText(processUploadedText((ev.target?.result as string) || '', file));
        };
        reader.readAsText(file);
      }
    }
  };

  const handleExportPDF = async () => {
    if (!currentScan) return;
    setIsExporting(true);
    try {
      const { generateReportPDF } = await import('../utils/pdfExport');
      generateReportPDF(currentScan);
    } catch (e) {
      console.error('Failed to export PDF:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const startAnalysis = async () => {
    const textToAnalyze = resumeText.trim();
    const documentName = fileName.trim() || uploadedFile?.name || 'Resume_Document.pdf';

    if (!uploadedFile && !textToAnalyze) {
      setErrorMessage('Please upload a resume file (.docx, .pdf, .txt) or paste resume text before analyzing.');
      return;
    }

    setErrorMessage(null);
    setStep('analyzing');

    const loadingTexts = [
      'Parsing Document Content...',
      'Extracting Work History & Technical Skills...',
      'Identifying Core Competencies...',
      'Running Gemini 2.5 Flash ATS Audit...',
      'Calculating Keyword Alignment & Impact Ratings...',
      'Finalizing Recommendations...'
    ];

    let textIdx = 0;
    const interval = setInterval(() => {
      textIdx++;
      if (textIdx < loadingTexts.length) {
        setLoadingText(loadingTexts[textIdx]);
      }
    }, 1200);

    try {
      let response: Response;

      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        if (jobDescription) {
          formData.append('jobDescription', jobDescription);
        }
        response = await fetch('/api/analyze-resume', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetch('/api/analyze-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText: textToAnalyze,
            fileName: documentName,
            jobDescription
          })
        });
      }

      const data = await response.json();
      clearInterval(interval);

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Backend service failed to analyze document.');
      }

      const newScan: ScanItem = {
        id: `scan-${Date.now()}`,
        documentName,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        atsScore: data.overallScore ?? 75,
        status: data.status || (data.overallScore >= 80 ? 'Passed' : data.overallScore >= 70 ? 'Review' : 'Fixes Needed'),
        summary: data.summary || 'ATS analysis completed cleanly.',
        matchedKeywords: data.matchedKeywords || [],
        missingKeywords: data.missingKeywords || [],
        formattingScore: data.formattingScore ?? 80,
        keywordScore: data.keywordScore ?? 75,
        experienceImpactScore: data.experienceImpactScore ?? 75,
        hardSkills: data.hardSkills || { matched: [], missing: [] },
        softSkills: data.softSkills || { identified: [] },
        certifications: data.certifications || { current: [], recommended: [], priority: 'medium' },
        experienceYears: data.experienceYears || { total: 0, inTargetRole: 0, description: 'Experience timeline parsed.' },
        bulletPoints: data.bulletPoints || [],
        benchmarks: data.benchmarks || { role: 'Target Role', skills: [] },
        jobDescription,
        resumeText: textToAnalyze || `[Uploaded File: ${documentName}]`
      };

      setCurrentScan(newScan);
      onScanCompleted(newScan);
      setStep('results');
    } catch (err: any) {
      console.error('Scan error:', err);
      clearInterval(interval);
      setStep('upload');
      setErrorMessage(err.message || 'Failed to connect to backend server. Please verify your GEMINI_API_KEY and backend server execution.');
    }
  };

  const handleRewriteBullet = async (bullet: BulletPoint) => {
    setRewritingBulletId(bullet.id);
    try {
      const res = await fetch('/api/rewrite-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletText: bullet.original,
          targetRole: currentScan?.benchmarks?.role || 'Software Engineer'
        })
      });
      const data = await res.json();
      if (data.variations) {
        setBulletVariations((prev) => ({
          ...prev,
          [bullet.id]: data.variations
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRewritingBulletId(null);
    }
  };

  const handleApplyVariation = (bulletId: string, newOptimizedText: string) => {
    if (!currentScan) return;
    const updatedBullets = currentScan.bulletPoints.map((b) =>
      b.id === bulletId ? { ...b, optimized: newOptimizedText } : b
    );
    setCurrentScan({
      ...currentScan,
      bulletPoints: updatedBullets
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopyStatus((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleReset = () => {
    setStep('upload');
    setCurrentScan(null);
    if (onClearActiveResult) onClearActiveResult();
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-8">
      {/* Step 1: Upload Screen */}
      {step === 'upload' && (
        <section className="flex flex-col items-center justify-center min-h-[580px] space-y-8 animate-fade-in">
          <div className="text-center space-y-3 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-[#dae2fd] tracking-tight">
              Optimize Your Resume for ATS
            </h1>
            <p className="text-base md:text-lg text-[#c7c4d7]">
              Upload your resume and paste the target job description. Our AI will analyze your match rate and suggest improvements.
            </p>
          </div>

          <div className="w-full max-w-3xl glass-panel p-6 md:p-8 rounded-xl flex flex-col space-y-6">
            {errorMessage && (
              <div className="p-4 bg-[#ffb4ab]/10 border border-[#ffb4ab]/40 rounded-xl flex items-center justify-between text-xs text-[#ffb4ab]">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="p-1 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`upload-dashed h-52 w-full flex flex-col items-center justify-center cursor-pointer group transition-all ${
                dragActive ? 'border-[#c0c1ff] bg-[#2d3449]/60' : ''
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <UploadCloud className="w-10 h-10 text-[#908fa0] mb-2 group-hover:text-[#c0c1ff] transition-colors" />
              <p className="text-sm font-medium text-[#c7c4d7] group-hover:text-white transition-colors">
                {fileName ? (
                  <span className="text-[#c0c1ff] font-semibold">{fileName}</span>
                ) : (
                  'Drag & drop your PDF or DOCX here'
                )}
              </p>
              <p className="text-xs text-[#908fa0] mt-1">or click to browse files</p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadSample();
                }}
                className="mt-4 text-xs font-semibold px-4 py-2 bg-[#2d3449] text-[#dae2fd] rounded-full hover:bg-[#31394d] transition-colors border border-[#464554]/60 flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c0c1ff]" />
                <span>Load Sample Resume</span>
              </button>
            </div>

            {/* Resume Text Preview / Editor */}
            {resumeText && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                    Resume Content Preview
                  </label>
                  <span className="text-xs text-[#908fa0]">
                    {resumeText.split(/\s+/).length} words
                  </span>
                </div>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full h-28 bg-[#131b2e] border border-[#464554]/50 rounded-lg p-3 text-xs text-[#dae2fd] focus:border-[#c0c1ff] focus:outline-none transition-all resize-none glass-panel"
                  placeholder="Paste or review raw resume text..."
                />
              </div>
            )}

            {/* Job Description Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#dae2fd]">
                Target Job Description (Optional but recommended)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-32 bg-[#131b2e] border border-[#464554]/50 rounded-lg p-4 text-sm text-[#dae2fd] placeholder-[#908fa0] focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] focus:outline-none transition-all resize-none glass-panel"
                placeholder="Paste the job description here to tailor the analysis..."
              />
            </div>

            {/* CTA Button */}
            <button
              onClick={startAnalysis}
              className="w-full py-3.5 bg-[#8083ff] text-[#0d0096] font-semibold text-sm md:text-base rounded-lg glass-glow-accent hover:opacity-95 active:scale-[0.99] transition-all border-t border-white/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              <span>Analyze with Gemini AI</span>
            </button>
          </div>
        </section>
      )}

      {/* Step 2: Analyzing Radar View */}
      {step === 'analyzing' && (
        <section className="flex flex-col items-center justify-center min-h-[580px] space-y-8 animate-fade-in">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#8083ff]/20"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-[#c0c1ff] animate-spin-slow"></div>
            <div className="absolute inset-4 rounded-full bg-[#8083ff]/10 blur-xl"></div>
            <FileText className="w-16 h-16 text-[#c0c1ff] animate-pulse relative z-10" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text min-h-[40px]">
              {loadingText}
            </h2>
            <p className="text-sm text-[#c7c4d7]">
              This usually takes about 10-20 seconds.
            </p>
          </div>
        </section>
      )}

      {/* Step 3: Scan Results View */}
      {step === 'results' && currentScan && (
        <section className="space-y-8 animate-fade-in">
          {/* Top Bar Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#464554]/30">
            <div>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#c0c1ff]" />
                <h1 className="text-2xl font-bold text-[#dae2fd]">
                  {currentScan.documentName}
                </h1>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${
                    currentScan.status === 'Passed'
                      ? 'border-[#4edea3] text-[#4edea3] bg-[#4edea3]/10'
                      : currentScan.status === 'Review'
                      ? 'border-[#d0bcff] text-[#d0bcff] bg-[#d0bcff]/10'
                      : 'border-[#ffb4ab] text-[#ffb4ab] bg-[#ffb4ab]/10'
                  }`}
                >
                  {currentScan.status}
                </span>
              </div>
              <p className="text-sm text-[#c7c4d7] mt-1">
                Scanned on {currentScan.date} • Gemini 2.5 Audit
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-4 py-2 bg-[#2d3449] hover:bg-[#31394d] text-[#4edea3] rounded-lg text-sm font-medium border border-[#4edea3]/40 flex items-center space-x-2 transition-colors cursor-pointer hover:border-[#4edea3]"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Generating PDF...' : 'Export PDF'}</span>
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-[#2d3449] hover:bg-[#31394d] text-[#dae2fd] rounded-lg text-sm font-medium border border-[#464554] flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Scan New Resume</span>
              </button>
            </div>
          </div>

          {/* Scores Overview Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden md:col-span-1 border border-[#8083ff]/30">
              <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-[#2d3449]"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="10"
                    className={
                      currentScan.atsScore >= 80
                        ? 'text-[#4edea3]'
                        : currentScan.atsScore >= 70
                        ? 'text-[#d0bcff]'
                        : 'text-[#ffb4ab]'
                    }
                    strokeDasharray={326}
                    strokeDashoffset={326 - (326 * currentScan.atsScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-[#dae2fd]">
                    {currentScan.atsScore}%
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#908fa0]">
                    ATS Score
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#c7c4d7]">
                {currentScan.atsScore >= 80
                  ? 'Excellent ATS compatibility!'
                  : currentScan.atsScore >= 70
                  ? 'Good foundation with minor keyword gaps.'
                  : 'Requires optimization for top ATS rank.'}
              </p>
            </div>

            {/* Sub-Metrics Cards */}
            <div className="glass-card rounded-xl p-6 flex flex-col justify-between md:col-span-1">
              <div>
                <p className="text-xs font-semibold text-[#908fa0] uppercase tracking-wider mb-1">
                  Formatting & Structure
                </p>
                <p className="text-3xl font-bold text-[#dae2fd]">
                  {currentScan.formattingScore || 90}%
                </p>
              </div>
              <div className="w-full bg-[#131b2e] h-2 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-[#c0c1ff] h-2 rounded-full"
                  style={{ width: `${currentScan.formattingScore || 90}%` }}
                />
              </div>
              <p className="text-xs text-[#908fa0] mt-2">
                PDF header hierarchy & font cleanliness.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 flex flex-col justify-between md:col-span-1">
              <div>
                <p className="text-xs font-semibold text-[#908fa0] uppercase tracking-wider mb-1">
                  Keyword Alignment
                </p>
                <p className="text-3xl font-bold text-[#4edea3]">
                  {currentScan.keywordScore || 82}%
                </p>
              </div>
              <div className="w-full bg-[#131b2e] h-2 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-[#4edea3] h-2 rounded-full"
                  style={{ width: `${currentScan.keywordScore || 82}%` }}
                />
              </div>
              <p className="text-xs text-[#908fa0] mt-2">
                Overlap with target job description terms.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 flex flex-col justify-between md:col-span-1">
              <div>
                <p className="text-xs font-semibold text-[#908fa0] uppercase tracking-wider mb-1">
                  Action Impact Rating
                </p>
                <p className="text-3xl font-bold text-[#d0bcff]">
                  {currentScan.experienceImpactScore || 80}%
                </p>
              </div>
              <div className="w-full bg-[#131b2e] h-2 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-[#d0bcff] h-2 rounded-full"
                  style={{ width: `${currentScan.experienceImpactScore || 80}%` }}
                />
              </div>
              <p className="text-xs text-[#908fa0] mt-2">
                Strong verbs & quantified metrics.
              </p>
            </div>
          </div>

          {/* AI Executive Summary */}
          <div className="glass-card rounded-xl p-6 border border-[#8083ff]/20 space-y-2">
            <h3 className="text-lg font-bold text-[#dae2fd] flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#c0c1ff]" />
              <span>AI Executive Summary</span>
            </h3>
            <p className="text-sm text-[#c7c4d7] leading-relaxed">
              {currentScan.summary}
            </p>
          </div>

          {/* Hard/Soft Skills & Certifications Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hard Skills */}
            <div className="glass-card rounded-xl p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-[#c0c1ff]" />
                <h3 className="text-base font-bold text-[#dae2fd]">Hard Technical Skills</h3>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-[#4edea3] font-semibold">Identified:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(currentScan.hardSkills?.matched || currentScan.matchedKeywords).map((s, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-[#4edea3]/10 border border-[#4edea3]/30 text-[#4edea3] rounded-full text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Soft Skills */}
            <div className="glass-card rounded-xl p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-[#d0bcff]" />
                <h3 className="text-base font-bold text-[#dae2fd]">Demonstrated Soft Skills</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(currentScan.softSkills?.identified || ['Problem-solving', 'Teamwork', 'Communication']).map((s, i) => (
                  <span key={i} className="px-2.5 py-0.5 bg-[#8083ff]/20 border border-[#8083ff]/40 text-[#c0c1ff] rounded-full text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Certifications */}
            <div className="glass-card rounded-xl p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#ffb4ab]" />
                <h3 className="text-base font-bold text-[#dae2fd]">Recommended Certifications</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-[#c7c4d7]">
                {(currentScan.certifications?.recommended || ['AWS Solutions Architect', 'Certified Developer']).map((c, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Keyword Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#dae2fd] flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#4edea3]" />
                  <span>Matched Keywords ({currentScan.matchedKeywords.length})</span>
                </h3>
                <span className="text-xs text-[#4edea3] font-semibold">Found in Resume</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentScan.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#4edea3]/10 border border-[#4edea3]/40 text-[#4edea3] rounded-full text-xs font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#dae2fd] flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-[#ffb4ab]" />
                  <span>Missing Keywords ({currentScan.missingKeywords.length})</span>
                </h3>
                <span className="text-xs text-[#ffb4ab] font-semibold">High Priority</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentScan.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#ffb4ab]/10 border border-[#ffb4ab]/40 text-[#ffb4ab] rounded-full text-xs font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Bullet Point Rewriter Section */}
          <div className="glass-card rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-[#dae2fd] flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-[#d0bcff]" />
                  <span>AI Experience Bullet Optimization</span>
                </h2>
                <p className="text-xs text-[#c7c4d7]">
                  Transform passive descriptions into high-impact ATS power statements.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {currentScan.bulletPoints.map((bullet) => {
                const variations = bulletVariations[bullet.id];
                const isRewriting = rewritingBulletId === bullet.id;

                return (
                  <div
                    key={bullet.id}
                    className="bg-[#131b2e] border border-[#464554]/50 rounded-xl p-4 md:p-5 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Original Bullet */}
                      <div className="bg-[#ffb4ab]/5 border border-[#ffb4ab]/20 rounded-lg p-3 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-[#ffb4ab] tracking-wider">
                          Original
                        </span>
                        <p className="text-xs text-[#c7c4d7] leading-relaxed">
                          "{bullet.original}"
                        </p>
                      </div>

                      {/* AI Optimized Bullet */}
                      <div className="bg-[#4edea3]/5 border border-[#4edea3]/30 rounded-lg p-3 space-y-1.5 relative">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold text-[#4edea3] tracking-wider">
                            Optimized (Active)
                          </span>
                          <button
                            onClick={() => copyToClipboard(bullet.optimized, bullet.id)}
                            className="text-[#4edea3] hover:text-white text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            {copyStatus[bullet.id] ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-[#dae2fd] font-medium leading-relaxed">
                          "{bullet.optimized}"
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-[#464554]/30">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-[#908fa0]">Verb Impact:</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#4edea3]/20 text-[#4edea3]">
                          High Impact
                        </span>
                      </div>

                      <button
                        onClick={() => handleRewriteBullet(bullet)}
                        disabled={isRewriting}
                        className="px-3.5 py-1.5 bg-[#8083ff]/20 hover:bg-[#8083ff]/30 text-[#c0c1ff] rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#8083ff]/40"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isRewriting ? 'Generating Rewrites...' : 'Generate More Rewrites'}</span>
                      </button>
                    </div>

                    {/* Additional Variations list with "Use This Rewrite" button */}
                    {variations && variations.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-[#464554]/20 animate-fade-in">
                        <p className="text-xs font-semibold text-[#c0c1ff]">
                          Alternative Gemini Rewrites:
                        </p>
                        {variations.map((v, idx) => (
                          <div
                            key={idx}
                            className="bg-[#2d3449]/40 border border-[#464554]/40 rounded-lg p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs text-[#dae2fd]"
                          >
                            <span>"{v}"</span>
                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                onClick={() => handleApplyVariation(bullet.id, v)}
                                className="px-2.5 py-1 bg-[#4edea3]/20 text-[#4edea3] hover:bg-[#4edea3]/30 rounded text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-colors border border-[#4edea3]/40"
                              >
                                <CheckSquare className="w-3.5 h-3.5" />
                                <span>Use This Rewrite</span>
                              </button>
                              <button
                                onClick={() => copyToClipboard(v, `${bullet.id}-var-${idx}`)}
                                className="text-[#c0c1ff] hover:text-white p-1"
                              >
                                {copyStatus[`${bullet.id}-var-${idx}`] ? (
                                  <Check className="w-3.5 h-3.5 text-[#4edea3]" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
