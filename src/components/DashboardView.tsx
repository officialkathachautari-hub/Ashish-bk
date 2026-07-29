import React, { useState } from 'react';
import { UserProfile, Story } from '../types';
import { 
  Flame, Trophy, History, Crown, BookOpen, Heart, Sparkles, LogOut, 
  Settings, UserCheck, CheckCircle2, ArrowLeft, Clock, Award, Shield, Edit3, Save
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  stories: Story[];
  bookmarkedIds: string[];
  onNavigate: (view: 'home' | 'login' | 'signup' | 'forgot' | 'dashboard') => void;
  onLogout: () => void;
  onUpgradeToPremium: () => void;
  onSelectStory: (story: Story) => void;
  onOpenAiGenerator: () => void;
  onUpdateName: (newName: string) => void;
  onOpenDonate?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  stories,
  bookmarkedIds,
  onNavigate,
  onLogout,
  onUpgradeToPremium,
  onSelectStory,
  onOpenAiGenerator,
  onUpdateName,
  onOpenDonate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'badges' | 'bookmarks' | 'settings'>('overview');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user.name);

  const bookmarkedStories = stories.filter((s) => bookmarkedIds.includes(s.id));

  const handleSaveName = () => {
    if (editedName.trim()) {
      onUpdateName(editedName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* TOP BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer glass px-4 py-2.5 rounded-2xl border border-amber-500/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>गृहपृष्ठमा फर्कनुहोस् (Back to Home)</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAiGenerator}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-black text-xs font-black flex items-center gap-1.5 shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI कथा सिर्जना गर्नुहोस्</span>
            </button>

            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>लगआउट</span>
            </button>
          </div>
        </div>

        {/* HERO WELCOME BANNER */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-amber-950/80 border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-500 to-sky-500 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-amber-500/20 font-bold text-white border-2 border-white/20">
              {user.avatar || '🇳🇵'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
                {user.isPremium ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-black flex items-center gap-1 shadow-md">
                    <Crown className="w-3.5 h-3.5 fill-current" /> प्रिमियम सदस्य
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gray-300 border border-white/10">
                    निःशुल्क सदस्य
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                {user.email || 'कथा चौतारी डिजिटल पाठक'} • प्रयोगकर्ता ड्यासबोर्ड
              </p>
            </div>
          </div>

          {!user.isPremium && (
            <button
              onClick={onUpgradeToPremium}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs flex items-center gap-2 shadow-xl cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <Crown className="w-4 h-4 fill-current" />
              <span>प्रिमियम अपग्रेड गर्नुहोस् (रु. ९९/महिना)</span>
            </button>
          )}
        </div>

        {/* METRICS STATS CARDS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-950/60 to-black border border-orange-500/30 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-orange-400">
              <Flame className="w-6 h-6 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-500/30">
                दैनिक
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{user.streakDays} दिन</div>
            <p className="text-xs text-orange-200/70 font-medium">दैनिक पठन स्ट्रीक</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-950/60 to-black border border-sky-500/30 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-sky-400">
              <BookOpen className="w-6 h-6" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/30">
                इतिहास
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{user.readingHistory.length}</div>
            <p className="text-xs text-sky-200/70 font-medium">कुल पढिएका कथाहरू</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-black border border-amber-500/30 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <Trophy className="w-6 h-6" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                पुरस्कार
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{user.badges.length}</div>
            <p className="text-xs text-amber-200/70 font-medium">प्राप्त ब्याजहरू</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/60 to-black border border-rose-500/30 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-rose-400">
              <Heart className="w-6 h-6" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                सङ्ग्रह
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{bookmarkedStories.length}</div>
            <p className="text-xs text-rose-200/70 font-medium">मनपर्ने बुकमार्कहरू</p>
          </div>

        </div>

        {/* MAIN NAVIGATION TABS */}
        <div className="flex border-b border-white/10 bg-black/40 p-2 rounded-2xl gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>ओभरभ्यु (Overview)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-amber-500 text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>पठन इतिहास ({user.readingHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`px-5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'badges'
                ? 'bg-amber-500 text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>ब्याज र उपलव्धि ({user.badges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'bookmarks'
                ? 'bg-amber-500 text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>बुकमार्कहरू ({bookmarkedStories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>खाता सेटिङहरू</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* STREAK PROGRESS CARD */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/80 via-slate-900 to-amber-950/80 border border-orange-500/40 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">🔥</span>
                    <div>
                      <h3 className="text-lg font-black text-white">निरन्तर पठन उपलब्धि (Streak Status)</h3>
                      <p className="text-xs text-orange-200/80">तपाईंले लगातार {user.streakDays} दिनदेखि कथा पढ्नुभएको छ।</p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
                    ✓ आजको लक्ष्य पूरा
                  </span>
                </div>

                <div className="w-full bg-black/60 h-3 rounded-full overflow-hidden border border-orange-500/30">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full w-3/4 rounded-full animate-pulse" />
                </div>
                <p className="text-[11px] text-gray-400 text-right">अर्को ब्याज पाउन २ दिन अझै बाँकी छ</p>
              </div>

              {/* RECENTLY READ STORIES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-400" />
                    <span>हालसालै पढिएका कथाहरू</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs text-amber-300 hover:underline cursor-pointer font-bold"
                  >
                    सबै हेर्नुहोस् ({user.readingHistory.length}) →
                  </button>
                </div>

                {user.readingHistory.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {user.readingHistory.slice(0, 4).map((item, idx) => (
                      <div
                        key={`${item.storyId}-${idx}`}
                        className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/50 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white hover:text-amber-300 transition-colors">
                            {item.storyTitle}
                          </h4>
                          <p className="text-xs text-gray-400">
                            लेखक: {item.author} • विधा: {item.category}
                          </p>
                        </div>
                        <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          {item.progressPercent}% पूरा
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">तपाईंले अहिलेसम्म कुनै कथा पढ्नुभएको छैन।</p>
                )}
              </div>

              {/* FOLLOWED AUTHORS */}
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-400" />
                  <span>तपाईंले पछ्याउनुभएका लेखकहरू</span>
                </h3>
                {user.followedAuthors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.followedAuthors.map((author) => (
                      <span
                        key={author}
                        className="px-4 py-2 rounded-2xl bg-white/10 text-white font-bold text-xs border border-white/20 flex items-center gap-2 shadow-sm"
                      >
                        <span>✍️ {author}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">तपाईंले कुनै लेखकलाई पछ्याउनुभएको छैन।</p>
                )}
              </div>

              {/* KHALTI DONATION CARD IN DASHBOARD */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-amber-950/60 border border-purple-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                    💜
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <span>कथा चौतारी खल्टी सहयोग</span>
                      <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded font-extrabold">9818700478</span>
                    </h4>
                    <p className="text-xs text-gray-300">
                      मौलिक कथा सिर्जना र नेपाली साहित्य प्रवर्द्धनका लागि खल्टीबाट सहयोग पठाउन सक्नुहुन्छ।
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenDonate}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md transition-transform hover:scale-105 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 text-rose-300 fill-current" />
                  <span>खल्टी डोनेसन</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: READING HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <History className="w-5 h-5 text-sky-400" />
                <span>सम्पूर्ण पठन इतिहास</span>
              </h3>

              {user.readingHistory.length > 0 ? (
                <div className="space-y-3">
                  {user.readingHistory.map((item, idx) => (
                    <div
                      key={`${item.storyId}-${idx}`}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/50 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white hover:text-amber-300 transition-colors">
                          {item.storyTitle}
                        </h4>
                        <p className="text-xs text-gray-400">
                          लेखक: {item.author} • विधा: {item.category} • समय: {item.readAt}
                        </p>
                      </div>

                      <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                        {item.progressPercent}% पूरा
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 space-y-2">
                  <span className="text-4xl">📚</span>
                  <p className="text-sm">तपाईंको पठन इतिहास खाली छ। गृहपृष्ठबाट कथाहरू पढ्न सुरु गर्नुहोस्!</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BADGES */}
          {activeTab === 'badges' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>प्राप्त उपलब्धिहरू तथा ब्याजहरू</span>
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-5 rounded-2xl bg-black/40 border border-amber-500/30 flex items-start gap-4 shadow-lg"
                  >
                    <div className="text-4xl p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex-shrink-0">
                      {badge.emoji}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white">{badge.title}</h4>
                      <p className="text-xs text-gray-400">{badge.description}</p>
                      {badge.earnedAt && (
                        <p className="text-[10px] text-amber-400 font-mono pt-1">
                          प्राप्त मिति: {badge.earnedAt}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <span>तपाईंका मनपर्ने बुकमार्क कथाहरू ({bookmarkedStories.length})</span>
              </h3>

              {bookmarkedStories.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarkedStories.map((story) => (
                    <div
                      key={story.id}
                      onClick={() => onSelectStory(story)}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-rose-400/50 cursor-pointer transition-all hover:scale-[1.02] space-y-2"
                    >
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <h4 className="text-sm font-bold text-white hover:text-amber-300 transition-colors line-clamp-1">
                        {story.title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2">{story.snippet}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 space-y-2">
                  <span className="text-4xl">💖</span>
                  <p className="text-sm">अहिलेसम्म कुनै कथा बुकमार्क गर्नुभएको छैन।</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-xl animate-fadeIn">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <span>खाता सेटिङहरू (Account Settings)</span>
              </h3>

              <div className="space-y-4 pt-2">
                
                {/* NAME FIELD */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <label className="block text-xs font-bold text-gray-400">प्रयोगकर्ताको नाम:</label>
                  {isEditingName ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-black border border-amber-400 text-white text-xs outline-none"
                      />
                      <button
                        onClick={handleSaveName}
                        className="px-3 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>सेभ</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{user.name}</span>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>सच्याउनुहोस्</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* EMAIL FIELD */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <label className="block text-xs font-bold text-gray-400">इमेल ठेगाना:</label>
                  <p className="text-sm font-bold text-white">{user.email}</p>
                </div>

                {/* LOGOUT BUTTON */}
                <div className="pt-4">
                  <button
                    onClick={onLogout}
                    className="w-full py-3.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>अकाउन्ट लगआउट गर्नुहोस्</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
