import React from 'react';
import { Story } from '../types';
import { X, Heart, Trash2, BookOpen } from 'lucide-react';

interface BookmarkListModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedStories: Story[];
  onReadStory: (story: Story) => void;
  onRemoveBookmark: (story: Story) => void;
}

export const BookmarkListModal: React.FC<BookmarkListModalProps> = ({
  isOpen,
  onClose,
  bookmarkedStories,
  onReadStory,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass max-w-xl w-full rounded-3xl p-6 relative border border-amber-500/30 my-auto shadow-2xl space-y-5">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-xl">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              तपाईंका मनपर्ने कथाहरू ({bookmarkedStories.length})
            </h2>
            <p className="text-xs text-gray-400">
              तपाईंले सुरक्षित गर्नुभएका सबै कथाहरू यहाँ पाउन सक्नुहुन्छ।
            </p>
          </div>
        </div>

        {/* LIST */}
        <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
          {bookmarkedStories.length > 0 ? (
            bookmarkedStories.map((story) => (
              <div
                key={story.id}
                className="p-3.5 rounded-2xl bg-black/30 border border-white/10 hover:border-amber-400/40 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                      {story.category}
                    </span>
                    <h4 className="font-bold text-sm text-white truncate mt-0.5">
                      {story.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 truncate">{story.snippet}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      onReadStory(story);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="पढ्नुहोस्"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveBookmark(story)}
                    className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 text-xs transition-colors cursor-pointer"
                    title="सूचीबाट हटाउनुहोस्"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-2">
              <span className="text-4xl">📖</span>
              <p className="text-sm font-semibold text-gray-300">कुनै पनि कथा थपिएको छैन!</p>
              <p className="text-xs text-gray-400">
                कथाको मुटु (❤️) आइकनमा थिचेर मनपर्ने सूचीमा राख्नुहोस्।
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
