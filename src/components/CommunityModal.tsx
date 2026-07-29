import React, { useState, useEffect } from 'react';
import { X, Users, MessageSquare, Award, Heart, ThumbsUp, Plus, UserPlus, UserCheck, Send, Sparkles, Trophy, BookOpen, Star, Flame } from 'lucide-react';
import { Story, CommunityPost, StoryContest, UserProfile } from '../types';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  userProfile: UserProfile;
  onToggleFollowAuthor: (authorName: string) => void;
  onOpenPublishStory: (contestId?: string) => void;
  onReadStory: (story: Story) => void;
  onShowToast: (msg: string) => void;
}

const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    author: 'आनन्द सुवेदी',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&fit=crop',
    title: 'नेपाली लोककथा र हाम्रो संस्कृति',
    content: 'हाम्रा हजुरआमाले सुनाउने दन्त्यकथाहरूमा कति धेरै जीवन दर्शन लुकेको हुन्थ्यो। चौतारीमा बसेर कथा सुन्नुको मज्जा नै छुट्टै हुन्छ। कथा चौतारी एपले ती मीठा यादहरू ब्यूँताइदिएको छ!',
    likes: 42,
    date: '२ घण्टा अघि',
    commentsCount: 9,
    category: 'विचार',
  },
  {
    id: 'post_2',
    author: 'मुना आचार्य',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&fit=crop',
    title: 'साप्ताहिक कथा प्रतियोगिता अङ्क ४ बारे सुझाव',
    content: 'यसपटकको 'स्मृति र हिमाल' शीर्षक मलाई साह्रै मन पर्यो। हिमाली परिवेश र स्मृतिलाई समेटेर एउटा कथा लेख्दैछु, आजै Publish गर्नेछु!',
    likes: 28,
    date: '५ घण्टा अघि',
    commentsCount: 6,
    category: 'प्रतियोगिता',
  },
];

const ACTIVE_CONTEST: StoryContest = {
  id: 'contest_2026_01',
  title: 'साप्ताहिक कथा प्रतियोगिता (अङ्क ४)',
  theme: 'स्मृति र हिमाल 🏔️',
  description: 'हिमाली काख, हिमाली जीवन, पुराना सम्झना वा यात्राहरूमा आधारित मौलिक नेपाली कथा लेख्नुहोस्। उत्कृष्ट कथाले आकर्षक पुरस्कार पाउनेछन्!',
  prize: 'प्रथम पुरस्कार: रु. २,००० + 'विजेता ब्याज' 🏆 | द्वितीय: रु. १,०००',
  deadline: 'अन्तिम मिति: अषाढ १५, २०८३',
  bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
  entriesCount: 14,
};

