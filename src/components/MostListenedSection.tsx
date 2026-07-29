import React from 'react';
import { Story } from '../types';
import { Headphones, Headphones as AudioIcon, Volume2, Heart, Play, Eye } from 'lucide-react';

interface MostListenedSectionProps {
  stories: Story[];
  bookmarkedIds: string[];
  onToggleBookmark: (story: Story) => void;
  onReadStory: (story: Story) => void;
}

export const MostListenedSection: React.FC<MostListenedSectionProps> = ({
  stories,
  bookmarkedIds,
  onToggleBookmark,
  onReadStory,
}) => {
  // Sort by views descending
  const mostListened = [...stories]
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  return (
    <section id="most-listened" className="px-5 py-10 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span>कोमल सङ्गीतमय वातावरण</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-2">
              ❤️ <span className="hero-title">सबैभन्दा धेरै पढिएका</span>
            </h2>
          </div>
          <p className="text-gray-300 text-xs md:text-sm max-w-md">
            हजारौँ पाठकहरूले कोमल पृष्ठभूमिका साथ बारम्बार पढेका लोकप्रिय कथाहरू।
          </p>
        </div>

        {/* Most Listened Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mostListened.map((story) => {
            const isBookmarked = bookmarkedIds.includes(story.id);

            return (
              <div
                key={story.id}
                className="group glass rounded-2xl overflow-hidden border border-amber-500/30 hover:border-amber-400 transition-all duration-300 flex flex-col hover:shadow-2xl hover:-translate-y-1 relative"
              >
                {/* Audio Badge */}
                <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/40 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-amber-400 animate-bounce" />
                  <span>{story.views.toLocaleString('ne-NP')} पटक सुनियो</span>
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

                {/* Image Cover with Overlay Play Button */}
                <div
                  className="relative h-48 overflow-hidden cursor-pointer"
                  onClick={() => onReadStory(story)}
                >
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  {/* Big Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-2xl group-hover:scale-115 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

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
                    <span className="flex items-center gap-1 text-amber-300">
                      <AudioIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>वाचन समय: {story.readTime}</span>
                    </span>

                    <button
                      onClick={() => onReadStory(story)}
                      className="px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-[11px]"
                    >
                      कथा पढ्नुहोस् 📖
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
