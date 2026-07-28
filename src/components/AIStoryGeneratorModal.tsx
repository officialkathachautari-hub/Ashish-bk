import React, { useState, useEffect } from 'react';
import { Category, Story, AIStoryModalMode } from '../types';
import { X, Sparkles, BookOpen, Copy, Volume2, VolumeX, Check, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIStoryGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AIStoryModalMode;
  initialStory?: Story | null;
  onSaveNewStory: (story: Story) => void;
}

export const AIStoryGeneratorModal: React.FC<AIStoryGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'create',
  initialStory = null,
  onSaveNewStory,
}) => {
  const [mode, setMode] = useState<AIStoryModalMode>(initialMode);
  const [category, setCategory] = useState<Category>('लोककथा');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [errorText, setErrorText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    if (initialStory) {
      if (initialMode === 'continue') {
        setPrompt(`कथा: ${initialStory.title}`);
      }
    }
  }, [initialMode, initialStory, isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorText('');
    setGeneratedResult('');

    try {
      const res = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          category,
          mode,
          originalStory: initialStory ? `${initialStory.title}\n\n${initialStory.fullContent}` : '',
        }),
      });

      const data = await res.json();

      if (data.success && data.text) {
        setGeneratedResult(data.text);
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } else {
        setErrorText(data.error || 'कथा सिर्जना गर्न सकिएन।');
      }
    } catch (err: any) {
      setErrorText('सर्भरसँग सम्पर्क हुन सकेन। कृपया पुनः प्रयास गर्नुहोस्।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedResult && navigator.clipboard) {
      navigator.clipboard.writeText(generatedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('ब्राउजरमा भ्वाइस सुविधा उपलब्ध छैन।');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(generatedResult.slice(0, 800));
      utterance.lang = 'ne-NP';
      utterance.rate = 0.88;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleSaveToLibrary = () => {
    if (!generatedResult) return;

    const lines = generatedResult.split('\n').filter((l) => l.trim().length > 0);
    const title = lines[0]?.replace(/^#*\s*/, '') || 'AI द्वारा सिर्जित कथा';

    const newStory: Story = {
      id: 'ai-story-' + Date.now(),
      title,
      category,
      snippet: generatedResult.slice(0, 150) + '...',
      fullContent: generatedResult,
      moral: 'AI कथाकार द्वारा सिर्जित',
      coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
      author: 'Gemini AI कथाकार',
      readTime: '५ मिनेट',
      views: 120,
      likes: 45,
      date: 'आज',
      comments: [],
    };

    onSaveNewStory(newStory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass max-w-2xl w-full rounded-3xl p-6 md:p-8 relative border border-amber-500/30 my-auto shadow-2xl space-y-6">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-2xl shadow-lg">
            ✨
          </div>
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span>नेपाली AI कथाकार</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Gemini 3.6 Flash
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              आफ्नो कल्पना अनुसारको मौलिक नेपाली कथा, नैतिक शिक्षा वा निरन्तरता सिर्जना गर्नुहोस्।
            </p>
          </div>
        </div>

        {/* MODE SWITCHER */}
        <div className="flex p-1 rounded-2xl bg-black/40 border border-white/10 gap-1 text-xs font-bold">
          <button
            onClick={() => setMode('create')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'create' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            ✍️ नयाँ कथा लेख्नुहोस्
          </button>
          <button
            onClick={() => setMode('continue')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'continue' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            📖 कथा अगाडि बढाउनुहोस्
          </button>
          <button
            onClick={() => setMode('moral')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'moral' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            💡 नैतिक शिक्षा विश्लेषण
          </button>
        </div>

        {/* INPUT FORM */}
        <div className="space-y-4">
          {mode === 'create' && (
            <div>
              <label className="text-xs font-bold text-amber-300 mb-1.5 block">
                विधा (Category) छान्नुहोस्:
              </label>
              <div className="flex flex-wrap gap-2">
                {(['लोककथा', 'प्रेरणादायी', 'जीवनकथा', 'रहस्य', 'भावनात्मक', 'सत्यकथा'] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      category === cat
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                        : 'glass text-gray-300 border-white/10 hover:border-amber-400/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-amber-300 mb-1.5 block">
              {mode === 'create'
                ? 'कथाको विषय, पात्र वा भावना लेख्नुहोस्:'
                : mode === 'continue'
                ? 'कथालाई कुन मोडतर्फ लैजाने? (इच्छा भएमा लेख्नुहोस्):'
                : 'विश्लेषण गर्नुपर्ने विषय:'}
            </label>
            <textarea
              rows={3}
              placeholder={
                mode === 'create'
                  ? 'उदा: एउटा सोझो गाउँले केटो र उसको साहसी कुकुरको हिमाली यात्रा...'
                  : 'उदा: अचानक राति रहस्यमय उज्यालो देखा पर्यो...'
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-black text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>AI ले कथा कोर्दैछ... कृपया पर्खनुहोस्...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>
                  {mode === 'create'
                    ? '✨ कथा सिर्जना गर्नुहोस्'
                    : mode === 'continue'
                    ? '✨ कथा अगाडि बढाउनुहोस्'
                    : '✨ नैतिक शिक्षा विश्लेषण गर्नुहोस्'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* ERROR DISPLAY */}
        {errorText && (
          <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
            ⚠️ {errorText}
          </div>
        )}

        {/* GENERATED RESULT DISPLAY */}
        {generatedResult && (
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>AI द्वारा तयार गरिएको सामग्री:</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleSpeech}
                  className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-amber-300 text-xs flex items-center gap-1 border border-white/10"
                  title="सुन्नुहोस्"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-amber-300 text-xs flex items-center gap-1 border border-white/10"
                  title="कपी गर्नुहोस्"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto p-4 rounded-2xl bg-black/50 border border-amber-500/20 text-sm leading-relaxed whitespace-pre-line text-gray-200">
              {generatedResult}
            </div>

            {mode === 'create' && (
              <button
                onClick={handleSaveToLibrary}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📚 यो कथालाई संग्रहमा जोड्नुहोस्</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
