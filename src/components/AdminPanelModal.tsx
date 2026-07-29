import React, { useState } from 'react';
import { Story, Category } from '../types';
import { X, Plus, BookOpen, BarChart3, Users, Tags, Upload, Sparkles, Check, Trash2, Eye, Heart, Lock, Key, ShieldAlert } from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  stories: Story[];
  onAddNewStory: (newStory: Story) => void;
  onDeleteStory: (storyId: string) => void;
  onAddCategory: (categoryName: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  categories,
  stories,
  onAddNewStory,
  onDeleteStory,
  onAddCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'add_story' | 'categories' | 'analytics' | 'users'>('add_story');

  // PIN Protection State (Default lock code: 0000)
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  // New Story Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('लोककथा');
  const [author, setAuthor] = useState('');
  const [readTime, setReadTime] = useState('५ मिनेट');
  const [snippet, setSnippet] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [moral, setMoral] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsorName, setSponsorName] = useState('');

  // New Category Input
  const [newCategoryName, setNewCategoryName] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setIsUnlocked(false);
    setPinInput('');
    setPinError(false);
    onClose();
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '0000') {
      setIsUnlocked(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // Lock screen if not unlocked
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 relative space-y-5 text-center">
          
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-3xl shadow-lg">
            🔐
          </div>

          <div>
            <h3 className="text-xl font-black text-white">डेभलपर / एडमिन सुरक्षा लक</h3>
            <p className="text-xs text-gray-300 mt-1">
              प्रशासक प्यानल खोल्न ४ अंकको PIN प्रविष्ट गर्नुहोस्।
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-4 pt-2">
            <div>
              <input
                type="password"
                maxLength={6}
                required
                autoFocus
                placeholder="पिन कोड (PIN)..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full text-center text-2xl tracking-[0.5em] font-mono py-3 rounded-2xl bg-black/60 border text-white outline-none focus:ring-2 transition-all ${
                  pinError
                    ? 'border-rose-500 focus:ring-rose-500/50'
                    : 'border-amber-500/30 focus:border-amber-400 focus:ring-amber-400/30'
                }`}
              />
              {pinError && (
                <p className="text-xs text-rose-400 font-bold mt-2 flex items-center justify-center gap-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>गलत पिन कोड! कृपया सही PIN प्रविष्ट गर्नुहोस्।</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-extrabold text-xs shadow-xl cursor-pointer transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>प्यानल अनलक गर्नुहोस् (Unlock)</span>
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>सुरक्षित एडमिन पहुँच</span>
          </div>

        </div>
      </div>
    );
  }

  const handleSubmitNewStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fullContent || !author) return;

    const createdStory: Story = {
      id: `admin-story-${Date.now()}`,
      title,
      category,
      author,
      readTime,
      snippet: snippet || fullContent.substring(0, 120) + '...',
      fullContent,
      moral: moral || undefined,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000',
      views: 1,
      likes: 0,
      averageRating: 5.0,
      totalRatings: 1,
      isSponsored,
      sponsorName: isSponsored ? sponsorName : undefined,
      date: new Date().toLocaleDateString('ne-NP', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    onAddNewStory(createdStory);

    // Reset Form
    setTitle('');
    setAuthor('');
    setSnippet('');
    setFullContent('');
    setMoral('');
    setCoverImage('');
    setIsSponsored(false);
    setSponsorName('');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
  };

  // Compute analytics
  const totalViews = stories.reduce((acc, s) => acc + s.views, 0);
  const totalLikes = stories.reduce((acc, s) => acc + s.likes, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* ADMIN HEADER */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
              🛠️
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>प्रशासक प्यानल (Admin Dashboard)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  ✓ एडमिन पहुँच
                </span>
              </h3>
              <p className="text-xs text-gray-400">कथाहरू, विधा, एनालिटिक्स र प्रयोगकर्ता व्यवस्थापन गर्नुहोस्</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full glass hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-white/10 bg-black/20 px-5 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('add_story')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'add_story'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>नयाँ कथा अपलोड</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Tags className="w-4 h-4 text-sky-400" />
            <span>Category व्यवस्थापन ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>एनालिटिक्स (Analytics)</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-rose-400" />
            <span>प्रयोगकर्ता व्यवस्थापन</span>
          </button>
        </div>

        {/* TAB BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: ADD STORY FORM */}
          {activeTab === 'add_story' && (
            <form onSubmit={handleSubmitNewStory} className="space-y-4 animate-fadeIn">
              <div className="grid md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">कथाको शीर्षक (Title):</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. सुनौलो मयूर र किसान"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">विधा (Category):</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
                  >
                    {categories.filter(c => c !== 'सबै').map((c) => (
                      <option key={c} value={c} className="bg-slate-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">लेखक (Author):</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. बालकृष्ण सम"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">पठन समय (Read Time):</label>
                  <input
                    type="text"
                    placeholder="उदा. ५ मिनेट"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">कभर फोटो URL (Cover Image):</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">संक्षिप्त विवरण (Snippet):</label>
                <textarea
                  rows={2}
                  placeholder="कथाको छोटो सार..."
                  value={snippet}
                  onChange={(e) => setSnippet(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">पूर्ण कथा सामग्री (Full Content):</label>
                <textarea
                  rows={6}
                  required
                  placeholder="कथाको पूर्ण पाठ यहाँ लेख्नुहोस्..."
                  value={fullContent}
                  onChange={(e) => setFullContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-amber-400 font-sans leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">💡 कथाको नैतिक सन्देश (Moral):</label>
                <input
                  type="text"
                  placeholder="उदा. सत्यको सधैँ जित हुन्छ।"
                  value={moral}
                  onChange={(e) => setMoral(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-amber-500/30 text-amber-200 text-xs outline-none focus:border-amber-400"
                />
              </div>

              {/* SPONSORED TOGGLE */}
              <div className="p-3 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 font-bold">
                  <input
                    type="checkbox"
                    checked={isSponsored}
                    onChange={(e) => setIsSponsored(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <span>💰 यो प्रायोजित कथा (Sponsored Story) हो?</span>
                </label>

                {isSponsored && (
                  <input
                    type="text"
                    placeholder="प्रायोजक नाम (Sponsor Name)"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    className="px-3 py-1 bg-black border border-amber-500/40 rounded-lg text-xs text-white"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-extrabold text-xs shadow-xl cursor-pointer transition-transform hover:scale-[1.01]"
              >
                🚀 नयाँ कथा प्रकाशन गर्नुहोस्
              </button>
            </form>
          )}

          {/* TAB 2: CATEGORY MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-fadeIn">
              
              <form onSubmit={handleCreateCategory} className="p-4 bg-black/40 rounded-2xl border border-white/10 flex gap-3">
                <input
                  type="text"
                  placeholder="नयाँ विधाको नाम (उदा. हास्य कथा)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>थप्नुहोस्</span>
                </button>
              </form>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                  मौजूद विधाहरू ({categories.length})
                </h4>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const count = stories.filter(s => s.category === cat).length;
                    return (
                      <div
                        key={cat}
                        className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs">
                            🏷️
                          </span>
                          <span className="text-xs font-bold text-white">{cat}</span>
                        </div>
                        <span className="text-[10px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">
                          {count} कथाहरू
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* METRIC CARDS */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 text-center">
                  <div className="text-2xl">📚</div>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">कुल कथाहरू</p>
                  <p className="text-2xl font-black text-amber-300 mt-1">{stories.length}</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 text-center">
                  <div className="text-2xl">👁️</div>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">कुल पठन संख्या (Views)</p>
                  <p className="text-2xl font-black text-sky-300 mt-1">{totalViews.toLocaleString()}</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 text-center">
                  <div className="text-2xl">❤️</div>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">कुल माया (Likes)</p>
                  <p className="text-2xl font-black text-rose-300 mt-1">{totalLikes.toLocaleString()}</p>
                </div>
              </div>

              {/* TOP PERFORMING STORIES LIST */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                  🔥 सर्वाधिक लोकप्रिय कथाहरू
                </h4>

                <div className="space-y-2">
                  {stories.slice(0, 5).map((story, i) => (
                    <div
                      key={story.id}
                      className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-amber-400 text-sm w-5">#{i + 1}</span>
                        <div>
                          <h5 className="text-xs font-bold text-white">{story.title}</h5>
                          <p className="text-[10px] text-gray-400">लेखक: {story.author} • विधा: {story.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="text-sky-300 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {story.views}
                        </span>
                        <span className="text-rose-400 flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-current" /> {story.likes}
                        </span>
                        <button
                          onClick={() => onDeleteStory(story.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="कथा हटाउनुहोस्"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                👥 सक्रिय प्रयोगकर्ताहरू
              </h4>

              <div className="space-y-2">
                {[
                  { name: 'राम श्रेष्ठ', email: 'ram@example.com', streak: 5, role: 'पाठक', status: 'सक्रिय' },
                  { name: 'गीता थापा', email: 'geeta@example.com', streak: 12, role: 'लेखक', status: 'सक्रिय' },
                  { name: 'हरि कोइराला', email: 'hari@example.com', streak: 3, role: 'पाठक', status: 'सक्रिय' },
                  { name: 'सुनिता निरौला', email: 'sunita@example.com', streak: 8, role: 'प्रिमियम', status: 'सक्रिय' },
                ].map((usr, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                        {usr.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{usr.name}</span>
                          <span className="px-2 py-0.2 rounded-full text-[9px] bg-white/10 text-amber-300 font-semibold">
                            {usr.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400">{usr.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-orange-400 font-bold">
                        🔥 {usr.streak} दिन
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        {usr.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
