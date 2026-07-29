import React from 'react';
import { Story } from '../types';
import { Sparkles, Clock, BookOpen, Heart, User } from 'lucide-react';

interface NewStoriesSectionProps {
  stories: Story[];
  bookmarkedIds: string[];
  onToggleBookmark: (story: Story) => void;
  onReadStory: (story: Story) => void;
}

export const NewStoriesSection: React.FC<NewStoriesSectionProps> = ({
  stories,
  bookmarkedIds,
  onToggleBookmark,
  onReadStory,
}) => {
  // Show freshest / latest stories
  const newStories = [...stories].slice(0, 4);

  return (
    <section id="new-stories" className="px-5 py-10 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>भर्खरै प्रकाशित</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-2">
              🆕 <span className="hero-title">नयाँ कथाहरू</span>
            </h2>
          </div>
          <p className="text-gray-300 text-xs md:text-sm max-w-md">
            कथा चौतारीमा भर्खरै थपिएका नवीनतम र मौलिक नेपाली कथाहरू।
          </p>
        </div>

        {/* New Stories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newStories.map((story) => {
            const isBookmarked = bookmarkedIds.includes(story.id);

            return (
              <div
                key={story.id}
                className="group glass rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 flex flex-col hover:shadow-xl hover:-translate-y-1 relative"
              >
                {/* New Tag */}
                <div className="absolute top-3 left-3 z-10 bg-emerald-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full shadow-md tracking-wider">
                  🆕 नयाँ
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
                  
                  <span className="absolute bottom-2 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 backdrop-blur-md">
                    {story.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => onReadStory(story)}
                      className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {story.title}
                    </h3>
                    <p className="text-gray-300 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {story.snippet}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
                    <span className="flex items-center gap-1 text-gray-300">
                      <User className="w-3 h-3 text-emerald-400" />
                      <span className="truncate max-w-[100px]">{story.author}</span>
                    </span>

                    <button
                      onClick={() => onReadStory(story)}
                      className="text-emerald-300 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>कथा पढ्नुहोस्</span>
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
