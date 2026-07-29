import React from 'react';
import { BookOpen, Sparkles, Moon, Sun, Bookmark, User, Shield, Smartphone, LogIn, LayoutDashboard, Heart, Zap } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAIGenerator: () => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
  userProfile: UserProfile;
  onOpenUserProfile: () => void;
  onOpenAdminPanel: () => void;
  onOpenPWA: () => void;
  onOpenDonate?: () => void;
  currentView?: 'home' | 'login' | 'signup' | 'forgot' | 'dashboard';
  onNavigate?: (view: 'home' | 'login' | 'signup' | 'forgot' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenAIGenerator,
  onOpenBookmarks,
  bookmarksCount,
  userProfile,
  onOpenUserProfile,
  onOpenAdminPanel,
  onOpenPWA,
  onOpenDonate,
  currentView = 'home',
  onNavigate,
}) => {
  return (
    <header className="navbar fixed top-0 left-0 w-full z-50 border-b border-white/10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
        
        {/* LOGO */}
        <button 
          onClick={() => onNavigate && onNavigate('home')} 
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            📖
          </div>
          <div>
            <h1 className="font-black text-lg bg-gradient-to-r from-amber-300 via-amber-400 to-rose-400 bg-clip-text text-transparent">
              कथा चौतारी
            </h1>
            <p className="text-[10px] text-gray-400">नेपाली कथा संसार</p>
          </div>
        </button>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className={`transition-colors cursor-pointer ${currentView === 'home' ? 'text-amber-300 font-extrabold underline' : 'hover:text-amber-400'}`}
          >
            गृहपृष्ठ (Home)
          </button>

          <a
            href="#fast-slides"
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors font-bold"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>फास्ट स्लाइडहरू</span>
          </a>

          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${currentView === 'dashboard' ? 'text-amber-300 font-extrabold underline' : 'hover:text-amber-400'}`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>ड्यासबोर्ड</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('login')}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${currentView === 'login' ? 'text-amber-300 font-extrabold underline' : 'hover:text-amber-400'}`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>लगइन</span>
          </button>

          {/* DONATION BUTTON */}
          <button
            onClick={onOpenDonate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 font-extrabold text-xs transition-all cursor-pointer shadow-sm hover:scale-105"
            title="सहयोग पठाउनुहोस् (Donate)"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
            <span>सहयोग (Donate)</span>
          </button>

          {/* AI STORY WRITER BUTTON */}
          <button
            onClick={onOpenAIGenerator}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>AI कथाकार</span>
          </button>

          {/* PWA & SEO SETTINGS */}
          <button
            onClick={onOpenPWA}
            className="p-2 rounded-full glass hover:bg-white/10 text-amber-300 transition-colors cursor-pointer"
            title="App इन्स्टल र अफलाइन सेटिङ"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* ADMIN PANEL */}
          <button
            onClick={onOpenAdminPanel}
            className="p-2 rounded-full glass hover:bg-white/10 text-emerald-300 transition-colors cursor-pointer"
            title="प्रशासक प्यानल (Admin Panel)"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* BOOKMARKS BUTTON */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-full glass hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Bookmarks"
            title="मनपर्ने कथाहरू"
          >
            <Bookmark className="w-4 h-4 text-amber-300" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* USER PROFILE BUTTON */}
          <button
            onClick={onOpenUserProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all cursor-pointer font-bold"
            title="प्रयोगकर्ता प्रोफाइल र स्ट्रीक"
          >
            <User className="w-3.5 h-3.5" />
            <span>🔥 {userProfile.streakDays}d</span>
          </button>

          {/* THEME TOGGLE */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full glass hover:bg-white/10 transition-colors cursor-pointer text-sm"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'उज्यालो मोडलगाउनुहोस्' : 'अँध्यारो मोडलगाउनुहोस्'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-600" />}
          </button>
        </nav>

        {/* MOBILE HEADER CONTROLS */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            onClick={onOpenDonate}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-600/40 text-rose-200 border border-rose-500/40 text-[11px] font-bold shadow-sm"
            title="डोनेसन पठाउनुहोस्"
          >
            <Heart className="w-3 h-3 text-rose-400 fill-current" />
            <span>सहयोग</span>
          </button>

          <button
            onClick={onOpenAIGenerator}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[11px] font-bold shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI</span>
          </button>

          <button
            onClick={onOpenUserProfile}
            className="px-2 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold"
          >
            🔥 {userProfile.streakDays}d
          </button>

          <button
            onClick={onOpenAdminPanel}
            className="p-1.5 rounded-full glass text-emerald-300"
            title="Admin"
          >
            <Shield className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenBookmarks}
            className="relative p-1.5 rounded-full glass"
            aria-label="Bookmarks"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-300" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {bookmarksCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-full glass text-xs"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

      </div>
    </header>
  );
};
