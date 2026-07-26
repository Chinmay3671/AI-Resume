import React, { useState, useEffect, useMemo } from 'react';
import { NavTab, ScanItem, UserStats, UserProfile } from './types';
import { INITIAL_SCANS, INITIAL_STATS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ScannerView } from './components/ScannerView';
import { DashboardView } from './components/DashboardView';
import { AnalyticsHubView } from './components/AnalyticsHubView';
import { PricingView } from './components/PricingView';
import { AuthModal } from './components/AuthModal';
import { User, Shield, FileText, CheckCircle2, X, Sparkles, LogOut, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('hero');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('resumetrics_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  // User Authentication State
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('resumetrics_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default logged in demo user for immediate access
    return {
      id: 'usr-default',
      name: 'Chinmay U.',
      email: 'chinmay@resumetrics.ai',
      role: 'Computer Science & Engineering Student',
      tier: 'Pro Job Hunter',
      isLoggedIn: true,
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(user?.name || 'Chinmay U.');

  const [activeScanResult, setActiveScanResult] = useState<ScanItem | null>(null);
  const [activeModal, setActiveModal] = useState<'userProfile' | 'privacy' | 'terms' | 'ats' | null>(null);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('resumetrics_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('resumetrics_user');
    }
  }, [user]);

  // Sync theme to localStorage and DOM
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

  // Toast notification timer
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLoginSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    triggerToast(`Welcome back, ${authenticatedUser.name}!`);
  };

  const handleLogout = () => {
    const prevName = user?.name;
    setUser(null);
    triggerToast(`Logged out successfully. See you soon${prevName ? ', ' + prevName : ''}!`);
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Recalculate stats dynamically based on scan history
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
      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#131b2e] border border-[#4edea3]/50 text-[#4edea3] text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-fade-in">
          <Check className="w-4 h-4 text-[#4edea3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        theme={theme}
        onThemeChange={toggleTheme}
        user={user}
        onOpenAuthModal={openAuthModal}
        onLogout={handleLogout}
        onOpenUserProfile={() => {
          setNameInput(user?.name || '');
          setIsEditingName(false);
          setActiveModal('userProfile');
        }}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        {activeTab === 'hero' && (
          <HeroSection
            onNavigate={handleTabChange}
          />
        )}

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

      {/* Auth Modal (Log In / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
      />

      {/* Modal Dialogs */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#131b2e] border border-[#464554] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[#908fa0] hover:text-white p-1 rounded-full hover:bg-[#2d3449] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* User Profile Modal */}
            {activeModal === 'userProfile' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 border-b border-[#464554]/40 pb-4">
                  <div className="w-12 h-12 rounded-full bg-[#8083ff] text-[#0d0096] font-extrabold text-lg flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
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
                            if (nameInput.trim() && user) {
                              setUser({ ...user, name: nameInput.trim() });
                            }
                            setIsEditingName(false);
                          }}
                          className="px-2.5 py-1 bg-[#4edea3] text-[#003824] font-bold text-xs rounded cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-[#dae2fd]">{user?.name || 'Guest User'}</h3>
                        <button
                          onClick={() => {
                            setNameInput(user?.name || '');
                            setIsEditingName(true);
                          }}
                          className="text-[11px] text-[#c0c1ff] hover:underline cursor-pointer"
                        >
                          (Edit)
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-[#c7c4d7]">{user?.role || 'Job Hunter'}</p>
                    <p className="text-[11px] text-[#908fa0]">{user?.email || 'Not logged in'}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#c7c4d7]">
                  <div className="flex justify-between py-1 border-b border-[#464554]/20">
                    <span>Account Status:</span>
                    <span className="text-[#4edea3] font-bold">
                      {user?.isLoggedIn ? 'Authenticated' : 'Guest'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#464554]/20">
                    <span>Account Tier:</span>
                    <span className="text-[#4edea3] font-bold">{user?.tier || 'Pro Job Hunter'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#464554]/20">
                    <span>Scans Completed:</span>
                    <span className="text-[#dae2fd] font-semibold">{scans.length}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#464554]/20">
                    <span>AI Rewrites Used:</span>
                    <span className="text-[#d0bcff] font-semibold">{stats.aiRewritesUsed}</span>
                  </div>
                </div>

                {user?.isLoggedIn && (
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      handleLogout();
                    }}
                    className="w-full py-2.5 bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 cursor-pointer hover:bg-[#ffb4ab]/25 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out of Account</span>
                  </button>
                )}
              </div>
            )}

            {/* Privacy Modal */}
            {activeModal === 'privacy' && (
              <div className="space-y-3 text-xs text-[#c7c4d7]">
                <h3 className="text-base font-bold text-[#dae2fd] flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#4edea3]" />
                  <span>Privacy Policy & Data Handling</span>
                </h3>
                <p className="leading-relaxed">
                  ResuMetrics AI processes uploaded resume documents solely for the purpose of analyzing ATS formatting and generating AI optimizations. No resume text is retained permanently on third-party servers.
                </p>
              </div>
            )}

            {/* Terms Modal */}
            {activeModal === 'terms' && (
              <div className="space-y-3 text-xs text-[#c7c4d7]">
                <h3 className="text-base font-bold text-[#dae2fd] flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#c0c1ff]" />
                  <span>Terms of Service</span>
                </h3>
                <p className="leading-relaxed">
                  By using ResuMetrics AI, you agree to submit documents you own or have explicit authorization to optimize.
                </p>
              </div>
            )}

            {/* ATS Guidelines Modal */}
            {activeModal === 'ats' && (
              <div className="space-y-3 text-xs text-[#c7c4d7]">
                <h3 className="text-base font-bold text-[#dae2fd] flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#4edea3]" />
                  <span>ATS Optimization Best Practices</span>
                </h3>
                <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
                  <li>Use clean standard headings (Work Experience, Education, Technical Skills).</li>
                  <li>Avoid complex text boxes or images for critical contact info.</li>
                  <li>Incorporate exact keywords matched against target job descriptions.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
