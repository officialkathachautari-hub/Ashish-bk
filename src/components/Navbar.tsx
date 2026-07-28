import React from 'react';
import { BookOpen, Sparkles, Moon, Sun, Bookmark, Search, Info, Film } from 'lucide-react';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAIGenerator: () => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenAIGenerator,
  onOpenBookmarks,
  bookmarksCount,
}) => {
  return (
    <header className="navbar fixed top-0 left-0 w-full z-50 border-b border-white/10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
        
        {/* LOGO */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            📖
          </div>
          <div>
            <h1 className="font-black text-lg bg-gradient-to-r from-amber-300 via-amber-400 to-rose-400 bg-clip-text text-transparent">
              कथा चौतारी
            </h1>
            <p className="text-[10px] text-gray-400">नेपाली कथा संसार</p>
          </div>
        </a>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#home" className="hover:text-amber-400 transition-colors">गृहपृष्ठ</a>
          <a href="#featured" className="hover:text-amber-400 transition-colors">विशेष कथा</a>
          <a href="#stories" className="hover:text-amber-400 transition-colors">कथाहरू</a>
          <a href="#about" className="hover:text-amber-400 transition-colors">हाम्रो बारेमा</a>

          {/* AI STORY WRITER BUTTON */}
          <button
            onClick={onOpenAIGenerator}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-semibold text-xs shadow-md hover:scale-105 transition-transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>AI कथाकार</span>
          </button>

          {/* BOOKMARKS BUTTON */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-2.5 rounded-full glass hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Bookmarks"
            title="मनपर्ने कथाहरू"
          >
            <Bookmark className="w-4 h-4 text-amber-300" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* THEME TOGGLE */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-full glass hover:bg-white/10 transition-colors cursor-pointer text-base"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'उज्यालो मोडलगाउनुहोस्' : 'अँध्यारो मोडलगाउनुहोस्'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-600" />}
          </button>
        </nav>

        {/* MOBILE HEADER CONTROLS */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAIGenerator}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI कथा</span>
          </button>

          <button
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-full glass"
            aria-label="Bookmarks"
          >
            <Bookmark className="w-4 h-4 text-amber-300" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {bookmarksCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full glass text-sm"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

      </div>
    </header>
  );
};
