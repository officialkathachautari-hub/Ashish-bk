import React, { useState } from 'react';
import { Story } from '../types';
import { Heart, Play, BookOpen, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface FeaturedVideoProps {
  story: Story;
  isBookmarked: boolean;
  onToggleBookmark: (story: Story) => void;
  onReadStory: (story: Story) => void;
  onAnalyzeMoral: (story: Story) => void;
}

export const FeaturedVideo: React.FC<FeaturedVideoProps> = ({
  story,
  isBookmarked,
  onToggleBookmark,
  onReadStory,
  onAnalyzeMoral,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudioNarration = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(story.snippet);
        utterance.lang = 'ne-NP';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      alert('तपाईंको ब्राउजरले अडियो नरेसन सपोर्ट गर्दैन।');
    }
  };

  return (
    <section id="featured" className="px-5 py-20 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* SECTION TITLE */}
        <div className="text-center mb-8">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold tracking-wide animate-float-slow">
            🎬 मुख्य प्रस्तुति भिडियो कथा
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-3 hero-title">
            {story.title}
          </h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base max-w-lg mx-auto">
            {story.snippet}
          </p>
        </div>

        {/* FEATURED CARD CONTAINER */}
        <div className="glass rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden group border border-amber-500/20">
          
          {/* VIDEO PLAYER */}
          <div className="video-container shadow-2xl rounded-2xl overflow-hidden border border-white/10">
            <iframe
              src={story.videoUrl || "https://www.youtube.com/embed/tj8P_bbCvHY"}
              title={`${story.title} - कथा चौतारी`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* DETAILS & ACTIONS */}
          <div className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                    {story.category}
                  </span>
                  <span className="text-xs text-gray-400">• {story.readTime}</span>
                  <span className="text-xs text-gray-400">• {story.views.toLocaleString()} दर्शक</span>
                </div>
                <h3 className="font-bold text-xl md:text-2xl text-white">
                  {story.title} | विशेष दृश्य-कथा
                </h3>
              </div>

              {/* FAVORITE / BOOKMARK BUTTON */}
              <button
                onClick={() => onToggleBookmark(story)}
                className={`p-3 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                  isBookmarked
                    ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30 scale-110'
                    : 'glass text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                }`}
                title={isBookmarked ? 'मनपर्ने सूचीबाट हटाउनुहोस्' : 'मनपर्नेमा राख्नुहोस्'}
              >
                <Heart className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">
              {story.fullContent.slice(0, 240)}...
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onReadStory(story)}
                  className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>पुरा कथा पढ्नुहोस्</span>
                </button>

                <button
                  onClick={toggleAudioNarration}
                  className="px-4 py-2.5 rounded-full glass hover:bg-white/10 text-amber-300 font-medium text-xs flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4 text-rose-400 animate-pulse" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
                  <span>{isPlayingAudio ? 'नरेसन रोक्नुहोस्' : 'संक्षिप्त सुन्नुहोस्'}</span>
                </button>
              </div>

              <button
                onClick={() => onAnalyzeMoral(story)}
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-200 font-semibold text-xs flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI द्वारा नैतिक शिक्षा हेर्नुहोस्</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
