import React, { useState } from 'react';
import { UserProfile, Badge, ReadingHistoryItem } from '../types';
import { X, Flame, Trophy, History, UserCheck, Crown, LogOut, LogIn, UserPlus, Shield, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogin: (name: string, email: string) => void;
  onLogout: () => void;
  onUpgradeToPremium: () => void;
  onSelectHistoryStory: (storyId: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  onUpgradeToPremium,
  onSelectHistoryStory,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'badges' | 'auth'>('profile');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName || !loginEmail) return;
    onLogin(loginName, loginEmail);
    setActiveTab('profile');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 font-bold text-white">
              {user.avatar || user.name.charAt(0) || '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{user.name}</h3>
                {user.isPremium ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-black flex items-center gap-1 shadow-md">
                    <Crown className="w-3 h-3 fill-current" /> प्रिमियम
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-gray-300">
                    निःशुल्क सदस्य
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">{user.email || 'अतिथि प्रयोगकर्ता'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full glass hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS HEADER */}
        <div className="flex border-b border-white/10 bg-black/20 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>प्रोफाइल र स्ट्रीक</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4 text-sky-400" />
            <span>पठन इतिहास ({user.readingHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'badges'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>ब्याज र उपलब्धि ({user.badges.length})</span>
          </button>

          {!user.isLoggedIn && (
            <button
              onClick={() => setActiveTab('auth')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'auth'
                  ? 'bg-amber-500 text-black font-black'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>लगइन / साइनअप</span>
            </button>
          )}
        </div>

        {/* TAB CONTENT */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: PROFILE & STREAK */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* STREAK CARD */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/80 via-slate-900 to-amber-950/80 border border-orange-500/40 shadow-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl animate-bounce">🔥</span>
                    <div>
                      <h4 className="text-base font-black text-white">दैनिक पठन स्ट्रीक (Daily Streak)</h4>
                      <p className="text-xs text-orange-200/80">तपाईंले लगातार कथा पढ्दै हुनुहुन्छ!</p>
                    </div>
                  </div>
                  <div className="pt-2 text-2xl font-black text-amber-300 flex items-baseline gap-2">
                    <span>{user.streakDays} दिन</span>
                    <span className="text-xs text-gray-400 font-normal">(नियमित पाठक)</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
                    ✓ आजको पठन पूरा
                  </span>
                </div>
              </div>

              {/* PREMIUM UPGRADE PROMO */}
              {!user.isPremium ? (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-rose-950/90 border border-amber-500/50 shadow-2xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-black uppercase">
                        👑 प्रिमियम क्लब
                      </span>
                      <h4 className="text-base font-black text-white mt-1">विज्ञापन रहित + विशेष कथाहरूको पहुँच</h4>
                      <p className="text-xs text-gray-300 mt-1">
                        मासिक मात्र रु. ९९ मा सम्पूर्ण कथाहरू विज्ञापनरहित सुन्नुहोस् र गोल्डन ब्याज प्राप्त गर्नुहोस्।
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onUpgradeToPremium}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] cursor-pointer"
                  >
                    <Crown className="w-4 h-4 fill-current" />
                    <span>अहिले प्रिमियम सदस्य बन्नुहोस्</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>तपाईं प्रिमियम सदस्य हुनुहुन्छ! सबै विज्ञापनरहित कथाहरू तथा डाउनलोड फिचर उपलब्ध छन्।</span>
                </div>
              )}

              {/* FOLLOWED AUTHORS */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>तपाईंले पछ्याउनुभएका लेखकहरू ({user.followedAuthors.length})</span>
                </h4>

                {user.followedAuthors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.followedAuthors.map((author) => (
                      <span
                        key={author}
                        className="px-3 py-1.5 rounded-full bg-white/10 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5"
                      >
                        <span>✍️ {author}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    तपाईंले अहिलेसम्म कुनै पनि लेखकलाई पछ्याउनुभएको छैन। कथा modal बाट लेखकलाई Follow गर्नुहोस्।
                  </p>
                )}
              </div>

              {/* ACCOUNT ACTIONS */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                {user.isLoggedIn ? (
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>खाताबाट लगआउट गर्नुहोस्</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('auth')}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-amber-400 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>खातामा लगइन गर्नुहोस्</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: READING HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3 animate-fadeIn">
              <h4 className="text-xs font-extrabold text-sky-300 uppercase tracking-wider">
                📜 हालसालै पढिएका कथाहरू
              </h4>

              {user.readingHistory.length > 0 ? (
                <div className="space-y-2">
                  {user.readingHistory.map((item, idx) => (
                    <div
                      key={`${item.storyId}-${idx}`}
                      onClick={() => {
                        onSelectHistoryStory(item.storyId);
                        onClose();
                      }}
                      className="p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/50 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold text-white hover:text-amber-300 transition-colors">
                          {item.storyTitle}
                        </h5>
                        <p className="text-[11px] text-gray-400">
                          लेखक: {item.author} • विधा: {item.category}
                        </p>
                      </div>

                      <div className="text-right space-y-1">
                        <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          {item.progressPercent}% पढिएको
                        </span>
                        <p className="text-[10px] text-gray-500">{item.readAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 space-y-2">
                  <span className="text-3xl">📚</span>
                  <p className="text-xs">तपाईंको पठन इतिहास खाली छ। कथाहरू पढ्न सुरु गर्नुहोस्!</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BADGES */}
          {activeTab === 'badges' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                🏆 प्राप्त ब्याजहरू र उपलब्धिहरू
              </h4>

              <div className="grid sm:grid-cols-2 gap-3">
                {user.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 flex items-center gap-3"
                  >
                    <div className="text-3xl p-2 rounded-2xl bg-amber-500/20 border border-amber-500/40">
                      {badge.emoji}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{badge.title}</h5>
                      <p className="text-[11px] text-gray-400 mt-0.5">{badge.description}</p>
                      {badge.earnedAt && (
                        <p className="text-[9px] text-amber-400/80 mt-1 font-mono">
                          प्राप्त मिति: {badge.earnedAt}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AUTH FORM */}
          {activeTab === 'auth' && (
            <form onSubmit={handleAuthSubmit} className="space-y-4 max-w-md mx-auto animate-fadeIn py-4">
              <div className="text-center space-y-1">
                <span className="text-3xl">🔐</span>
                <h4 className="text-lg font-black text-white">
                  {isSignUp ? 'नयाँ खाता सिर्जना गर्नुहोस्' : 'आफ्नो खातामा लगइन गर्नुहोस्'}
                </h4>
                <p className="text-xs text-gray-400">
                  आफ्नो मनपर्ने कथाहरू, पठन इतिहास र ब्याज सुरक्षित राख्नुहोस्।
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">पूरा नाम:</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. राम श्रेष्ठ"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">इमेल ठेगाना:</label>
                  <input
                    type="email"
                    required
                    placeholder="उदा. ram@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-extrabold text-xs shadow-lg cursor-pointer transition-transform hover:scale-[1.01]"
              >
                {isSignUp ? 'खाता बनाउनुहोस् 🚀' : 'लगइन गर्नुहोस् 🔐'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-amber-300 hover:underline cursor-pointer"
                >
                  {isSignUp ? 'पहिल्यै खाता छ? लगइन गर्नुहोस्' : 'नयाँ प्रयोगकर्ता हुनुहुन्छ? नयाँ खाता बनाउनुहोस्'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
