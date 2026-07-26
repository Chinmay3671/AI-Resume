import React, { useState } from 'react';
import { NavTab } from '../types';
import { User, Menu, X, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  theme?: 'light' | 'dark';
  onThemeChange?: () => void;
  onOpenUserProfile?: () => void;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  theme = 'dark',
  onThemeChange,
  onOpenUserProfile,
  userName = 'Chinmay U.',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { tab: NavTab; label: string }[] = [
    { tab: 'scanner', label: 'Scanner' },
    { tab: 'dashboard', label: 'Dashboard & History' },
    { tab: 'analytics', label: 'Analytics Hub' },
    { tab: 'pricing', label: 'Pricing & Credits' },
  ];

  const handleTabClick = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#0b1326]/60 backdrop-blur-xl border-b border-[#464554]/20 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-4 max-w-[1280px] mx-auto">
        {/* Brand Logo */}
        <div
          onClick={() => handleTabClick('scanner')}
          className="cursor-pointer font-bold text-2xl text-[#c0c1ff] drop-shadow-[0_0_15px_rgba(192,193,255,0.3)] tracking-tight hover:opacity-90 transition-opacity"
        >
          ResuMetrics AI
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

        {/* User Profile / Trailing Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenUserProfile}
            className="hidden md:inline text-sm text-[#c7c4d7] hover:text-[#c0c1ff] font-medium transition-colors cursor-pointer"
          >
            {userName} - CSE
          </button>
          <button
            title="Toggle Theme"
            onClick={onThemeChange}
            className="text-[#c0c1ff] hover:text-white transition-colors duration-200 p-1.5 rounded-full hover:bg-[#2d3449]/50 cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            title="User Account Profile"
            onClick={onOpenUserProfile}
            className="text-[#c0c1ff] hover:text-white transition-colors duration-200 p-1.5 rounded-full hover:bg-[#2d3449]/50 cursor-pointer"
          >
            <User className="w-6 h-6 fill-[#c0c1ff]/20" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#c0c1ff] p-1 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b1326] border-b border-[#464554]/30 px-4 py-4 space-y-3 animate-fade-in">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#8083ff]/20 text-[#c0c1ff] font-bold border-l-4 border-[#c0c1ff]'
                    : 'text-[#c7c4d7] hover:bg-[#2d3449]/40 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenUserProfile?.();
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-[#c0c1ff] hover:bg-[#2d3449]/40"
          >
            User Account ({userName})
          </button>
        </div>
      )}
    </header>
  );
};
