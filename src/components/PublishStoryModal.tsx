import React, { useState } from 'react';
import { X, Send, Image, BookOpen, Sparkles, Award, Check } from 'lucide-react';
import { Category, Story } from '../types';
import confetti from 'canvas-confetti';

interface PublishStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishStory: (newStory: Story) => void;
  contestId?: string;
}

const PRESET_COVERS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop', label: 'पुरानो किताब र चौतारी' },
  { id: '2', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop', label: 'पहाडी साया र साझ' },
  { id: '3', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop', label: 'रहस्यमयी जङ्गल' },
  { id: '4', url: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=800&auto=format&fit=crop', label: 'भावुक यात्रा' },
  { id: '5', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop', label: 'प्राकृतिक सौन्दर्य' },
];

export const PublishStoryModal: React.FC<PublishStoryModalProps> = ({
  isOpen,
  onClose,
  onPublishStory,
  contestId,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('लोककथा');
  const [author, setAuthor] = useState('');
  const [snippet, setSnippet] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [moral, setMoral] = useState('');
  const [selectedCover, setSelectedCover] = useState(PRESET_COVERS[0].url);
  const [customCover, setCustomCover] = useState('');
  const [isSubmittingContest, setIsSubmittingContest] = useState(!!contestId);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fullContent.trim() || !author.trim()) return;

    const readMinutes = Math.max(2, Math.ceil(fullContent.split(' ').length / 80));

    const newStory: Story = {
      id: `user_pub_${Date.now()}`,
      title: title.trim(),
      category,
      author: author.trim(),
      snippet: snippet.trim() || fullContent.slice(0, 120) + '...',
      fullContent: fullContent.trim(),
      moral: moral.trim() || undefined,
      coverImage: customCover.trim() || selectedCover,
      readTime: `${readMinutes} मिनेट`,
      views: 1,
      likes: 1,
      averageRating: 5.0,
      totalRatings: 1,
      date: 'अहिले भर्खरै',
      isUserPublished: true,
      contestId: isSubmittingContest ? 'contest_2026_01' : undefined,
      contestVotes: isSubmittingContest ? 1 : 0,
      comments: [
        {
          id: `c_${Date.now()}`,
          userName: 'कथा चौतारी सम्पादक',
          text: 'तपाईंको नयाँ कथा चौतारी मञ्चमा सफलतापूर्वक प्रकाशित भएको छ। हार्दिक बधाई!',
          date: 'अहिले भर्खरै',
          rating: 5,
        },
      ],
      reactions: {
        love: 1,
        clap: 1,
        fire: 1,
        wow: 0,
        sad: 0,
        thanks: 1,
      },
    };

    onPublishStory(newStory);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/80 border border-amber-500/40 rounded-3xl shadow-2xl p-6 relative space-y-5 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-black text-2xl font-bold shadow-lg">
            ✍️
          </div>
          <div>
            <h3 className="text-xl font-black text-white">आफ्नै नेपाली कथा प्रकाशित गर्नुहोस्</h3>
            <p className="text-xs text-amber-300 font-semibold">
              कथा चौतारीका हजारौँ पाठकहरूमाझ आफ्ना भावना र रचना बाँड्नुहोस्
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CONTEST BANNER TOGGLE */}
          <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400 animate-bounce" />
              <div>
                <h4 className="text-xs font-black text-white">साप्ताहिक कथा प्रतियोगितामा भाग लिने?</h4>
                <p className="text-[11px] text-rose-200">अङ्क ४: 'स्मृति र हिमाल' (पुरस्कार रु. २,००० + विशेष ब्याज)</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSubmittingContest(!isSubmittingContest)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                isSubmittingContest
                  ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-md'
                  : 'bg-black/40 text-gray-300 border-white/20'
              }`}
            >
              {isSubmittingContest ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isSubmittingContest ? 'प्रतियोगितामा शामिल' : 'शामिल हुनुहोस्'}</span>
            </button>
          </div>

          {/* TITLE & AUTHOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-amber-300 mb-1">
                कथाको शीर्षक (Title) *
              </label>
              <input
                type="text"
                placeholder="उदा. गाउँको पुरानो चौतारी..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-amber-300 mb-1">
                लेखकको नाम (Author Name) *
              </label>
              <input
                type="text"
                placeholder="उदा. प्रशान्त श्रेष्ठ..."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* CATEGORY & MORAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-amber-300 mb-1">
                विधा (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-amber-400"
              >
                <option value="लोककथा">लोककथा</option>
                <option value="प्रेरणादायी">प्रेरणादायी</option>
                <option value="जीवनकथा">जीवनकथा</option>
                <option value="रहस्य">रहस्य</option>
                <option value="भावनात्मक">भावनात्मक</option>
                <option value="सत्यकथा">सत्यकथा</option>
                <option value="प्रेम">प्रेम</option>
                <option value="दुःख">दुःख</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-amber-300 mb-1">
                नैतिक शिक्षा / मुख्य सन्देश (Moral Lesson)
              </label>
              <input
                type="text"
                placeholder="उदा. सत्य र समर्पण नै जीवनका सच्चा मार्ग हुन्..."
                value={moral}
                onChange={(e) => setMoral(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* COVER IMAGE PRESET SELECTOR */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-amber-300">
              कभर फोटो (Choose Cover Image)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COVERS.map((cov) => (
                <button
                  key={cov.id}
                  type="button"
                  onClick={() => {
                    setSelectedCover(cov.url);
                    setCustomCover('');
                  }}
                  className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all cursor-pointer ${
                    selectedCover === cov.url && !customCover
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={cov.url} alt={cov.label} className="w-full h-full object-cover" />
                  {selectedCover === cov.url && !customCover && (
                    <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-amber-300 font-bold" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="अथवा आफ्नै कभर फोटो URL राख्नुहोस्..."
              value={customCover}
              onChange={(e) => setCustomCover(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-[11px] outline-none focus:border-amber-400 mt-1"
            />
          </div>

          {/* SHORT SNIPPET */}
          <div>
            <label className="block text-xs font-extrabold text-amber-300 mb-1">
              छोटो सारांश (Short Snippet)
            </label>
            <input
              type="text"
              placeholder="कथाको मुख्य आकर्षण १-२ वाक्यमा..."
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-amber-400"
            />
          </div>

          {/* FULL STORY CONTENT */}
          <div>
            <label className="block text-xs font-extrabold text-amber-300 mb-1">
              पूरा कथा (Full Story Content) *
            </label>
            <textarea
              rows={7}
              placeholder="यहाँ आफ्नो मौलिक कथा स्पष्ट र मीठो नेपाली भाषामा लेख्नुहोस्..."
              value={fullContent}
              onChange={(e) => setFullContent(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-amber-400 resize-none leading-relaxed"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-black text-xs shadow-xl cursor-pointer transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 fill-current text-slate-950" />
            <span>कथा चौतारीमा कथा Publish गर्नुहोस्</span>
          </button>
        </form>

      </div>
    </div>
  );
};
