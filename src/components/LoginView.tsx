import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft, Sparkles, User } from 'lucide-react';

interface LoginViewProps {
  onNavigate: (view: 'home' | 'login' | 'signup' | 'forgot' | 'dashboard') => void;
  onLoginSuccess: (name: string, email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('कृपया इमेल र पासवर्ड दुवै हाल्नुहोस्।');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const userName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') || 'प्रयोगकर्ता';
      const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
      onLoginSuccess(formattedName, email);
      onNavigate('dashboard');
    }, 1000);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('राम श्रेष्ठ', 'ram@katha.np');
      onNavigate('dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center relative overflow-hidden bg-slate-950 text-white">
      {/* ATMOSPHERIC BACKGROUND WITH GLOW ORBS */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* TOP BACK BUTTON */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>गृहपृष्ठमा फर्कनुहोस् (Home)</span>
        </button>

        {/* GLASSMORPHISM FORM CARD */}
        <div className="bg-white/10 border border-white/30 rounded-3xl p-8 sm:p-10 text-center text-white backdrop-blur-2xl shadow-[0_0_30px_10px_rgba(0,0,0,0.3)] space-y-6">
          
          {/* HEADER */}
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
              Login
            </h1>
            <p className="text-xs text-white/80 font-medium">
              कथा चौतारीमा स्वागत छ | कथा तथा अडियो साहित्य
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-500/30 border border-rose-400/50 text-rose-100 text-xs text-center font-bold">
              {errorMsg}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            
            {/* USERNAME / EMAIL INPUT BOX */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/80 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="Username or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/20 border border-white/20 text-white placeholder-white/80 text-sm outline-none focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/25 transition-all font-medium"
              />
            </div>

            {/* PASSWORD INPUT BOX */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/80 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-full bg-white/20 border border-white/20 text-white placeholder-white/80 text-sm outline-none focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/25 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-white/90 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-white/30 border-white/40 text-blue-500 focus:ring-0 cursor-pointer accent-white"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => onNavigate('forgot')}
                className="text-white hover:underline font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-500/30 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="inline-block animate-spin">⏳</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>

          </form>

          {/* DEMO LOGIN OPTION */}
          <div className="pt-2">
            <button
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 font-bold text-xs border border-white/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>डेमो लगइन (Demo Quick Login)</span>
            </button>
          </div>

          {/* REGISTER LINK */}
          <div className="pt-2 text-xs sm:text-sm text-white/90 font-medium">
            <span>Don't have an account? </span>
            <button
              onClick={() => onNavigate('signup')}
              className="text-white font-bold hover:underline cursor-pointer"
            >
              Register
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

