import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Mail, Lock, User, Briefcase, Eye, EyeOff, Sparkles, LogIn, UserPlus, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Computer Science & Engineering Student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDemoLogin = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const demoUser: UserProfile = {
        id: 'usr-demo-1',
        name: 'Chinmay U.',
        email: 'chinmay@resumetrics.ai',
        role: 'Computer Science & Engineering Student',
        tier: 'Pro Job Hunter',
        isLoggedIn: true,
      };
      onLoginSuccess(demoUser);
      setLoading(false);
      onClose();
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const authenticatedUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: mode === 'signup' ? name.trim() : email.split('@')[0],
        email: email.trim(),
        role: role || 'Job Hunter',
        tier: 'Pro Job Hunter',
        isLoggedIn: true,
      };

      onLoginSuccess(authenticatedUser);
      setLoading(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#131b2e] border border-[#464554]/60 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow Accent Effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-[#8083ff]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-[#4edea3]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#908fa0] hover:text-white p-1 rounded-full hover:bg-[#2d3449] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#8083ff]/20 text-[#c0c1ff] mb-2 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#dae2fd]">
            {mode === 'login' ? 'Welcome Back to ResuMetrics' : 'Create Your AI Account'}
          </h2>
          <p className="text-xs text-[#c7c4d7]">
            {mode === 'login'
              ? 'Log in to access saved resume reports & AI rewrites.'
              : 'Sign up for instant ATS parsing, scoring & bullet rewrites.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-[#171f33] p-1 rounded-xl border border-[#464554]/40">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              mode === 'login'
                ? 'bg-[#8083ff] text-[#0d0096] shadow-md'
                : 'text-[#908fa0] hover:text-[#dae2fd]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              mode === 'signup'
                ? 'bg-[#8083ff] text-[#0d0096] shadow-md'
                : 'text-[#908fa0] hover:text-[#dae2fd]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-[#ffb4ab]/10 border border-[#ffb4ab]/40 rounded-xl text-xs text-[#ffb4ab] text-center font-medium">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#c7c4d7]">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#908fa0] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chinmay U."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#171f33] border border-[#464554]/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#dae2fd] placeholder-[#908fa0] focus:border-[#c0c1ff] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#c7c4d7]">Target Role / Discipline</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#908fa0] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Computer Science Student"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#171f33] border border-[#464554]/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#dae2fd] placeholder-[#908fa0] focus:border-[#c0c1ff] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#c7c4d7]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#908fa0] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#171f33] border border-[#464554]/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#dae2fd] placeholder-[#908fa0] focus:border-[#c0c1ff] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#c7c4d7]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#908fa0] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#171f33] border border-[#464554]/50 rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#dae2fd] placeholder-[#908fa0] focus:border-[#c0c1ff] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-[#908fa0] hover:text-[#dae2fd] focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#8083ff] text-[#0d0096] font-extrabold text-sm rounded-xl glass-glow-accent hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Log In to Account' : 'Create Free Account'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-[#464554]/40 w-full" />
          <span className="bg-[#131b2e] px-3 text-[11px] text-[#908fa0] font-semibold uppercase tracking-wider shrink-0">
            or continue with
          </span>
        </div>

        {/* Quick Demo Login CTA */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-2.5 bg-[#4edea3]/15 hover:bg-[#4edea3]/25 text-[#4edea3] font-bold text-xs rounded-xl border border-[#4edea3]/40 flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
          <span>⚡ One-Click Quick Demo Sign-In</span>
        </button>

        {/* Footer info */}
        <p className="text-[11px] text-[#908fa0] text-center">
          By continuing, you agree to ResuMetrics AI Privacy Policy and Terms of Service.
        </p>
      </div>
    </div>
  );
};
