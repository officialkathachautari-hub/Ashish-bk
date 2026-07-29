import React, { useState, useEffect, useRef } from 'react';
import { Story } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Zap, 
  BookOpen, 
  Volume2, 
  Heart, 
  Sparkles, 
  Flame, 
  RotateCcw,
  Sliders
} from 'lucide-react';

interface FastScrollSlidesProps {
  stories: Story[];
  bookmarkedIds: string[];
  onToggleBookmark: (story: Story) => void;
  onReadStory: (story: Story) => void;
}

export const FastScrollSlides: React.FC<FastScrollSlidesProps> = ({
  stories,
  bookmarkedIds,
  onToggleBookmark,
  onReadStory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(2); // 1x, 2x, 3x, 5x
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Speed intervals in milliseconds (higher speed = lower interval)
  const speedIntervals: Record<number, number> = {
    1: 3500, // Normal
    2: 2200, // Fast
    3: 1200, // Super Fast
    5: 600,  // Ultra Fast
  };

  const activeInterval = speedIntervals[speed] || 2200;

  // Auto-scroll slides effect
  useEffect(() => {
    if (!isPlaying || isHovered || stories.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
    }, activeInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, stories.length, activeInterval, speed]);

  const handleNext = () => {
    if (stories.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    if (stories.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  if (stories.length === 0) return null;

  const currentStory = stories[currentIndex];
  const isBookmarked = bookmarkedIds.includes(currentStory.id);

  return (
    <section id="fast-slides" className="px-5 py-10 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* SECTION HEADER WITH FAST SCROLL CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-3xl border border-amber-500/30">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-current animate-bounce" />
              <span>फास्ट स्क्रोल स्लाइडर (Fast Scroll Slides)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
              ⚡ <span className="hero-title">द्रुत कथा स्लाइडहरू</span>
            </h2>
            <p className="text-gray-300 text-xs mt-1">
              तीव्र गतिमा कथाहरू स्क्रोल र स्लाइड गरेर छिटो-छिटो अवलोकन गर्नुहोस्।
            </p>
          </div>

          {/* CONTROLS TOOLBAR */}
          <div className="flex flex-wrap items-center gap-2.5 bg-black/60 p-2.5 rounded-2xl border border-white/10">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
              title={isPlaying ? 'अटो-स्लाइड रोक्नुहोस् (Pause)' : 'अटो-स्लाइड सुरु गर्नुहोस् (Play)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span className="hidden sm:inline">{isPlaying ? 'रोक्नुहोस्' : 'सुरु गर्नुहोस्'}</span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold text-gray-400 px-1 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-amber-400" />
                <span>गति:</span>
              </span>
              {[1, 2, 3, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                    speed === s
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-black shadow-md scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  title={`${s}x Fast Scroll Speed`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-amber-500 hover:text-black transition-all cursor-pointer active:scale-95"
                title="अघिल्लो स्लाइड (Previous)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-amber-500 hover:text-black transition-all cursor-pointer active:scale-95"
                title="पछिल्लो स्लाइड (Next)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FEATURED SLIDE DISPLAY CARD */}
        <div
          ref={sliderRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-slate-950 group transition-all"
        >
          {/* Background Blur Overlay */}
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src={currentStory.coverImage}
              alt=""
              className="w-full h-full object-cover blur-2xl scale-125"
            />
          </div>

          <div className="relative z-10 grid md:grid-cols-12 gap-6 p-6 md:p-8 items-center min-h-[380px]">
            
            {/* STORY COVER IMAGE */}
            <div className="md:col-span-5 relative group/img cursor-pointer" onClick={() => onReadStory(currentStory)}>
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                <img
                  src={currentStory.coverImage}
                  alt={currentStory.title}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* CATEGORY BADGE */}
                <span className="absolute top-3 left-3 bg-amber-500 text-black font-extrabold text-xs px-3 py-1 rounded-full shadow-lg">
                  {currentStory.category}
                </span>

                {/* SLIDE NUMBER */}
                <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-amber-300 font-mono text-xs px-2.5 py-1 rounded-lg border border-amber-400/30 font-bold">
                  {currentIndex + 1} / {stories.length}
                </span>
              </div>
            </div>

            {/* STORY DETAILS & FAST ACTIONS */}
            <div className="md:col-span-7 space-y-4 text-left">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Flame className="w-4 h-4 text-rose-400 fill-current" />
                  <span>लेखक: {currentStory.author}</span>
                </span>

                {/* Bookmark Button */}
                <button
                  onClick={() => onToggleBookmark(currentStory)}
                  className={`p-2.5 rounded-2xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                    isBookmarked
                      ? 'bg-rose-500 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:text-rose-300 hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current text-white' : ''}`} />
                  <span>{isBookmarked ? 'मनपर्यो' : 'थप्नुहोस्'}</span>
                </button>
              </div>

              {/* TITLE */}
              <h3 
                onClick={() => onReadStory(currentStory)}
                className="text-2xl md:text-3xl font-black text-white hover:text-amber-300 transition-colors cursor-pointer leading-tight"
              >
                {currentStory.title}
              </h3>

              {/* SNIPPET */}
              <p className="text-gray-300 text-xs md:text-sm line-clamp-3 leading-relaxed">
                {currentStory.snippet}
              </p>

              {/* STATS & TAGS */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-300 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1 text-amber-300">
                  👀 {currentStory.views.toLocaleString('ne-NP')} पटक हेरिएको
                </span>
                <span className="flex items-center gap-1 text-rose-300">
                  💖 {currentStory.likes.toLocaleString('ne-NP')} लाइक्स
                </span>
                <span className="flex items-center gap-1 text-emerald-300">
                  ⏱️ ५ मिनेट पढाइ
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => onReadStory(currentStory)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-extrabold text-xs shadow-xl cursor-pointer transition-transform hover:scale-105 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-rose-950" />
                  <span>पूरै कथा पढ्नुहोस्</span>
                </button>

                <button
                  onClick={() => onReadStory(currentStory)}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 cursor-pointer flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>अडियो सुन्नुहोस्</span>
                </button>
              </div>

            </div>
          </div>

          {/* PROGRESS BAR AT BOTTOM */}
          <div className="w-full h-1.5 bg-white/10 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / stories.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* THUMBNAILS SLIDE CAROUSEL AT BOTTOM */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {stories.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-28 md:w-36 p-2 rounded-2xl border transition-all cursor-pointer text-left space-y-1 ${
                currentIndex === idx
                  ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-lg'
                  : 'bg-black/40 border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
              }`}
            >
              <div className="h-16 rounded-xl overflow-hidden relative">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-amber-300 font-bold">
                  #{idx + 1}
                </span>
              </div>
              <p className="text-[11px] font-bold text-white line-clamp-1">
                {story.title}
              </p>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
