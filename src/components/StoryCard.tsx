import React from 'react';
import { Story } from '../types';
import { Heart, Clock, Eye, BookOpen, User } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  isBookmarked: boolean;
  onToggleBookmark: (story: Story) => void;
  onReadStory: (story: Story) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'लोककथा': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'प्रेरणादायी': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'जीवनकथा': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'रहस्य': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  'भावनात्मक': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'सत्यकथा': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  isBookmarked,
  onToggleBookmark,
  onReadStory,
}) => {
  const categoryColor = CATEGORY_COLORS[story.category] || 'bg-amber-500/20 text-amber-300 border-amber-500/30';

  return (
    <article
      className="story-card glass rounded-3xl overflow-hidden flex flex-col justify-between border border-white/10 hover:border-amber-400/50 transition-all duration-300 group shadow-lg"
      data-title={story.title}
      data-category={story.category}
    >
      <div>
        {/* STORY COVER IMAGE */}
        <div
          className="story-image relative w-full h-48 bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url('${story.coverImage}')` }}
        >
          {/* OVERLAY GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* TOP BADGES */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${categoryColor}`}>
              {story.category}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(story);
              }}
              className={`p-2 rounded-full backdrop-blur-md border transition-transform active:scale-90 cursor-pointer ${
                isBookmarked
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md scale-105'
                  : 'bg-black/40 text-gray-300 border-white/20 hover:text-rose-400'
              }`}
              title={isBookmarked ? 'हटाउनुहोस्' : 'साझा/मनपर्ने'}
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* READ TIME & VIEWS */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-gray-300 z-10 font-medium">
            <span className="flex items-center gap-1 bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
              <Clock className="w-3 h-3 text-amber-400" />
              {story.readTime}
            </span>
            <span className="flex items-center gap-1 bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
              <Eye className="w-3 h-3 text-rose-400" />
              {story.views.toLocaleString()}
            </span>
          </div>
        </div>

        {/* CONTENT INFO */}
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-lg md:text-xl text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {story.title}
          </h3>

          <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
            {story.snippet}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-1">
            <User className="w-3 h-3 text-amber-400" />
            <span>लेखक: {story.author}</span>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="px-5 pb-5 pt-1">
        <button
          onClick={() => onReadStory(story)}
          className="w-full py-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-black font-bold text-xs border border-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
        >
          <span>कथा पढ्नुहोस्</span>
          <BookOpen className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </article>
  );
};