export const CommunityModal: React.FC<CommunityModalProps> = ({
  isOpen,
  onClose,
  stories,
  userProfile,
  onToggleFollowAuthor,
  onOpenPublishStory,
  onReadStory,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'contest' | 'authors'>('feed');
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [contestVotes, setContestVotes] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load local community posts if saved
    const savedPosts = localStorage.getItem('katha_community_posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {}
    }
  }, []);

  if (!isOpen) return null;

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: CommunityPost = {
      id: `p_${Date.now()}`,
      author: userProfile.name || 'कथा चौतारी पाठक',
      authorAvatar: userProfile.avatar,
      title: newPostTitle.trim() || 'चौतारी छलफल',
      content: newPostText.trim(),
      likes: 1,
      date: 'अहिले भर्खरै',
      commentsCount: 0,
      category: 'छलफल',
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('katha_community_posts', JSON.stringify(updated));
    setNewPostText('');
    setNewPostTitle('');
    onShowToast('कम्युनिटी पोस्ट प्रकाशित भयो! 💬');
  };

  const handleLikePost = (id: string) => {
    const updated = posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p));
    setPosts(updated);
    localStorage.setItem('katha_community_posts', JSON.stringify(updated));
  };

  const handleVoteContestStory = (storyId: string) => {
    setContestVotes((prev) => ({
      ...prev,
      [storyId]: (prev[storyId] || 0) + 1,
    }));
    onShowToast('तपाईंको भोट सफलतापूर्वक दर्ता भयो! 🗳️');
  };

  // Get distinct authors from stories
  const authorsMap = stories.reduce((acc, story) => {
    if (!acc[story.author]) {
      acc[story.author] = {
        name: story.author,
        count: 1,
        latestStory: story,
      };
    } else {
      acc[story.author].count += 1;
    }
    return acc;
  }, {} as Record<string, { name: string; count: number; latestStory: Story }>);

  const authorsList = Object.values(authorsMap);

  // Get stories submitted for active contest
  const contestStories = stories.filter((s) => s.contestId === ACTIVE_CONTEST.id || s.isUserPublished);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/80 border border-amber-500/40 rounded-3xl shadow-2xl p-5 md:p-7 relative space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full glass hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4 pr-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-2xl font-bold">
              👥
            </div>
            <div>
              <h3 className="text-xl font-black text-white">कथा चौतारी कम्युनिटी & प्रतियोगिता</h3>
              <p className="text-xs text-gray-300">लेखक, पाठक र साहित्यप्रेमीहरूको साझा मञ्च</p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenPublishStory();
            }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black font-extrabold text-xs shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>आफ्नो कथा प्रकाशित गर्नुहोस्</span>
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'feed'
                ? 'bg-amber-500 text-black font-black shadow-md'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>छलफल मञ्च (Feed)</span>
          </button>

          <button
            onClick={() => setActiveTab('contest')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'contest'
                ? 'bg-amber-500 text-black font-black shadow-md'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>कथा प्रतियोगिता 🏆</span>
          </button>

          <button
            onClick={() => setActiveTab('authors')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'authors'
                ? 'bg-amber-500 text-black font-black shadow-md'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>लेखकहरू ({authorsList.length})</span>
          </button>
        </div>

        {/* TAB 1: DISCUSSION FEED */}
        {activeTab === 'feed' && (
          <div className="space-y-5 animate-fadeIn">
            {/* CREATE POST FORM */}
            <form onSubmit={handleCreatePost} className="p-4 rounded-2xl bg-black/50 border border-amber-500/30 space-y-3">
              <h4 className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>चौतारीमा आफ्नो धारणा वा साहित्य विचार साझा गर्नुहोस्</span>
              </h4>

              <input
                type="text"
                placeholder="विषय / शीर्षक (उदा. आज पढेको मीठो कथा...)"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-amber-400"
              />

              <textarea
                rows={2}
                placeholder="आफ्नो विचार वा प्रतिक्रिया यहाँ लेख्नुहोस्..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-amber-400 resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5 fill-current" />
                  <span>पोस्ट गर्नुहोस्</span>
                </button>
              </div>
            </form>

            {/* POSTS LIST */}
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&fit=crop'}
                        alt={post.author}
                        className="w-8 h-8 rounded-full border border-amber-400/50 object-cover"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-white">{post.author}</h5>
                        <p className="text-[10px] text-gray-400">{post.date}</p>
                      </div>
                    </div>

                    {post.category && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {post.category}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-amber-200 pt-1">{post.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{post.content}</p>

                  <div className="flex items-center gap-4 pt-2 border-t border-white/5 text-xs text-gray-400">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer font-bold"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.likes} लाइक</span>
                    </button>

                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.commentsCount} कमेन्ट</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: STORY CONTEST */}
        {activeTab === 'contest' && (
          <div className="space-y-5 animate-fadeIn">
            {/* ACTIVE CONTEST BANNER */}
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 p-6 bg-gradient-to-r from-amber-950/90 via-slate-900 to-rose-950/90 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white flex items-center gap-1 shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>सक्रिय कथा प्रतियोगिता</span>
                </span>
                <span className="text-xs font-bold text-amber-300">{ACTIVE_CONTEST.deadline}</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">{ACTIVE_CONTEST.title}</h3>
                <p className="text-sm font-bold text-amber-300">विषय / Theme: "{ACTIVE_CONTEST.theme}"</p>
              </div>

              <p className="text-xs text-gray-200 leading-relaxed">{ACTIVE_CONTEST.description}</p>

              <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center justify-between gap-2">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>{ACTIVE_CONTEST.prize}</span>
                </span>

                <button
                  onClick={() => {
                    onClose();
                    onOpenPublishStory(ACTIVE_CONTEST.id);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black text-xs shadow-lg hover:scale-105 transition-transform cursor-pointer"
                >
                  प्रतियोगितामा कथा पठाउनुहोस् ✍️
                </button>
              </div>
            </div>

            {/* CONTEST ENTRIES LIST */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>प्रतियोगिताका कथाहरू ({contestStories.length}) - भोट गर्नुहोस्</span>
              </h4>

              {contestStories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {contestStories.map((story) => {
                    const votes = (story.contestVotes || 0) + (contestVotes[story.id] || 0);
                    return (
                      <div key={story.id} className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2 flex flex-col justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={story.coverImage}
                            alt={story.title}
                            className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                          />
                          <div>
                            <h5 className="text-xs font-bold text-white">{story.title}</h5>
                            <p className="text-[11px] text-amber-300">लेखक: {story.author}</p>
                            <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{story.snippet}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <button
                            onClick={() => {
                              onReadStory(story);
                              onClose();
                            }}
                            className="text-sky-300 hover:underline font-bold text-[11px]"
                          >
                            कथा पढ्नुहोस् →
                          </button>

                          <button
                            onClick={() => handleVoteContestStory(story.id)}
                            className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 border border-rose-500/30 text-[11px] font-black flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
                          >
                            <Heart className="w-3 h-3 fill-current text-rose-400" />
                            <span>भोट गर्नुहोस् ({votes})</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-gray-400 bg-black/30 rounded-2xl border border-white/5">
                  अहिले सम्म कुनै कथा परेको छैन। पहिलो प्रतियोगी बन्नुहोस्!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: AUTHORS LIST */}
        {activeTab === 'authors' && (
          <div className="space-y-4 animate-fadeIn">
            <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>कथा चौतारीका लेखकहरू र Follow गर्नुहोस्</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {authorsList.map((auth) => {
                const isFollowed = userProfile.followedAuthors?.includes(auth.name);
                return (
                  <div key={auth.name} className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-black text-sm">
                        {auth.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{auth.name}</h5>
                        <p className="text-[10px] text-amber-300 font-semibold">{auth.count} वटा प्रकाशित कथाहरू</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleFollowAuthor(auth.name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                        isFollowed
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500 text-black border-amber-400 font-extrabold'
                      }`}
                    >
                      {isFollowed ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                      <span>{isFollowed ? 'Followed' : 'Follow'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
