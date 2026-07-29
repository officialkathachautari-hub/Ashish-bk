import React, { useState, useEffect, useRef } from 'react';
import { Story, Comment, ReaderSettings, StoryReactions } from '../types';
import { X, Heart, Share2, Sparkles, Send, Star, BookOpen, Type, Palette, Check, UserCheck, MessageSquare, ExternalLink, Zap, Play, Pause, FastForward, Download, WifiOff, Volume2, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BackgroundMusicPlayer } from './BackgroundMusicPlayer';

interface StoryModalProps {
  story: Story | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (story: Story) => void;
  onAddComment: (storyId: string, comment: Comment) => void;
  onContinueWithAI: (story: Story) => void;
  onAnalyzeMoralWithAI: (story: Story) => void;
  isFollowingAuthor?: boolean;
  onToggleFollowAuthor?: (authorName: string) => void;
  onOpenDonateModal?: (authorName: string) => void;
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
  isFollowingAuthor = false,
  onToggleFollowAuthor,
  onOpenDonateModal,
}) => {
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

  // Ask AI State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingAI, setIsAskingAI] = useState(false);

  // Fast Scroll Reader State
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // 1: slow, 2: medium, 3: fast
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Offline Download & Audio Narration State
  const [isDownloadedOffline, setIsDownloadedOffline] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);

  // Multi-Emoji Reactions State
  const [localReactions, setLocalReactions] = useState<StoryReactions>({
    love: 12,
    clap: 8,
    fire: 15,
    wow: 5,
    sad: 3,
    thanks: 10,
  });

  useEffect(() => {
    if (!story) return;
    if (story.reactions) {
      setLocalReactions(story.reactions);
    } else {
      setLocalReactions({ love: 12, clap: 8, fire: 15, wow: 5, sad: 3, thanks: 10 });
    }
  }, [story]);

  const handleReaction = (key: keyof StoryReactions) => {
    setLocalReactions((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.8 },
    });
  };

  useEffect(() => {
    if (!story) return;
    const existing = localStorage.getItem('katha_offline_stories');
    if (existing) {
      try {
        const list: Story[] = JSON.parse(existing);
        setIsDownloadedOffline(list.some((s) => s.id === story.id));
      } catch (e) {}
    } else {
      setIsDownloadedOffline(false);
    }
  }, [story]);

  const handleToggleOfflineDownload = () => {
    if (!story) return;
    const existing = localStorage.getItem('katha_offline_stories');
    let list: Story[] = [];
    if (existing) {
      try { list = JSON.parse(existing); } catch (e) {}
    }

    if (isDownloadedOffline) {
      list = list.filter((s) => s.id !== story.id);
      setIsDownloadedOffline(false);
    } else {
      list.push(story);
      setIsDownloadedOffline(true);
    }
    localStorage.setItem('katha_offline_stories', JSON.stringify(list));
  };

  const handleToggleNarration = () => {
    if (!('speechSynthesis' in window) || !story) return;

    if (isPlayingNarration) {
      window.speechSynthesis.cancel();
      setIsPlayingNarration(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${story.title}। ${story.fullContent}`);
    utterance.rate = speechRate;
    utterance.lang = 'ne-NP';

    utterance.onend = () => {
      setIsPlayingNarration(false);
    };

    utterance.onerror = () => {
      setIsPlayingNarration(false);
    };

    // MediaSession API Background Controls
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: story.title,
        artist: `वाचन: ${story.author}`,
        album: 'कथा चौतारी - अडियो साहित्य',
        artwork: [
          { src: story.coverImage, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      try {
        navigator.mediaSession.setActionHandler('play', () => {
          window.speechSynthesis.resume();
          setIsPlayingNarration(true);
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          window.speechSynthesis.pause();
          setIsPlayingNarration(false);
        });
      } catch (e) {}
    }

    window.speechSynthesis.speak(utterance);
    setIsPlayingNarration(true);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [story]);

  // Fast Scroll Auto Reader Effect
  useEffect(() => {
    if (!isAutoScrolling || !modalContainerRef.current) return;

    const speeds: Record<number, number> = { 1: 1, 2: 2.5, 3: 5 };
    const step = speeds[scrollSpeed] || 2.5;

    const interval = setInterval(() => {
      if (modalContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = modalContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          setIsAutoScrolling(false); // Stop at bottom
        } else {
          modalContainerRef.current.scrollTop += step;
        }
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isAutoScrolling, scrollSpeed]);

  if (!isOpen || !story) return null;

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

  // Ask AI handler
  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAskingAI(true);
    setAiAnswer(null);

    setTimeout(() => {
      let mockReply = '';
      const q = aiQuestion.toLowerCase();
      if (q.includes('चरित्र') || q.includes('पात्र')) {
        mockReply = `यो कथामा मुख्य पात्रको भूमिका र उनीहरूको निर्णयले कथाको मुख्य मोड सिर्जना गर्दछ। उनीहरूले देखाएको धैर्य र चलाखी प्रशंसनीय छ।`;
      } else if (q.includes('शिक्षा') || q.includes('सन्देश')) {
        mockReply = `कथाले मुख्य रूपमा जीवनमा सत्य, ईमानदारी र धैर्यताको महत्त्वबारे गहिरो सन्देश दिन्छ।`;
      } else {
        mockReply = `यो कथा '${story.title}' नेपाली मौलिक परिवेशमा आधारित छ। यसले पाठकलाई ${story.category} विधाको सुन्दर र जीवन्त अनुभूति प्रदान गर्दछ।`;
      }
      setAiAnswer(mockReply);
      setIsAskingAI(false);
    }, 1200);
  };

  // Share story with URL / deep link
  const handleShare = async (platform?: 'fb' | 'wa') => {
    const url = new URL(window.location.href);
    url.searchParams.set('story', story.id);
    const shareUrl = url.toString();

    if (platform === 'wa') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`कथा चौतारी - ${story.title}\n${shareUrl}`)}`, '_blank');
      return;
    }

    if (platform === 'fb') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      return;
    }

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
      } catch (e) {}
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      } catch (err) {}
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

  const fontSizes = {
    sm: 'text-sm md:text-base leading-relaxed',
    md: 'text-base md:text-lg leading-relaxed',
    lg: 'text-lg md:text-xl leading-loose',
    xl: 'text-xl md:text-2xl leading-loose',
  };

  const themeStyles = {
    dark: 'bg-[#0f172a] text-slate-100 border-slate-800',
    light: 'bg-[#fdfbf7] text-gray-900 border-amber-200/60',
    sepia: 'bg-[#f4ebd9] text-[#433422] border-[#d8c3a5]',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-fadeIn">
      
      {/* MODAL CONTAINER */}
      <div
        ref={modalContainerRef}
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
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {story.category}
            </span>
            {story.isSponsored && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                💰 प्रायोजित ({story.sponsorName || 'Sponsor'})
              </span>
            )}
          </div>

          {/* READER PREFERENCES & FAST AUTO-SCROLL BAR */}
          <div className="flex flex-wrap items-center gap-2 bg-black/20 p-1.5 rounded-full border border-gray-500/20">
            
            {/* FAST SCROLL READER BUTTON */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
              <button
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className={`p-1.5 rounded-full font-bold text-xs flex items-center gap-1 cursor-pointer transition-all ${
                  isAutoScrolling
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-white/10 text-amber-300 hover:bg-white/20'
                }`}
                title="अटो-स्क्रोल रिडर"
              >
                {isAutoScrolling ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
                <span className="text-[11px] font-extrabold">{isAutoScrolling ? 'रोक्नुहोस्' : 'फास्ट स्क्रोल'}</span>
              </button>

              {/* Speed Buttons for Auto Scroll */}
              {isAutoScrolling && (
                <div className="flex items-center gap-1 border-l border-amber-500/30 pl-1.5 animate-fadeIn">
                  {[1, 2, 3].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setScrollSpeed(sp)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                        scrollSpeed === sp
                          ? 'bg-amber-400 text-black font-extrabold'
                          : 'text-amber-200/80 hover:text-white'
                      }`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
              )}
            </div>

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
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-amber-300 font-semibold">लेखक: {story.author}</p>
                {onToggleFollowAuthor && (
                  <button
                    onClick={() => onToggleFollowAuthor(story.author)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                      isFollowingAuthor
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500 text-black border-amber-400'
                    }`}
                  >
                    {isFollowingAuthor ? '✓ Followed' : '+ Follow Author'}
                  </button>
                )}
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-1">{story.title}</h2>
            </div>

            {/* DONATE TO AUTHOR BUTTON */}
            {onOpenDonateModal && (
              <button
                onClick={() => onOpenDonateModal(story.author)}
                className="px-3 py-1.5 rounded-full bg-rose-500/80 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow-lg cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>लेखकलाई सहयोग</span>
              </button>
            )}
          </div>
        </div>

        {/* ACTIONS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 mb-3 px-1">
          <div className="text-xs text-amber-300 font-semibold flex items-center gap-2">
            <span>📖 वाचन समय: {story.readTime}</span>
            <span>• ⭐ {story.averageRating || 5.0} ({story.totalRatings || 1})</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* AUDIO NARRATION BUTTON */}
            <button
              onClick={handleToggleNarration}
              className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isPlayingNarration
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              }`}
              title="अडियो कथा सुन्नुहोस् (Background Playback Available)"
            >
              {isPlayingNarration ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPlayingNarration ? 'रोक्नुहोस्' : 'अडियो सुन्नुहोस्'}</span>
            </button>

            {/* OFFLINE DOWNLOAD BUTTON */}
            <button
              onClick={handleToggleOfflineDownload}
              className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isDownloadedOffline
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/30'
              }`}
              title="इन्टरनेट बिना पढ्नका लागि डाउनलोड गर्नुहोस्"
            >
              {isDownloadedOffline ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-sky-400" />}
              <span>{isDownloadedOffline ? 'अफलाइन सेभ भयो' : 'अफलाइन डाउनलोड'}</span>
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={() => handleShare('wa')}
              className="p-2 rounded-full bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 cursor-pointer text-xs font-bold"
              title="WhatsApp मा शेयर गर्नुहोस्"
            >
              💬 WA
            </button>

            {/* Facebook Share */}
            <button
              onClick={() => handleShare('fb')}
              className="p-2 rounded-full bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 cursor-pointer text-xs font-bold"
              title="Facebook मा शेयर गर्नुहोस्"
            >
              f FB
            </button>

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
              onClick={() => handleShare()}
              className="px-3.5 py-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer relative flex items-center gap-1.5 text-xs font-bold shadow-sm"
            >
              {copiedToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
              <span>{copiedToast ? 'कपी भयो!' : 'लिङ्क कपी'}</span>
            </button>
          </div>
        </div>

        {/* SOFT BACKGROUND MUSIC PLAYER */}
        <div className="mb-6">
          <BackgroundMusicPlayer key={story.id} />
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

        {/* ASK AI ABOUT STORY SECTION */}
        <div className="mt-8 p-5 rounded-2xl bg-black/30 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
            <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
              🤖 कथाबारे AI सँग प्रश्न सोध्नुहोस् (Ask AI)
            </h4>
          </div>

          <form onSubmit={handleAskAI} className="flex gap-2">
            <input
              type="text"
              placeholder="उदा. यो कथाको मुख्य पात्रबारे भन्नुहोस्..."
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isAskingAI}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
            >
              {isAskingAI ? 'सोध्दै...' : 'सोध्नुहोस्'}
            </button>
          </form>

          {aiAnswer && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed animate-fadeIn">
              <span className="font-bold text-amber-300">🤖 AI उत्तर:</span> {aiAnswer}
            </div>
          )}
        </div>

        {/* AI ACTIONS */}
        <div className="mt-6 p-4 rounded-2xl bg-black/20 border border-gray-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1 justify-center sm:justify-start">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI कथाकार विस्तार:</span>
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

        {/* MULTI-EMOJI REACTIONS BAR */}
        <div className="mt-8 p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-2">
          <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>✨</span> कथामा प्रतिक्रिया दिनुहोस् (Reactions)
          </h4>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => handleReaction('love')}
              className="px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/40 text-xs font-bold text-rose-200 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-sm"
            >
              <span>💖</span> <span>प्रेम ({localReactions.love})</span>
            </button>
            <button
              onClick={() => handleReaction('clap')}
              className="px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/40 text-xs font-bold text-amber-200 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-sm"
            >
              <span>👏</span> <span>ताली ({localReactions.clap})</span>
            </button>
            <button
              onClick={() => handleReaction('fire')}
              className="px-3 py-1.5 rounded-full bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/40 text-xs font-bold text-orange-200 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-sm"
            >
              <span>🔥</span> <span>उत्कृष्ट ({localReactions.fire})</span>
            </button>
            <button
              onClick={() => handleReaction('wow')}
              className="px-3 py-1.5 rounded-full bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/40 text-xs font-bold text-blue-200 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-sm"
            >
              <span>😮</span> <span>अचम्म ({localReactions.wow})</span>
            </button>
            <button
              onClick={() => handleReaction('sad')}
              className="px-3 py-1.5 rounded-full bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/40 text-xs font-bold text-purple-200 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-sm"
            >
              <span>😢</span> <span>भावुक ({localReactions.sad})</span>
            </button>
            <button
              onClick={() => handleReaction('thanks')}
              className="px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/40 text-xs font-bold text-emerald-200 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-sm"
            >
              <span>🙏</span> <span>धन्यवाद ({localReactions.thanks})</span>
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
