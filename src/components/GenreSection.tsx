import React from 'react';
import { Category, Story } from '../types';
import { Headphones, Sparkles, BookOpen } from 'lucide-react';

interface GenreSectionProps {
  stories: Story[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

interface GenreMeta {
  name: Category;
  emoji: string;
  description: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
}

const GENRE_LIST: GenreMeta[] = [
  {
    name: 'रहस्य',
    emoji: '🔍',
    description: 'रहस्यमयी घटना, डर र कौतुहलताले भरिएका पानाहरू',
    bgGradient: 'from-purple-900/40 to-indigo-950/60',
    borderColor: 'border-purple-500/30 hover:border-purple-400',
    textColor: 'text-purple-300',
  },
  {
    name: 'प्रेम',
    emoji: '❤️',
    description: 'निश्चल माया, समर्पण र भावनाले भिजेका सुन्दर कथाहरू',
    bgGradient: 'from-rose-900/40 to-pink-950/60',
    borderColor: 'border-rose-500/30 hover:border-rose-400',
    textColor: 'text-rose-300',
  },
  {
    name: 'दुःख',
    emoji: '💧',
    description: 'जीवनका सङ्घर्ष, आँसु र कारुणिक यथार्थका पानाहरू',
    bgGradient: 'from-blue-900/40 to-slate-950/60',
    borderColor: 'border-blue-500/30 hover:border-blue-400',
    textColor: 'text-blue-300',
  },
  {
    name: 'लोककथा',
    emoji: '🌿',
    description: 'पुर्खादेखि चली आएका मौलिक पौराणिक र गाउँले कथा',
    bgGradient: 'from-amber-900/40 to-emerald-950/60',
    borderColor: 'border-amber-500/30 hover:border-amber-400',
    textColor: 'text-amber-300',
  },
  {
    name: 'प्रेरणादायी',
    emoji: '💡',
    description: 'जीवनमा अघि बढ्ने ऊर्जा र असम्भवलाई सम्भव बनाउने यात्रा',
    bgGradient: 'from-yellow-900/40 to-amber-950/60',
    borderColor: 'border-yellow-500/30 hover:border-yellow-400',
    textColor: 'text-yellow-300',
  },
  {
    name: 'जीवनकथा',
    emoji: '🏡',
    description: 'गाउँघरका याद, बाल्यकाल र जीवनका भोगाइहरू',
    bgGradient: 'from-emerald-900/40 to-teal-950/60',
    borderColor: 'border-emerald-500/30 hover:border-emerald-400',
    textColor: 'text-emerald-300',
  },
  {
    name: 'भावनात्मक',
    emoji: '🎭',
    description: 'आमाको माया, पारिवारिक सम्बन्ध र आत्मीय भावना',
    bgGradient: 'from-pink-900/40 to-rose-950/60',
    borderColor: 'border-pink-500/30 hover:border-pink-400',
    textColor: 'text-pink-300',
  },
  {
    name: 'सत्यकथा',
    emoji: '⚖️',
    description: 'समाजका वास्तविक यथार्थ, सत्य र न्यायको लडाइँ',
    bgGradient: 'from-cyan-900/40 to-blue-950/60',
    borderColor: 'border-cyan-500/30 hover:border-cyan-400',
    textColor: 'text-cyan-300',
  },
];

export const GenreSection: React.FC<GenreSectionProps> = ({
  stories,
  selectedCategory,
  onSelectCategory,
}) => {
  const getCategoryCount = (catName: Category) => {
    return stories.filter((s) => s.category === catName).length;
  };

  const handleGenreClick = (catName: Category) => {
    onSelectCategory(catName);
    const storiesEl = document.getElementById('stories');
    if (storiesEl) {
      storiesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="genres" className="px-5 py-10 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold mb-2">
              <Headphones className="w-3.5 h-3.5 text-purple-400" />
              <span>विधा छनोट</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-2">
              🎧 <span className="hero-title">Genre (विधा) अनुसार</span>
            </h2>
          </div>
          <p className="text-gray-300 text-xs md:text-sm max-w-md">
            आफ्नो मनपर्ने विधा रोजेर कथाको विविधिता र सुन्दरता महसुस गर्नुहोस्।
          </p>
        </div>

        {/* Genre Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GENRE_LIST.map((genre) => {
            const count = getCategoryCount(genre.name);
            const isSelected = selectedCategory === genre.name;

            return (
              <div
                key={genre.name}
                onClick={() => handleGenreClick(genre.name)}
                className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-300 bg-gradient-to-br ${genre.bgGradient} ${genre.borderColor} relative overflow-hidden flex flex-col justify-between hover:scale-[1.03] hover:shadow-2xl ${
                  isSelected ? 'ring-2 ring-amber-400 border-amber-400 shadow-xl scale-[1.02]' : ''
                }`}
              >
                {/* Background glow effect */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all" />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                      {genre.emoji}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/40 text-gray-300 border border-white/10 backdrop-blur-md">
                      {count} कथाहरू
                    </span>
                  </div>

                  <h3 className={`text-xl font-black mt-3 ${genre.textColor}`}>
                    {genre.name}
                  </h3>

                  <p className="text-gray-300 text-xs mt-1.5 leading-relaxed line-clamp-2">
                    {genre.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-gray-300 group-hover:text-amber-300">
                  <span>कथाहरू हेर्नुहोस्</span>
                  <BookOpen className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
