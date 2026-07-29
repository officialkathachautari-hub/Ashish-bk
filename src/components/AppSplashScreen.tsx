import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, Heart, Zap, Play } from 'lucide-react';

interface AppSplashScreenProps {
  onFinish?: () => void;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('मौलिक कथाहरू लोड हुँदैछ...');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Progress counter animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDismissed(true);
            if (onFinish) onFinish();
          }, 400);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 15) + 8;
        if (next > 30 && next <= 60) {
          setStatusText('नेपाली अडियो र स्वर संयोजन गर्दै...');
        } else if (next > 60 && next <= 90) {
          setStatusText('अडियो र चौतारी मञ्च तयार पारिँदै...');
        } else if (next > 90) {
          setStatusText('स्वागत छ! चौतारी तयार भयो।');
        }
        return next > 100 ? 100 : next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onFinish]);

  const handleSkip = () => {
    setProgress(100);
    setIsDismissed(true);
    if (onFinish) onFinish();
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 overflow-hidden select-none"
        >
          {/* AMBIENT BACKGROUND GLOW & PARTICLES */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-amber-950/30 to-slate-950" />
          
          {/* ROTATING BACKGROUND ORB */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.15, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-purple-600/20 via-amber-500/15 to-rose-500/20 blur-3xl pointer-events-none"
          />

          {/* FLOATING LIGHT PARTICLES */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0.2 + Math.random() * 0.5,
                  scale: 0.5 + Math.random() * 0.8,
                }}
                animate={{
                  y: [null, '-=120px', '+=60px'],
                  opacity: [0.3, 0.9, 0.2],
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 2,
                }}
                className="absolute w-2 h-2 rounded-full bg-amber-300 shadow-lg shadow-amber-400/50"
              />
            ))}
          </div>

          {/* MAIN SPLASH CARD CONTENT */}
          <div className="relative z-10 max-w-md w-full mx-4 text-center space-y-7 p-8 rounded-3xl bg-black/40 backdrop-blur-2xl border border-amber-500/30 shadow-2xl shadow-purple-950/80">
            
            {/* LOGO ICON ANIMATION */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative w-24 h-24 mx-auto"
            >
              {/* Outer Pulsing Glow Ring */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 opacity-70 blur-md animate-pulse" />
              
              <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-amber-500 via-rose-500 to-purple-700 p-0.5 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center text-amber-400 shadow-inner">
                  <BookOpen className="w-10 h-10 text-amber-300 animate-bounce" />
                  <Sparkles className="w-4 h-4 text-rose-400 absolute top-2 right-2 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>
            </motion.div>

            {/* BRAND TITLE & TAGLINE */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-2"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-extrabold tracking-wide uppercase">
                <Heart className="w-3 h-3 text-rose-400 fill-current" />
                <span>नेपाली डिजिटल साहित्य मञ्च</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-200 to-purple-300 tracking-tight">
                कथा चौतारी
              </h1>
              
              <p className="text-xs text-gray-300 font-medium max-w-xs mx-auto leading-relaxed">
                नेपाली मौलिक कथा, अडियो साहित्य र कल्पनाको चौतारीमा स्वागत छ।
              </p>
            </motion.div>

            {/* PROGRESS BAR & STATUS */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-3 pt-2"
            >
              {/* Progress Bar Container */}
              <div className="w-full h-2.5 rounded-full bg-black/60 border border-white/10 p-0.5 overflow-hidden shadow-inner relative">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 shadow-lg shadow-amber-400/30"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.15 }}
                />
              </div>

              {/* Status and Percentage */}
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                <span className="text-amber-300/90 truncate max-w-[240px] text-left">
                  {statusText}
                </span>
                <span className="font-mono text-amber-400 text-xs">
                  {progress}%
                </span>
              </div>
            </motion.div>

            {/* QUICK SKIP BUTTON */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleSkip}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-bold text-xs border border-white/10 cursor-pointer transition-all flex items-center gap-1.5 mx-auto active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>सोझै प्रवेश गर्नुहोस् (Skip)</span>
            </motion.button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
