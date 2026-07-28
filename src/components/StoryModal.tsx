import React, { useState, useEffect } from 'react';
import { Story, Comment, ReaderSettings } from '../types';
import { X, Heart, Volume2, VolumeX, Share2, Sparkles, Send, Star, BookOpen, Type, Palette, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoryModalProps {
  story: Story | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (story: Story) => void;
  onAddComment: (storyId: string, comment: Comment) => void;
  onContinueWithAI: (story: Story) => void;
  onAnalyzeMoralWithAI: (story: Story) => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  story,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onAddComment,
  onContinueWithAI,
  onAnalyzeMoralWithAI,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>({
    fontSize: 'md',
    theme: 'dark',
    lineSpacing: 'relaxed',
  });

  // Comment Form State
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    // Reset audio on modal change
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    };
  }, [story]);

  if (!isOpen || !story) return null;

  // Toggle Speech Synthesis
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('तपाईंको ब्राउजरमा भ्वाइस नरेसन उपलब्ध छैन।');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${story.title}। ${story.fullContent}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'ne-NP';
      utterance.rate = 0.88;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Submit Comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userName: newCommentName.trim() || 'पाठक',
      text: newCommentText.trim(),
      date: 'भर्खरै',
      rating: newCommentRating,
    };

    onAddComment(story.id, comment);
    setNewCommentText('');
    setNewCommentName('');
  };

  // Share story with URL / deep link
  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('story', story.id);
    const shareUrl = url.toString();

    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: `कथा चौतारी - ${story.title}\n${story.snippet}`,
          url: shareUrl,
        });
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
        return;
      } catch (e) {
        // Fallback to clipboard if share cancelled or unavailable
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      } catch (err) {
        console.error('Failed to copy link', err);
      }
    }
  };

  // Handle Favorite with confetti
  const handleFavoriteClick = () => {
    onToggleBookmark(story);
    if (!isBookmarked) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  // Reader Font Size Class
  const fontSizes = {
    sm: 'text-sm md:text-base leading-relaxed',
    md: 'text-base md:text-lg leading-relaxed',
    lg: 'text-lg md:text-xl leading-loose',
    xl: 'text-xl md:text-2xl leading-loose',
  };

  // Reader Theme Styles
  const themeStyles = {
    dark: 'bg-[#0f172a] text-slate-100 border-slate-800',
    light: 'bg-[#fdfbf7] text-gray-900 border-amber-200/60',
    sepia: 'bg-[#f4ebd9] text-[#433422] border-[#d8c3a5]',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-fadeIn">
      
      {/* MODAL CONTAINER */}
      <div
        className={`max-w-3xl w-full rounded-3xl p-5 md:p-8 relative shadow-2xl transition-colors duration-300 border ${themeStyles[readerSettings.theme]} my-auto max-h-[90vh] overflow-y-auto`}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-black/20 hover:bg-black/40 text-gray-300 hover:text-white transition-all cursor-pointer z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gray-500/20 pr-10">
          
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            {story.category}
          </span>

          {/* READER PREFERENCES BAR */}
          <div className="flex items-center gap-2 bg-black/10 p-1.5 rounded-full border border-gray-500/20">
            {/* Font Size Selector */}
            <div className="flex items-center gap-1 px-2 border-r border-gray-500/20">
              <Type className="w-3.5 h-3.5 opacity-60" />
              <button
                onClick={() => setReaderSettings((s) => ({ ...s, fontSize: 'sm' }))}
                className={`px-1.5 py-0.5 text-xs rounded ${readerSettings.fontSize === 'sm' ? 'bg-amber-500 text-black font-bold' : 'opacity-70'}`}
              >
                अ
              </button>
              <button
                onClick={() => setReaderSettings((s) => ({ ...s, fontSize: 'md' }))}
                className={`px-1.5 py-0.5 text-sm rounded ${readerSettings.fontSize === 'md' ? 'bg-amber-500 text-black font-bold' : 'opacity-70'}`}
              >
                अ
              </button>
              <button
                onClick={() => setReaderSettings((s) => ({ ...s, fontSize: 'lg' }))}
                className={`px-1.5 py-0.5 text-base rounded ${readerSettings.fontSize === 'lg' ? 'bg-amber-500 text-black font-bold' : 'opacity-70'}`}
              >
                अ
              </button>
            </div>

            {/* Reader Theme Switcher */}
            <div className="flex items-center gap-1.5 px-2">
              <Palette className="w-3.5 h-3.5 opacity-60" />
              <button
                onClick={() => setReaderSettings((s) => ({ ...s, theme: 'dark' }))}
                className={`w-4 h-4 rounded-full bg-slate-900 border ${readerSettings.theme === 'dark' ? 'ring-2 ring-amber-400' : ''}`}
                title="अँध्यारो"
              />
              <button
                onClick={() => setReaderSettings((s) => ({ ...s, theme: 'sepia' }))}
                className={`w-4 h-4 rounded-full bg-[#f4ebd9] border ${readerSettings.theme === 'sepia' ? 'ring-2 ring-amber-500' : ''}`}
                title="सेपिया"
              />
              <button
                onClick={() => setReaderSettings((s) => ({ ...s, theme: 'light' }))}
                className={`w-4 h-4 rounded-full bg-white border ${readerSettings.theme === 'light' ? 'ring-2 ring-amber-500' : ''}`}
                title="उज्यालो"
              />
            </div>
          </div>

        </div>

        {/* STORY COVER IMAGE */}
        <div className="mt-6 rounded-2xl overflow-hidden h-56 md:h-72 relative">
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div>
              <p className="text-xs text-amber-300 font-semibold">लेखक: {story.author}</p>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-1">{story.title}</h2>
            </div>
          </div>
        </div>

        {/* TOP TOOLBAR (AUDIO, FAVORITE, SHARE) */}
        <div className="flex flex-wrap items-center justify-between gap-3 my-6 py-3 px-4 rounded-2xl bg-black/10 border border-gray-500/20">
          <button
            onClick={handleToggleAudio}
            className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-rose-500 text-white animate-pulse shadow-md'
                : 'bg-amber-500 text-black hover:bg-amber-400'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? 'अडियो नरेसन रोक्नुहोस्' : '🔊 कथा वाचन सुन्नुहोस्'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-black/20 text-gray-300 border-gray-500/30 hover:text-rose-400'
              }`}
              title="मनपर्नेमा राख्नुहोस्"
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer relative flex items-center gap-1.5 text-xs font-bold shadow-sm"
              title="कथाको लिङ्क शेयर वा कपी गर्नुहोस्"
            >
              {copiedToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
              <span>{copiedToast ? 'कपी भयो!' : 'शेयर गर्नुहोस्'}</span>
              {copiedToast && (
                <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] px-3 py-1 rounded-full shadow-xl whitespace-nowrap border border-emerald-400/40 z-30 font-semibold animate-fadeIn">
                  ✓ कथाको लिङ्क क्लिपबोर्डमा कपी भयो!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* FULL STORY TEXT */}
        <div className={`space-y-4 font-normal whitespace-pre-line ${fontSizes[readerSettings.fontSize]}`}>
          {story.fullContent}
        </div>

        {/* MORAL BOX */}
        {story.moral && (
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/15 border border-amber-500/30">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-1">
              <span>💡</span> कथाको नैतिक शिक्षा (Moral Lesson):
            </h4>
            <p className="text-sm md:text-base font-semibold text-amber-200 italic">
              "{story.moral}"
            </p>
          </div>
        )}

        {/* AI ACTIONS */}
        <div className="mt-8 p-4 rounded-2xl bg-black/20 border border-gray-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1 justify-center sm:justify-start">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI कथाकार सुविधा:</span>
            </h5>
            <p className="text-xs opacity-75">यो कथालाई AI मार्फत अगाडि बढाउनुहोस् वा विश्लेषण गर्नुहोस्।</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => onContinueWithAI(story)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-transform cursor-pointer"
            >
              कथा अगाडि बढाउनुहोस्
            </button>

            <button
              onClick={() => onAnalyzeMoralWithAI(story)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-full border border-amber-500/40 hover:bg-amber-500/20 text-amber-300 font-bold text-xs transition-colors cursor-pointer"
            >
              नैतिक विश्लेषण
            </button>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="mt-10 pt-8 border-t border-gray-500/20 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>💬</span> पाठकीय प्रतिक्रियाहरू ({story.comments?.length || 0})
          </h3>

          {/* ADD COMMENT FORM */}
          <form onSubmit={handleSubmitComment} className="p-4 rounded-2xl bg-black/20 border border-gray-500/20 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="तपाईंको नाम (ऐच्छिक)..."
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                className="px-4 py-2 rounded-xl bg-black/30 border border-gray-500/30 text-sm outline-none focus:border-amber-400 flex-1"
              />

              {/* Star Rating Select */}
              <div className="flex items-center gap-1 bg-black/30 px-3 py-2 rounded-xl border border-gray-500/30">
                <span className="text-xs opacity-75 mr-1">मूल्याङ्कन:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewCommentRating(star)}
                    className="cursor-pointer text-amber-400"
                  >
                    <Star className={`w-4 h-4 ${star <= newCommentRating ? 'fill-current' : 'opacity-30'}`} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="यो कथा पढेर तपाईंलाई कस्तो लाग्यो? कमेन्ट लेख्नुहोस्..."
              rows={3}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-black/30 border border-gray-500/30 text-sm outline-none focus:border-amber-400 resize-none"
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>कमेन्ट पठाउनुहोस्</span>
              </button>
            </div>
          </form>

          {/* COMMENTS LIST */}
          <div className="space-y-3">
            {story.comments && story.comments.length > 0 ? (
              story.comments.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-black/10 border border-gray-500/10 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-300">{c.userName}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {Array.from({ length: c.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="opacity-50">{c.date}</span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm opacity-90 leading-relaxed">{c.text}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-center opacity-60 py-4">पहिलो कमेन्ट गर्ने अवसर नलिनुहोस्!</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
