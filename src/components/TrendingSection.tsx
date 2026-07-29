import React from 'react';
import { Story } from '../types';
import { Flame, Eye, Heart, BookOpen, Sparkles } from 'lucide-react';

interface TrendingSectionProps {
  stories: Story[];
  bookmarkedIds: string[];
  onToggleBookmark: (story: Story) => void;
  onReadStory: (story: Story) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  stories,
  bookmarkedIds,
  onToggleBookmark,
  onReadStory,
}) => {
  // Sort by engagement score: likes * 2 + views
  const trendingStories = [...stories]
    .sort((a, b) => b.likes * 2 + b.views - (a.likes * 2 + a.views))
    .slice(0, 4);

  return (
    <section id="trending" className="px-5 py-10 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>हट् तथा ट्रेन्डिङ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-2">
              🔥 <span className="hero-title">Trending कथाहरू</span>
            </h2>
          </div>
          <p className="text-gray-300 text-xs md:text-sm max-w-md">
            पाठक र श्रोताहरूमाझ अहिले सर्वाधिक चर्चामा रहेका तथा मन पराइएका कथाहरू।
          </p>
        </div>

        {/* Trending Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trendingStories.map((story, index) => {
            const isBookmarked = bookmarkedIds.includes(story.id);

            return (
              <div
                key={story.id}
                className="group glass rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 flex flex-col hover:shadow-xl hover:-translate-y-1 relative"
              >
                {/* Ranking Badge */}
                <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/40 text-[11px] font-black text-amber-300 flex items-center gap-1 shadow-md">
                  <span className="text-rose-400">#{index + 1}</span>
                  <span>ट्रेन्डिङ</span>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(story);
                  }}
                  className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                    isBookmarked
                      ? 'bg-rose-500 text-white shadow-lg'
                      : 'bg-black/50 text-gray-300 hover:text-rose-400 hover:bg-black/80'
                  }`}
                  title={isBookmarked ? 'मनपर्नेबाट हटाउनुहोस्' : 'मनपर्नेमा थप्नुहोस्'}
                >
                  <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>

                {/* Image Cover */}
                <div
                  className="relative h-44 overflow-hidden cursor-pointer"
                  onClick={() => onReadStory(story)}
                >
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute bottom-2 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500/30 text-amber-200 border border-amber-400/30 backdrop-blur-md">
                    {story.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => onReadStory(story)}
                      className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {story.title}
                    </h3>
                    <p className="text-gray-300 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {story.snippet}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-amber-300">
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>{story.views.toLocaleString('ne-NP')}</span>
                      </span>
                      <span className="flex items-center gap-1 text-rose-300">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        <span>{story.likes.toLocaleString('ne-NP')}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => onReadStory(story)}
                      className="text-amber-300 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>पढ़्नुहोस्</span>
                      <BookOpen className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
