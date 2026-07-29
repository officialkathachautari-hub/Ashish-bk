import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, ArrowLeft, Check, ShieldCheck } from 'lucide-react';

interface SignupViewProps {
  onNavigate: (view: 'home' | 'login' | 'signup' | 'forgot' | 'dashboard') => void;
  onSignupSuccess: (name: string, email: string) => void;
}

export const SignupView: React.FC<SignupViewProps> = ({ onNavigate, onSignupSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength checker
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', percent: 0 };
    if (password.length < 6) return { label: 'कमजोर (Weak)', color: 'bg-rose-500', percent: 33 };
    if (password.length < 10) return { label: 'मध्यम (Medium)', color: 'bg-amber-500', percent: 66 };
    return { label: 'बलियो (Strong)', color: 'bg-emerald-500', percent: 100 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('कृपया सबै आवश्यक विवरणहरू भर्नुहोस्।');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('पासवर्डहरू मिलेनन्! कृपया पुनः जाँच गर्नुहोस्।');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('कृपया सर्त र नियमहरू स्वीकार गर्नुहोस्।');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      onSignupSuccess(name, email);
      onNavigate('dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center relative overflow-hidden bg-slate-950 text-white">
      {/* BACKGROUND ANIMATED GLOW */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* TOP BACK BUTTON */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-amber-300 transition-colors cursor-pointer glass px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>गृहपृष्ठमा फर्कनुहोस् (Home)</span>
        </button>

        {/* CARD CONTAINER */}
        <div className="bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-900/90 border border-rose-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6 animate-fadeIn">
          
          {/* HEADER */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-3xl shadow-lg shadow-rose-500/20">
              ✨
            </div>
            <h2 className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-amber-300 to-amber-200">
              नयाँ खाता सिर्जना गर्नुहोस्
            </h2>
            <p className="text-xs text-gray-400">
              कथा चौतारी समुदायमा जोडिएर असीमित नेपाली कथाहरूको आनन्द लिनुहोस्
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center font-bold">
              {errorMsg}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* FULL NAME */}
            <div className="space-y-1">
              <label className="block text-xs font-extrabold text-gray-300">पूरा नाम (Full Name)</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="उदा. राम श्रेष्ठ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-white text-xs outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all"
                />
              </div>
            </div>

            {/* EMAIL ADDRESS */}
            <div className="space-y-1">
              <label className="block text-xs font-extrabold text-gray-300">इमेल ठेगाना (Email)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="उदा. ram@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-white text-xs outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="block text-xs font-extrabold text-gray-300">पासवर्ड (Password)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="कम्तिमा ६ अक्षर वा अङ्क"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-white text-xs outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="space-y-1 pt-1">
                  <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 text-right font-medium">
                    पावर: <span className="font-bold text-white">{strength.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-1">
              <label className="block text-xs font-extrabold text-gray-300">पासवर्ड दोहोर्‍याउनुहोस् (Confirm Password)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="पुनः पासवर्ड टाइप गर्नुहोस्"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-white text-xs outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all"
                />
              </div>
            </div>

            {/* TERMS CHECKBOX */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-black/50 border-white/20 text-rose-500 focus:ring-rose-400 cursor-pointer"
                />
                <span>
                  म कथा चौतारीका <span className="text-amber-300 font-bold hover:underline">नियम तथा सर्तहरू</span> मञ्जुर गर्दछु।
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-black font-extrabold text-xs shadow-xl cursor-pointer transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="inline-block animate-spin">⏳</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>खाता सिर्जना गर्नुहोस् (Sign Up)</span>
                </>
              )}
            </button>

          </form>

          {/* FOOTER SWITCH TO LOGIN */}
          <div className="pt-4 border-t border-white/10 text-center text-xs text-gray-400">
            <span>पहिल्यै खाता छ? </span>
            <button
              onClick={() => onNavigate('login')}
              className="text-amber-400 font-black hover:underline cursor-pointer"
            >
              लगइन गर्नुहोस् (Sign In)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
