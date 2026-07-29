import React, { useState } from 'react';
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

interface ForgotPasswordViewProps {
  onNavigate: (view: 'home' | 'login' | 'signup' | 'forgot' | 'dashboard') => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('कृपया आफ्नो इमेल ठेगाना प्रविष्ट गर्नुहोस्।');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      setMessage(`इमेल (${email}) मा ४-अङ्कको OTP कोड पठाइएको छ। (डेमो OTP: 1234)`);
      setStep(2);
    }, 1000);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '1234' && otp.length !== 4) {
      setErrorMsg('गलत OTP कोड! कृपया 1234 प्रविष्ट गर्नुहोस्।');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      setMessage('OTP सफलतापुर्वक प्रमाणित भयो! नयाँ पासवर्ड सेट गर्नुहोस्।');
      setStep(3);
    }, 800);
  };

  // Step 3: Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('नयाँ पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ।');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('दुवै पासवर्डहरू मिलेनन्।');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      setMessage('तपाईंको पासवर्ड सफलतापुर्वक परिवर्तन भयो! अब लगइन गर्नुहोस्।');
      setTimeout(() => {
        onNavigate('login');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center relative overflow-hidden bg-slate-950 text-white">
      {/* BACKGROUND GLOW */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-amber-300 transition-colors cursor-pointer glass px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>लगइन पृष्ठमा फर्कनुहोस् (Back to Login)</span>
        </button>

        {/* CARD CONTAINER */}
        <div className="bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-900/90 border border-sky-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6 animate-fadeIn">
          
          {/* HEADER */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-amber-500 flex items-center justify-center text-3xl shadow-lg shadow-sky-500/20">
              🔑
            </div>
            <h2 className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-amber-300 to-rose-200">
              पासवर्ड पुनःप्राप्ति (Forgot Password)
            </h2>
            <p className="text-xs text-gray-400">
              {step === 1 && 'तपाईंको दर्ता भएको इमेल हालेर OTP कोड प्राप्त गर्नुहोस्'}
              {step === 2 && 'इमेलमा प्राप्त ४-अङ्कको सुरक्षा OTP कोड हाल्नुहोस्'}
              {step === 3 && 'आफ्नो नयाँ सुरक्षित पासवर्ड प्रविष्ट गर्नुहोस्'}
            </p>
          </div>

          {/* STEP INDICATOR */}
          <div className="flex items-center justify-center gap-2">
            <div className={`h-2 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-sky-400' : 'bg-white/10'}`} />
            <div className={`h-2 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-sky-400' : 'bg-white/10'}`} />
            <div className={`h-2 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-emerald-400' : 'bg-white/10'}`} />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center font-bold">
              {errorMsg}
            </div>
          )}

          {message && (
            <div className="p-3 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs text-center font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-300">दर्ता भएको इमेल (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="उदा. ram@katha.np"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-white text-xs outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-amber-500 hover:from-sky-400 hover:to-amber-400 text-black font-extrabold text-xs shadow-xl cursor-pointer transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin">⏳</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>OTP कोड पठाउनुहोस् (Send Verification Code)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-300 text-center">
                  ४-अङ्कको OTP कोड प्रविष्ट गर्नुहोस् (Demo PIN: 1234)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  autoFocus
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center text-3xl font-mono tracking-[0.5em] py-3 rounded-2xl bg-black/50 border border-sky-400 text-white outline-none focus:ring-2 focus:ring-sky-400/30 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-amber-500 hover:from-sky-400 hover:to-amber-400 text-black font-extrabold text-xs shadow-xl cursor-pointer transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin">⏳</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>OTP प्रमाणीकरण गर्नुहोस् (Verify Code)</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-sky-400 hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>इमेल परिवर्तन गरी पुनः कोड पठाउनुहोस्</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-300">नयाँ पासवर्ड (New Password)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="कम्तिमा ६ अक्षर वा अङ्क"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-white text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-300">नयाँ पासवर्ड दोहोर्‍याउनुहोस् (Confirm)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="पुनः नयाँ पासवर्ड हान्नुहोस्"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/50 border border-white/15 text-white text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-black font-extrabold text-xs shadow-xl cursor-pointer transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin">⏳</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>पासवर्ड परिवर्तन गर्नुहोस् (Reset Password)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* FOOTER SWITCH TO LOGIN */}
          <div className="pt-4 border-t border-white/10 text-center text-xs text-gray-400">
            <span>साइन इन गर्न तयार हुनुहुन्छ? </span>
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
