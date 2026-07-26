import React, { useState } from 'react';
import { NavTab, UserProfile } from '../types';
import { User, Menu, X, Moon, Sun, Sparkles, Rocket, LogIn, UserPlus, LogOut, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  theme?: 'light' | 'dark';
  onThemeChange?: () => void;
  user?: UserProfile | null;
  onOpenAuthModal?: (mode?: 'login' | 'signup') => void;
  onOpenUserProfile?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  theme = 'dark',
  onThemeChange,
  user,
  onOpenAuthModal,
  onOpenUserProfile,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { tab: NavTab; label: string }[] = [
    { tab: 'hero', label: 'Features' },
    { tab: 'scanner', label: 'Scanner' },
    { tab: 'dashboard', label: 'History & Dashboard' },
    { tab: 'analytics', label: 'Analytics' },
    { tab: 'pricing', label: 'Pricing' },
  ];

  const handleTabClick = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const isLoggedIn = Boolean(user && user.isLoggedIn);

  return (
    <header className="bg-[#0b1326]/70 backdrop-blur-xl border-b border-[#464554]/20 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-3.5 max-w-[1280px] mx-auto relative">
        {/* Brand Logo */}
        <div
          onClick={() => handleTabClick('hero')}
          className="cursor-pointer flex items-center space-x-2 font-bold text-xl md:text-2xl text-[#c0c1ff] drop-shadow-[0_0_15px_rgba(192,193,255,0.3)] tracking-tight hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-[#8083ff] text-[#0d0096] flex items-center justify-center font-extrabold shadow-md">
            R
          </div>
          <span>ResuMetrics AI</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                className={`text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#c0c1ff] font-bold border-b-2 border-[#c0c1ff] pb-1'
                    : 'text-[#c7c4d7] hover:text-[#c0c1ff]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons & User Auth Profile */}
        <div className="flex items-center space-x-3">
          {/* Prominent "Get Started" CTA */}
          <button
            onClick={() => handleTabClick('scanner')}
            className="hidden sm:flex items-center space-x-1.5 px-4 py-2 bg-[#8083ff] text-[#0d0096] font-bold text-xs md:text-sm rounded-xl glass-glow-accent hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer shadow-md"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Get Started</span>
          </button>

          {/* Theme Toggle */}
          <button
            title="Toggle Theme"
            onClick={onThemeChange}
            className="text-[#c0c1ff] hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-[#2d3449]/60 cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          {/* AUTH STATE USER CONTROLS */}
          {isLoggedIn ? (
            /* Logged In User Avatar Dropdown */
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 text-[#c0c1ff] hover:text-white transition-all duration-200 p-1.5 rounded-xl hover:bg-[#2d3449]/60 cursor-pointer border border-[#8083ff]/30 bg-[#131b2e]"
              >
                <div className="w-7 h-7 rounded-full bg-[#8083ff] text-[#0d0096] font-bold text-xs flex items-center justify-center">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden lg:inline text-xs font-semibold text-[#dae2fd]">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#908fa0]" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#131b2e] border border-[#464554]/60 rounded-2xl p-2 shadow-2xl space-y-1 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-[#464554]/30 space-y-0.5">
                    <p className="text-xs font-bold text-[#dae2fd]">{user?.name}</p>
                    <p className="text-[11px] text-[#908fa0] truncate">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenUserProfile?.();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#c7c4d7] hover:bg-[#2d3449]/60 hover:text-white flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#c0c1ff]" />
                    <span>Account Profile</span>
                  </button>

                  <button
                    onClick={() => handleTabClick('dashboard')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#c7c4d7] hover:bg-[#2d3449]/60 hover:text-white flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#4edea3]" />
                    <span>Saved Scans</span>
                  </button>

                  <div className="border-t border-[#464554]/30 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#ffb4ab] hover:bg-[#ffb4ab]/10 flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Guest Controls (Log In & Sign Up buttons) */
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={() => onOpenAuthModal?.('login')}
                className="px-3.5 py-1.5 text-xs font-bold text-[#dae2fd] hover:text-white bg-[#2d3449]/80 hover:bg-[#31394d] border border-[#464554]/60 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#c0c1ff]" />
                <span>Log In</span>
              </button>

              <button
                onClick={() => onOpenAuthModal?.('signup')}
                className="px-3.5 py-1.5 text-xs font-bold text-[#0d0096] bg-[#8083ff] hover:opacity-90 rounded-xl glass-glow-accent transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#c0c1ff] p-1.5 rounded-lg focus:outline-none hover:bg-[#2d3449]/50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b1326] border-b border-[#464554]/30 px-4 py-4 space-y-3 animate-fade-in shadow-2xl">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#8083ff]/20 text-[#c0c1ff] font-bold border-l-4 border-[#c0c1ff]'
                    : 'text-[#c7c4d7] hover:bg-[#2d3449]/40 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#464554]/30 space-y-2">
            {isLoggedIn ? (
              <>
                <div className="px-4 py-2 bg-[#131b2e] rounded-xl border border-[#464554]/40 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#dae2fd]">{user?.name}</p>
                    <p className="text-[10px] text-[#908fa0]">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenUserProfile?.();
                    }}
                    className="text-xs text-[#c0c1ff] underline"
                  >
                    Profile
                  </button>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout?.();
                  }}
                  className="w-full py-2.5 bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal?.('login');
                  }}
                  className="py-2.5 bg-[#2d3449] text-[#dae2fd] font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer border border-[#464554]"
                >
                  <LogIn className="w-4 h-4 text-[#c0c1ff]" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal?.('signup');
                  }}
                  className="py-2.5 bg-[#8083ff] text-[#0d0096] font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
