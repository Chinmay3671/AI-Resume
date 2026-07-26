import React from 'react';
import { NavTab } from '../types';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  FileCheck,
  Cpu,
  Target,
  BarChart3,
  CheckCircle2,
  FileText,
  Copy
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (tab: NavTab) => void;
  onLoadSample?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onLoadSample }) => {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-10 space-y-16 animate-fade-in">
      {/* Top Hero Header Block */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto pt-6">
        {/* Feature Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#8083ff]/15 border border-[#8083ff]/30 text-xs font-semibold text-[#c0c1ff] shadow-lg backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#c0c1ff] animate-pulse" />
          <span>Gemini 2.5 Flash AI • 99.4% ATS Parser Accuracy</span>
        </div>

        {/* High-Impact Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#dae2fd] tracking-tight leading-[1.15]">
          Beat the ATS & Land More Interviews with{' '}
          <span className="gradient-text">AI Precision</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#c7c4d7] max-w-2xl leading-relaxed">
          Upload your resume in <span className="text-[#c0c1ff] font-semibold">.PDF</span> or{' '}
          <span className="text-[#c0c1ff] font-semibold">.DOCX</span>. ResuMetrics AI evaluates formatting, keyword density, and experience impact to deliver instant, high-converting bullet point rewrites.
        </p>

        {/* Dynamic CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 w-full max-w-md">
          <button
            onClick={() => onNavigate('scanner')}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#8083ff] text-[#0d0096] font-bold text-sm md:text-base rounded-xl glass-glow-accent hover:opacity-95 active:scale-[0.98] transition-all border-t border-white/30 flex items-center justify-center space-x-2.5 cursor-pointer shadow-xl"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              if (onLoadSample) {
                onLoadSample();
              }
              onNavigate('scanner');
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#2d3449]/80 hover:bg-[#31394d] text-[#dae2fd] font-semibold text-sm rounded-xl border border-[#464554]/60 hover:border-[#c0c1ff]/50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#c0c1ff]" />
            <span>Try Sample Resume</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#908fa0]">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
            <span>100% Private & Secure</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-[#d0bcff]" />
            <span>Sub-Second Analysis</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <FileCheck className="w-4 h-4 text-[#c0c1ff]" />
            <span>PDF & DOCX Support</span>
          </div>
        </div>
      </div>

      {/* Hero Showcase Card / Mockup Preview */}
      <div className="relative glass-card rounded-2xl p-6 md:p-8 border border-[#8083ff]/30 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#8083ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-[#571bc1]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Summary & Stats Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#2d3449] border border-[#464554]/40 text-xs text-[#c0c1ff]">
              <Cpu className="w-3.5 h-3.5" />
              <span>Live ATS Simulation Dashboard</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-[#dae2fd]">
              See How Recruiters & ATS Systems View Your Resume
            </h3>

            <p className="text-sm text-[#c7c4d7] leading-relaxed">
              ResuMetrics AI scans your document line by line, calculating hard skill match ratios, identifying missing target keywords, and generating high-impact bullet points.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <div className="p-1 rounded-full bg-[#4edea3]/20 text-[#4edea3] mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs text-[#dae2fd]">
                  <strong className="text-[#4edea3]">Format Audit:</strong> Ensures tables, columns, and fonts parse cleanly in Workday, Greenhouse, & Taleo.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 rounded-full bg-[#c0c1ff]/20 text-[#c0c1ff] mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs text-[#dae2fd]">
                  <strong className="text-[#c0c1ff]">Keyword Gap Detection:</strong> Flags missing technical & soft skills required for your dream role.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 rounded-full bg-[#d0bcff]/20 text-[#d0bcff] mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs text-[#dae2fd]">
                  <strong className="text-[#d0bcff]">AI Action Rewrites:</strong> Turns weak descriptions into metric-backed achievements instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Right Simulated Analytics Widget */}
          <div className="lg:col-span-7 bg-[#0b1326]/80 rounded-xl border border-[#464554]/40 p-6 space-y-6 backdrop-blur-md">
            {/* Score Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#464554]/30">
              <div className="flex items-center space-x-4">
                {/* Score Ring */}
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="38"
                      stroke="currentColor"
                      strokeWidth="7"
                      className="text-[#2d3449]"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="38"
                      stroke="currentColor"
                      strokeWidth="7"
                      className="text-[#4edea3]"
                      strokeDasharray={238}
                      strokeDashoffset={238 - (238 * 88) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-extrabold text-[#dae2fd]">88%</span>
                    <span className="text-[9px] uppercase font-bold text-[#908fa0]">Score</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#c0c1ff]" />
                    <h4 className="text-sm font-bold text-[#dae2fd]">Senior_Software_Engineer_Resume.pdf</h4>
                  </div>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#4edea3]/10 border border-[#4edea3]/40 text-[#4edea3]">
                    Passed ATS Screening
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('scanner')}
                className="px-4 py-2 bg-[#8083ff] text-[#0d0096] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                Scan Yours Now
              </button>
            </div>

            {/* Metrics Breakdown Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#131b2e] p-3.5 rounded-lg border border-[#464554]/30 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#c7c4d7]">
                  <span>Formatting</span>
                  <span className="text-[#c0c1ff]">92%</span>
                </div>
                <div className="w-full bg-[#2d3449] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#c0c1ff] h-1.5 rounded-full w-[92%]" />
                </div>
              </div>

              <div className="bg-[#131b2e] p-3.5 rounded-lg border border-[#464554]/30 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#c7c4d7]">
                  <span>Keywords</span>
                  <span className="text-[#4edea3]">85%</span>
                </div>
                <div className="w-full bg-[#2d3449] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#4edea3] h-1.5 rounded-full w-[85%]" />
                </div>
              </div>

              <div className="bg-[#131b2e] p-3.5 rounded-lg border border-[#464554]/30 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#c7c4d7]">
                  <span>Impact Verbs</span>
                  <span className="text-[#d0bcff]">87%</span>
                </div>
                <div className="w-full bg-[#2d3449] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#d0bcff] h-1.5 rounded-full w-[87%]" />
                </div>
              </div>
            </div>

            {/* Sample Bullet Rewrite Preview Box */}
            <div className="bg-[#171f33] p-4 rounded-xl border border-[#464554]/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#ffb4ab] font-medium line-through">Before: "Responsible for fixing web app bugs"</span>
                <span className="px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-bold uppercase">AI Optimized</span>
              </div>
              <p className="text-xs text-[#dae2fd] font-medium leading-relaxed">
                "Architected robust frontend bug fixes across 14 React modules, reducing user bounce rate by 24% and improving application speed."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid (4 Features) */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#dae2fd]">
            Designed for Modern Job Seekers
          </h2>
          <p className="text-sm text-[#c7c4d7]">
            Everything you need to optimize your resume and land target role interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-xl p-6 space-y-3 border border-[#464554]/30 hover:border-[#c0c1ff]/40 transition-all hover:glow-accent">
            <div className="w-10 h-10 rounded-lg bg-[#8083ff]/20 flex items-center justify-center text-[#c0c1ff]">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#dae2fd]">ATS Score Ring</h3>
            <p className="text-xs text-[#c7c4d7] leading-relaxed">
              Instant circular score calculation with sub-metric breakdowns for formatting, keywords, and action impact.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-3 border border-[#464554]/30 hover:border-[#c0c1ff]/40 transition-all hover:glow-accent">
            <div className="w-10 h-10 rounded-lg bg-[#4edea3]/20 flex items-center justify-center text-[#4edea3]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#dae2fd]">AI Bullet Rewrites</h3>
            <p className="text-xs text-[#c7c4d7] leading-relaxed">
              Transform passive experience descriptions into metric-backed impact statements with 1-click copy functionality.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-3 border border-[#464554]/30 hover:border-[#c0c1ff]/40 transition-all hover:glow-accent">
            <div className="w-10 h-10 rounded-lg bg-[#d0bcff]/20 flex items-center justify-center text-[#d0bcff]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#dae2fd]">Keyword Density Gap</h3>
            <p className="text-xs text-[#c7c4d7] leading-relaxed">
              Cross-reference target job descriptions to discover high-priority missing technical skills and certifications.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-3 border border-[#464554]/30 hover:border-[#c0c1ff]/40 transition-all hover:glow-accent">
            <div className="w-10 h-10 rounded-lg bg-[#c0c1ff]/20 flex items-center justify-center text-[#c0c1ff]">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#dae2fd]">PDF & DOCX Support</h3>
            <p className="text-xs text-[#c7c4d7] leading-relaxed">
              Native drag-and-drop parsing for Word documents and PDFs with zero data leakage or file corruption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
