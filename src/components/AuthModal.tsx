import React, { useState } from 'react';
import { UserProfile } from '../types';
import { signInWithGoogle } from '../firebase';
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const googleUser = await signInWithGoogle();
      onLoginSuccess(googleUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        provider: 'email/password',
        isLoggedIn: true,
      };
      onLoginSuccess(demoUser);
      setLoading(false);
      onClose();
    }, 500);
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
        provider: 'email/password',
        isLoggedIn: true,
      };

      onLoginSuccess(authenticatedUser);
      setLoading(false);
      onClose();
    }, 600);
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

        {/* OFFICIAL GOOGLE SIGN IN BUTTON */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs md:text-sm rounded-xl border border-slate-300 shadow-md flex items-center justify-center space-x-3 transition-all cursor-pointer hover:shadow-lg active:scale-[0.99]"
        >
          {/* Official Google "G" SVG Logo */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-[#464554]/40 w-full" />
          <span className="bg-[#131b2e] px-3 text-[11px] text-[#908fa0] font-semibold uppercase tracking-wider shrink-0">
            or use email & password
          </span>
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

        {/* Quick Demo Login CTA */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-2 bg-[#4edea3]/10 hover:bg-[#4edea3]/20 text-[#4edea3] font-bold text-xs rounded-xl border border-[#4edea3]/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
          <span>⚡ Quick Demo Sign-In</span>
        </button>

        {/* Footer info */}
        <p className="text-[11px] text-[#908fa0] text-center">
          By continuing, you agree to ResuMetrics AI Privacy Policy and Terms of Service.
        </p>
      </div>
    </div>
  );
};
