import React, { useState, useEffect, useMemo } from 'react';
import { NavTab, ScanItem, UserStats } from './types';
import { INITIAL_SCANS, INITIAL_STATS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { ScannerView } from './components/ScannerView';
import { DashboardView } from './components/DashboardView';
import { AnalyticsHubView } from './components/AnalyticsHubView';
import { PricingView } from './components/PricingView';
import { User, Shield, FileText, CheckCircle2, X, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('resumetrics_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  const [scans, setScans] = useState<ScanItem[]>(() => {
    const saved = localStorage.getItem('resumetrics_scans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SCANS;
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('resumetrics_username') || 'Chinmay U.';
  });
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(userName);

  const [activeScanResult, setActiveScanResult] = useState<ScanItem | null>(null);
  const [activeModal, setActiveModal] = useState<'userProfile' | 'privacy' | 'terms' | 'ats' | null>(null);

  // Sync username to localStorage
  useEffect(() => {
    localStorage.setItem('resumetrics_username', userName);
  }, [userName]);

  // Sync theme to localStorage and DOM with dark-mode / light-mode classes
  useEffect(() => {
    localStorage.setItem('resumetrics_theme', theme);
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark-mode');
      html.classList.remove('light-mode');
    } else {
      html.classList.add('light-mode');
      html.classList.remove('dark-mode');
    }
  }, [theme]);

  // Sync scans to localStorage
  useEffect(() => {
    localStorage.setItem('resumetrics_scans', JSON.stringify(scans));
  }, [scans]);

  // Recalculate stats dynamically based on scan history (memoized for performance)
  const stats: UserStats = useMemo(() => ({
    totalAnalyzed: scans.length,
    avgAtsScore: scans.length > 0
      ? Math.round(scans.reduce((acc, curr) => acc + curr.atsScore, 0) / scans.length)
      : 0,
    aiRewritesUsed: INITIAL_STATS.aiRewritesUsed + scans.reduce((acc, curr) => acc + (curr.bulletPoints?.length || 0), 0),
  }), [scans]);

  const handleScanCompleted = (newScan: ScanItem) => {
    setScans((prev) => [newScan, ...prev]);
    setActiveScanResult(newScan);
  };

  const handleViewScan = (scan: ScanItem) => {
    setActiveScanResult(scan);
    setActiveTab('scanner');
  };

  const handleDeleteScan = (id: string) => {
    setScans((prev) => prev.filter((s) => s.id !== id));
    if (activeScanResult?.id === id) {
      setActiveScanResult(null);
    }
  };

  const handleResetHistory = () => {
    setScans(INITIAL_SCANS);
    setActiveScanResult(null);
    localStorage.removeItem('resumetrics_scans');
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab !== 'scanner') {
      setActiveScanResult(null);
    }
    setActiveTab(tab);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col font-sans selection:bg-[#8083ff]/30 selection:text-[#ffffff] transition-colors duration-300">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        theme={theme}
        onThemeChange={toggleTheme}
        userName={userName}
        onOpenUserProfile={() => {
          setNameInput(userName);
          setIsEditingName(false);
          setActiveModal('userProfile');
        }}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        {activeTab === 'scanner' && (
          <ScannerView
            onScanCompleted={handleScanCompleted}
            activeScanResult={activeScanResult}
            onClearActiveResult={() => setActiveScanResult(null)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            scans={scans}
            stats={stats}
            onViewScan={handleViewScan}
            onDeleteScan={handleDeleteScan}
            onResetHistory={handleResetHistory}
            onNavigateScanner={() => {
              setActiveScanResult(null);
              setActiveTab('scanner');
            }}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsHubView scans={scans} />}

        {activeTab === 'pricing' && <PricingView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#464554]/20 py-6 text-center text-xs text-[#908fa0]">
        <div className="max-w-[1280px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 ResuMetrics AI. Powered by Gemini 2.5 Flash.</p>
          <div className="flex space-x-4">
            <span
              onClick={() => setActiveModal('privacy')}
              className="hover:text-[#c0c1ff] cursor-pointer transition-colors"
            >
              Privacy Policy
            </span>
            <span
              onClick={() => setActiveModal('terms')}
              className="hover:text-[#c0c1ff] cursor-pointer transition-colors"
            >
              Terms of Service
            </span>
            <span
              onClick={() => setActiveModal('ats')}
              className="hover:text-[#c0c1ff] cursor-pointer transition-colors"
            >
              ATS Guidelines
            </span>
          </div>
        </div>
      </footer>

      {/* Modal Dialogs */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#131b2e] border border-[#464554] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[#908fa0] hover:text-white p-1 rounded-full hover:bg-[#2d3449] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content Switch */}
            {activeModal === 'userProfile' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-[#464554]/40 pb-4">
                  <div className="w-12 h-12 rounded-full bg-[#8083ff]/20 flex items-center justify-center text-[#c0c1ff]">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    {isEditingName ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className="bg-[#171f33] border border-[#c0c1ff] text-[#dae2fd] text-sm rounded px-2.5 py-1 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            if (nameInput.trim()) {
                              setUserName(nameInput.trim());
                            }
                            setIsEditingName(false);
                          }}
                          className="px-2.5 py-1 bg-[#4edea3] text-[#003824] font-bold text-xs rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-[#dae2fd]">{userName}</h3>
                        <button
                          onClick={() => {
                            setNameInput(userName);
                            setIsEditingName(true);
                          }}
                          className="text-[11px] text-[#c0c1ff] hover:underline cursor-pointer"
                        >
                          (Edit)
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-[#c7c4d7]">Computer Science & Engineering Student</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-[#c7c4d7]">
                  <div className="flex justify-between py-1 border-b border-[#464554]/20">
                    <span>Account Tier:</span>
                    <span className="text-[#4edea3] font-bold">Pro Job Hunter</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#464554]/20">
                    <span>Scans Completed:</span>
                    <span className="text-[#dae2fd] font-semibold">{scans.length}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#464554]/20">
                    <span>AI Rewrites Used:</span>
                    <span className="text-[#d0bcff] font-semibold">{stats.aiRewritesUsed}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#464554]/20">
                    <span>Gemini Model:</span>
                    <span className="text-[#c0c1ff]">Gemini 2.5 Flash</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2 bg-[#8083ff]/20 text-[#c0c1ff] font-semibold rounded-lg hover:bg-[#8083ff]/30 text-xs transition-colors cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-[#464554]/40 pb-3">
                  <Shield className="w-5 h-5 text-[#4edea3]" />
                  <h3 className="text-lg font-bold text-[#dae2fd]">Privacy Policy</h3>
                </div>
                <div className="text-xs text-[#c7c4d7] space-y-2 max-h-60 overflow-y-auto pr-2">
                  <p>ResuMetrics AI values your privacy. Here is how your data is handled:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Resume text and job descriptions are analyzed securely via Google Gemini API.</li>
                    <li>No uploaded resumes are sold or shared with external recruiters without your consent.</li>
                    <li>All scan history is stored locally in your browser storage or optional private Supabase instance.</li>
                  </ul>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2 bg-[#2d3449] text-[#dae2fd] font-semibold rounded-lg text-xs hover:bg-[#31394d]"
                >
                  Got It
                </button>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-[#464554]/40 pb-3">
                  <FileText className="w-5 h-5 text-[#c0c1ff]" />
                  <h3 className="text-lg font-bold text-[#dae2fd]">Terms of Service</h3>
                </div>
                <div className="text-xs text-[#c7c4d7] space-y-2 max-h-60 overflow-y-auto pr-2">
                  <p>By using ResuMetrics AI, you agree to the following terms:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>This platform is designed to assist in optimizing resume structure and keyword density.</li>
                    <li>Match scores are recommendations generated using AI algorithms and do not guarantee hiring outcomes.</li>
                    <li>Users are responsible for ensuring all resume claims and experience entries are factual.</li>
                  </ul>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2 bg-[#2d3449] text-[#dae2fd] font-semibold rounded-lg text-xs hover:bg-[#31394d]"
                >
                  Accept & Close
                </button>
              </div>
            )}

            {activeModal === 'ats' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-[#464554]/40 pb-3">
                  <Sparkles className="w-5 h-5 text-[#d0bcff]" />
                  <h3 className="text-lg font-bold text-[#dae2fd]">ATS Optimization Guidelines</h3>
                </div>
                <div className="text-xs text-[#c7c4d7] space-y-2 max-h-60 overflow-y-auto pr-2">
                  <p className="font-semibold text-white">Top 4 Rules for Passing ATS Systems:</p>
                  <ol className="list-decimal pl-4 space-y-1.5">
                    <li><strong className="text-[#c0c1ff]">Standard Layout:</strong> Use single-column standard PDF/Word formats. Avoid text boxes or complex graphic tables.</li>
                    <li><strong className="text-[#4edea3]">Keyword Matching:</strong> Include exact hard skills and tools mentioned in target job descriptions.</li>
                    <li><strong className="text-[#d0bcff]">Action Verbs:</strong> Start experience bullet points with strong power verbs (e.g., Engineered, Spearheaded, Architected).</li>
                    <li><strong className="text-[#ffb4ab]">Quantified Results:</strong> Always include percentage gains, metric counts, or revenue impact numbers.</li>
                  </ol>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2 bg-[#2d3449] text-[#dae2fd] font-semibold rounded-lg text-xs hover:bg-[#31394d]"
                >
                  Understood
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
