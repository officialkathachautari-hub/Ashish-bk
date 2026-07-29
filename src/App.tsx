import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero3DCanvas } from './components/Hero3DCanvas';
import { FeaturedVideo } from './components/FeaturedVideo';
import { StoryCard } from './components/StoryCard';
import { StoryModal } from './components/StoryModal';
import { AIStoryGeneratorModal } from './components/AIStoryGeneratorModal';
import { BookmarkListModal } from './components/BookmarkListModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { DonationModal } from './components/DonationModal';
import { MonetizationBanner } from './components/MonetizationBanner';
import { PWAandSEOModal } from './components/PWAandSEOModal';
import { AboutSection } from './components/AboutSection';
import { TrendingSection } from './components/TrendingSection';
import { NewStoriesSection } from './components/NewStoriesSection';
import { MostListenedSection } from './components/MostListenedSection';
import { GenreSection } from './components/GenreSection';
import { FastScrollSlides } from './components/FastScrollSlides';
import { AppSplashScreen } from './components/AppSplashScreen';
import { LoginView } from './components/LoginView';
import { SignupView } from './components/SignupView';
import { ForgotPasswordView } from './components/ForgotPasswordView';
import { DashboardView } from './components/DashboardView';
import { INITIAL_STORIES } from './data/storiesData';
import { Story, Category, Comment, AIStoryModalMode, UserProfile } from './types';
import { Search, Sparkles, BookOpen, Film, Heart, Home, Info, User, Shield, Smartphone, LayoutDashboard, LogIn } from 'lucide-react';

const CATEGORIES: Category[] = [
  'सबै',
  'लोककथा',
  'प्रेरणादायी',
  'जीवनकथा',
  'रहस्य',
  'भावनात्मक',
  'सत्यकथा',
  'प्रेम',
  'दुःख',
];

const INITIAL_USER: UserProfile = {
  id: 'user-123',
  name: 'राम श्रेष्ठ',
  email: 'ram@katha.np',
  avatar: '🇳🇵',
  isLoggedIn: true,
  isPremium: false,
  streakDays: 5,
  badges: [
    { id: 'badge-1', title: 'कथा पारखी', emoji: '🏆', description: '५ भन्दा बढी कथाहरू पढेको', earnedAt: '२०८१/०४/१०' },
    { id: 'badge-2', title: 'लोककथा प्रेमी', emoji: '🌟', description: 'लोककथा विधामा रुचि देखाएको', earnedAt: '२०८१/०४/१२' },
    { id: 'badge-3', title: 'सक्रिय समीक्षक', emoji: '📜', description: 'कथामा प्रतिक्रिया लेखेको', earnedAt: '२०८१/०४/१४' },
  ],
  readingHistory: [
    {
      storyId: 'shakuni-ko-paaso',
      storyTitle: 'शकुनिको पासो',
      author: 'कथा चौतारी',
      category: 'लोककथा',
      readAt: 'आज, १०:१५ AM',
      progressPercent: 100,
    },
    {
      storyId: 'gaunle-soch',
      storyTitle: 'गाउँले सोच र सहरको कथा',
      author: 'गीता थापा',
      category: 'जीवनकथा',
      readAt: 'हिजो, ०८:३० PM',
      progressPercent: 85,
    },
  ],
  followedAuthors: ['कथा चौतारी', 'गीता थापा'],
};

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Categories list
  const [categoriesList, setCategoriesList] = useState<Category[]>(CATEGORIES);

  // Stories state
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('katha_stories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_STORIES;
      }
    }
    return INITIAL_STORIES;
  });

  // User Profile State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('katha_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  // Current View Router State ('home' | 'login' | 'signup' | 'forgot' | 'dashboard')
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'signup' | 'forgot' | 'dashboard'>('home');

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('katha_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['shakuni-ko-paaso'];
      }
    }
    return ['shakuni-ko-paaso'];
  });

  // Category & Search filter state
  const [selectedCategory, setSelectedCategory] = useState<Category>('सबै');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [aiModalMode, setAiModalMode] = useState<AIStoryModalMode>('create');
  const [aiTargetStory, setAiTargetStory] = useState<Story | null>(null);

  const [isBookmarksModalOpen, setIsBookmarksModalOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isPWAOpen, setIsPWAOpen] = useState(false);

  // Donation Modal State
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [donationAuthor, setDonationAuthor] = useState('कथा चौतारी टोली');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save stories, user & bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('katha_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('katha_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('katha_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // Deep Link Support: Check for ?story=storyId in URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const storyIdParam = params.get('story');
    if (storyIdParam) {
      const foundStory = stories.find((s) => s.id === storyIdParam);
      if (foundStory) {
        setActiveStory(foundStory);
        setIsStoryModalOpen(true);
      }
    }
  }, []);

  // Handle Theme Toggle
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    showToast(newTheme === 'light' ? '☀️ उज्यालो मोड सक्रिय भयो' : '🌙 अँध्यारो मोड सक्रिय भयो');
  };

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Bookmark toggle
  const toggleBookmark = (story: Story) => {
    setBookmarkedIds((prev) => {
      const isExist = prev.includes(story.id);
      if (isExist) {
        showToast(`'${story.title}' मनपर्ने सूचीबाट हटाइयो`);
        return prev.filter((id) => id !== story.id);
      } else {
        showToast(`'${story.title}' मनपर्ने सूचीमा थपियो ❤️`);
        return [...prev, story.id];
      }
    });
  };

  // Follow / Unfollow Author
  const handleToggleFollowAuthor = (authorName: string) => {
    setUser((prev) => {
      const exists = prev.followedAuthors.includes(authorName);
      if (exists) {
        showToast(`लेखक '${authorName}' लाई Unfollow गरियो`);
        return {
          ...prev,
          followedAuthors: prev.followedAuthors.filter((a) => a !== authorName),
        };
      } else {
        showToast(`लेखक '${authorName}' लाई Follow गरियो! ✍️`);
        return {
          ...prev,
          followedAuthors: [...prev.followedAuthors, authorName],
        };
      }
    });
  };

  // Open Story Modal and update URL deep link & reading history
  const handleReadStory = (story: Story) => {
    // Increment view count
    setStories((prev) =>
      prev.map((s) => (s.id === story.id ? { ...s, views: s.views + 1 } : s))
    );
    setActiveStory(story);
    setIsStoryModalOpen(true);

    // Update User Reading History
    setUser((prev) => {
      const historyItem = {
        storyId: story.id,
        storyTitle: story.title,
        author: story.author,
        category: story.category,
        readAt: 'भर्खरै',
        progressPercent: 100,
      };
      const filtered = prev.readingHistory.filter((h) => h.storyId !== story.id);
      return {
        ...prev,
        readingHistory: [historyItem, ...filtered],
      };
    });

    // Update URL query parameter
    const url = new URL(window.location.href);
    url.searchParams.set('story', story.id);
    window.history.replaceState({}, '', url.toString());
  };

  // Close Story Modal and clean up URL deep link
  const handleCloseStoryModal = () => {
    setIsStoryModalOpen(false);
    const url = new URL(window.location.href);
    if (url.searchParams.has('story')) {
      url.searchParams.delete('story');
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Add Comment to Story
  const handleAddComment = (storyId: string, comment: Comment) => {
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          const updatedComments = [comment, ...(s.comments || [])];
          return { ...s, comments: updatedComments };
        }
        return s;
      })
    );
    if (activeStory && activeStory.id === storyId) {
      setActiveStory((prev) =>
        prev ? { ...prev, comments: [comment, ...(prev.comments || [])] } : null
      );
    }
    showToast('तपाईंको कमेन्ट सफलतापूर्वक पोस्ट भयो! 💬');
  };

  // User Login / Logout
  const handleUserLogin = (name: string, email: string) => {
    setUser((prev) => ({
      ...prev,
      name,
      email,
      isLoggedIn: true,
    }));
    showToast(`स्वागत छ ${name}! तपाईंको खाता सक्रिय भयो 🔐`);
  };

  const handleUserLogout = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    showToast('तपाईं लगआउट हुनुभयो');
  };

  const handleUpgradeToPremium = () => {
    setUser((prev) => ({
      ...prev,
      isPremium: true,
    }));
    showToast('बधाई छ! तपाईं प्रिमियम सदस्य बन्नुभयो 👑');
  };

  // Admin Actions
  const handleAddNewStoryFromAdmin = (newStory: Story) => {
    setStories((prev) => [newStory, ...prev]);
    showToast(`नयाँ कथा '${newStory.title}' सफलतापूर्वक प्रकाशित भयो! 🚀`);
  };

  const handleDeleteStoryFromAdmin = (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    showToast('कथा संग्रहबाट हटाइयो');
  };

  const handleAddCategoryFromAdmin = (categoryName: string) => {
    setCategoriesList((prev) => [...prev, categoryName as Category]);
    showToast(`नयाँ विधा '${categoryName}' थपियो 🏷️`);
  };

  // Open AI Generator with custom mode
  const handleOpenAIGenerator = (mode: AIStoryModalMode = 'create', story: Story | null = null) => {
    setAiModalMode(mode);
    setAiTargetStory(story);
    setIsAIGeneratorOpen(true);
  };

  // Save AI Generated Story to Library
  const handleSaveNewAIStory = (newStory: Story) => {
    setStories((prev) => [newStory, ...prev]);
    showToast(`'${newStory.title}' संग्रहमा थपियो 📚`);
    setActiveStory(newStory);
    setIsStoryModalOpen(true);
  };

  // Filtered Stories
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchesCategory =
        selectedCategory === 'सबै' || story.category === selectedCategory;
      const matchesSearch =
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [stories, selectedCategory, searchQuery]);

  // Featured Story (Shakuni ko Paaso)
  const featuredStory = stories.find((s) => s.isFeatured) || stories[0];

  // Bookmarked stories list
  const bookmarkedStories = useMemo(() => {
    return stories.filter((s) => bookmarkedIds.includes(s.id));
  }, [stories, bookmarkedIds]);

  return (
    <div className={`min-h-screen text-white relative selection:bg-amber-500 selection:text-black ${theme}`}>
      
      {/* APP LAUNCH ANIMATION SPLASH SCREEN */}
      <AppSplashScreen />

      {/* SCENE BACKGROUND */}
      <div className="bg-scene">
        <div className="absolute w-80 h-80 bg-amber-500/15 rounded-full blur-3xl top-20 left-10 hero-glow" />
        <div className="absolute w-80 h-80 bg-rose-500/15 rounded-full blur-3xl bottom-20 right-10 hero-glow" />
        <div className="mountain" />
      </div>

      {/* NAVBAR */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAIGenerator={() => handleOpenAIGenerator('create')}
        onOpenBookmarks={() => setIsBookmarksModalOpen(true)}
        bookmarksCount={bookmarkedIds.length}
        userProfile={user}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onOpenPWA={() => setIsPWAOpen(true)}
        onOpenDonate={() => setIsDonationOpen(true)}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* VIEW ROUTING */}
      {currentView === 'login' && (
        <div className="pt-20">
          <LoginView
            onNavigate={setCurrentView}
            onLoginSuccess={(name, email) => {
              handleUserLogin(name, email);
              showToast(`स्वागत छ, ${name}! 🎉`);
            }}
          />
        </div>
      )}

      {currentView === 'signup' && (
        <div className="pt-20">
          <SignupView
            onNavigate={setCurrentView}
            onSignupSuccess={(name, email) => {
              handleUserLogin(name, email);
              showToast(`खाता तयार भयो! स्वागत छ ${name} 🎉`);
            }}
          />
        </div>
      )}

      {currentView === 'forgot' && (
        <div className="pt-20">
          <ForgotPasswordView onNavigate={setCurrentView} />
        </div>
      )}

      {currentView === 'dashboard' && (
        <div className="pt-20">
          <DashboardView
            user={user}
            stories={stories}
            bookmarkedIds={bookmarkedIds}
            onNavigate={setCurrentView}
            onLogout={handleUserLogout}
            onUpgradeToPremium={handleUpgradeToPremium}
            onSelectStory={handleReadStory}
            onOpenAiGenerator={() => handleOpenAIGenerator('create')}
            onUpdateName={(newName) => {
              setUser((prev) => ({ ...prev, name: newName }));
              showToast('नाम सफलतापुर्वक अद्यावधिक गरियो!');
            }}
            onOpenDonate={() => setIsDonationOpen(true)}
          />
        </div>
      )}

      {currentView === 'home' && (
        <>
          {/* HERO SECTION */}
      <section id="home" className="min-h-screen pt-28 px-5 pb-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center min-h-[85vh]">
          
          {/* HERO TEXT */}
          <div id="heroText" className="space-y-6 order-2 md:order-1">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs text-amber-300 font-semibold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>नेपाली कथा र लोककथाको डिजिटल चौतारी</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight">
              जहाँ कथा बोल्छ, <br />
              <span className="hero-title">मन छुन्छ।</span>
            </h2>

            <p className="text-gray-300 muted leading-relaxed text-base md:text-lg">
              पुराना सम्झना, गाउँघरका कथा, जीवनका संघर्ष, सत्यको जित र मानवीय भावनाले भरिएका मौलिक नेपाली कथाहरू एउटै ठाउँमा।
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#featured"
                className="btn-press px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black font-extrabold text-sm shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
              >
                <span>🎬 विशेष दृश्य कथा</span>
              </a>

              <a
                href="#stories"
                className="btn-press glass px-6 py-3.5 rounded-full text-white font-bold text-sm hover:bg-white/10 border border-white/20 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>सबै कथाहरू</span>
              </a>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="glass rounded-2xl p-4 text-center floating border border-amber-500/20">
                <div className="text-2xl">📖</div>
                <div className="text-[11px] text-gray-400 mt-1 font-medium">कथाहरू</div>
                <div className="font-bold text-amber-300 text-lg">{stories.length}+</div>
              </div>

              <div
                className="glass rounded-2xl p-4 text-center floating border border-amber-500/20"
                style={{ animationDelay: '.5s' }}
              >
                <div className="text-2xl">🔥</div>
                <div className="text-[11px] text-gray-400 mt-1 font-medium">स्ट्रीक</div>
                <div className="font-bold text-orange-400 text-lg">{user.streakDays} दिन</div>
              </div>

              <div
                className="glass rounded-2xl p-4 text-center floating border border-amber-500/20"
                style={{ animationDelay: '1s' }}
              >
                <div className="text-2xl">❤️</div>
                <div className="text-[11px] text-gray-400 mt-1 font-medium">पाठक</div>
                <div className="font-bold text-amber-300 text-lg">10K+</div>
              </div>
            </div>

          </div>

          {/* 3D ANIMATION CANVAS (WEB TOP RIGHT) */}
          <div id="hero3d" className="order-1 md:order-2">
            <div className="glass rounded-3xl p-3 border border-amber-500/30 shadow-2xl relative">
              <Hero3DCanvas />

              <div className="text-center pb-2 pt-3">
                <p className="text-xs text-amber-300 font-semibold flex items-center justify-center gap-1">
                  <span>✨ ३D अन्तरक्रियात्मक कथा पुस्तक</span>
                </p>
                <p className="text-xs text-gray-300 mt-0.5">
                  कथा केवल शब्द होइन, एउटा जीवन्त अनुभूति हो।
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PRESENTATION STORY */}
      {featuredStory && (
        <FeaturedVideo
          story={featuredStory}
          isBookmarked={bookmarkedIds.includes(featuredStory.id)}
          onToggleBookmark={toggleBookmark}
          onReadStory={handleReadStory}
          onAnalyzeMoral={(s) => handleOpenAIGenerator('moral', s)}
        />
      )}

      {/* MONETIZATION / SPONSORED BANNER */}
      <MonetizationBanner
        isPremium={user.isPremium}
        onUpgradeToPremium={() => setIsUserProfileOpen(true)}
      />

      {/* 1. 🔥 TRENDING STORIES SECTION */}
      <TrendingSection
        stories={stories}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={toggleBookmark}
        onReadStory={handleReadStory}
      />

      {/* ⚡ FAST SCROLL SLIDES SECTION */}
      <FastScrollSlides
        stories={stories}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={toggleBookmark}
        onReadStory={handleReadStory}
      />

      {/* 2. 🆕 NEW STORIES SECTION */}
      <NewStoriesSection
        stories={stories}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={toggleBookmark}
        onReadStory={handleReadStory}
      />

      {/* 3. ❤️ MOST LISTENED / VIEWED SECTION */}
      <MostListenedSection
        stories={stories}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={toggleBookmark}
        onReadStory={handleReadStory}
      />

      {/* 4. 🎧 GENRE SECTION */}
      <GenreSection
        stories={stories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* SEARCH & CATEGORY FILTER SECTION */}
      <section className="px-5 py-8" id="search-section">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* SEARCH BAR */}
          <div className="glass rounded-2xl p-3 md:p-4 flex items-center gap-3 border border-amber-500/20 shadow-lg">
            <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <input
              type="search"
              placeholder="कथा, शीर्षक वा विधा खोज्नुहोस्..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input bg-transparent outline-none w-full text-sm md:text-base text-white placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-300"
              >
                हटाउनुहोस्
              </button>
            )}
          </div>

          {/* CATEGORY TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold border transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md scale-105'
                    : 'glass text-gray-300 border-white/10 hover:border-amber-400/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* STORIES GRID SECTION */}
      <section id="stories" className="px-5 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-amber-400 text-xs font-bold tracking-wider uppercase">
                📚 कथा संग्रह
              </span>
              <h2 className="text-3xl md:text-4xl font-black mt-1 hero-title">
                {selectedCategory === 'सबै' ? 'हाम्रा लोकप्रिय कथाहरू' : `${selectedCategory} कथाहरू`}
              </h2>
            </div>
            <p className="text-gray-400 text-xs md:text-sm max-w-md">
              आफ्नो मनपर्ने कथा छान्नुहोस्, सुन्नुहोस् र कथाको सुन्दर संसारमा हराउनुहोस्।
            </p>
          </div>

          {/* GRID */}
          {filteredStories.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  isBookmarked={bookmarkedIds.includes(story.id)}
                  onToggleBookmark={toggleBookmark}
                  onReadStory={handleReadStory}
                />
              ))}
            </div>
          ) : (
            <div className="glass rounded-3xl p-12 text-center space-y-3 border border-white/10 max-w-lg mx-auto">
              <span className="text-4xl">🔍</span>
              <h3 className="text-lg font-bold text-white">कुनै पनि कथा भेटिएन!</h3>
              <p className="text-xs text-gray-400">
                तपाईंको खोजी अनुसारको कथा भेटिएन। कृपया अर्को शब्द वा विधा प्रयोग गर्नुहोस्।
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('सबै');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-full bg-amber-500 text-black font-bold text-xs mt-2"
              >
                सबै कथाहरू हेर्नुहोस्
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ABOUT SECTION */}
      <AboutSection onOpenDonate={() => setIsDonationOpen(true)} />
        </>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="mobile-nav fixed bottom-0 left-0 w-full glass border-t border-white/10 py-2.5 px-6 justify-around text-center z-50">
        <button
          onClick={() => setCurrentView('home')}
          className={`text-[11px] flex flex-col items-center gap-1 cursor-pointer ${
            currentView === 'home' ? 'text-amber-300 font-extrabold' : 'text-gray-300 hover:text-amber-400'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>गृहपृष्ठ</span>
        </button>

        <button
          onClick={() => setCurrentView('dashboard')}
          className={`text-[11px] flex flex-col items-center gap-1 cursor-pointer ${
            currentView === 'dashboard' ? 'text-amber-300 font-extrabold' : 'text-gray-300 hover:text-amber-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-amber-400" />
          <span>ड्यासबोर्ड</span>
        </button>

        <button
          onClick={() => handleOpenAIGenerator('create')}
          className="text-[11px] flex flex-col items-center gap-1 text-amber-300 font-bold cursor-pointer"
        >
          <Sparkles className="w-4 h-4 animate-bounce text-amber-400" />
          <span>AI कथा</span>
        </button>

        <button
          onClick={() => setCurrentView('login')}
          className={`text-[11px] flex flex-col items-center gap-1 cursor-pointer ${
            currentView === 'login' ? 'text-amber-300 font-extrabold' : 'text-gray-300 hover:text-amber-400'
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>लगइन</span>
        </button>

        <button
          onClick={() => setIsAdminPanelOpen(true)}
          className="text-[11px] flex flex-col items-center gap-1 text-emerald-300 font-bold cursor-pointer"
        >
          <Shield className="w-4 h-4" />
          <span>एडमिन</span>
        </button>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          id="toast"
          className="show glass px-6 py-3 rounded-full text-xs md:text-sm text-amber-300 font-bold border border-amber-500/40 shadow-2xl z-[100]"
        >
          {toastMessage}
        </div>
      )}

      {/* MODALS */}
      <StoryModal
        story={activeStory}
        isOpen={isStoryModalOpen}
        onClose={handleCloseStoryModal}
        isBookmarked={activeStory ? bookmarkedIds.includes(activeStory.id) : false}
        onToggleBookmark={toggleBookmark}
        onAddComment={handleAddComment}
        onContinueWithAI={(s) => {
          handleCloseStoryModal();
          handleOpenAIGenerator('continue', s);
        }}
        onAnalyzeMoralWithAI={(s) => {
          handleCloseStoryModal();
          handleOpenAIGenerator('moral', s);
        }}
        isFollowingAuthor={activeStory ? user.followedAuthors.includes(activeStory.author) : false}
        onToggleFollowAuthor={handleToggleFollowAuthor}
        onOpenDonateModal={(author) => {
          setDonationAuthor(author);
          setIsDonationOpen(true);
        }}
      />

      <AIStoryGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        initialMode={aiModalMode}
        initialStory={aiTargetStory}
        onSaveNewStory={handleSaveNewAIStory}
      />

      <BookmarkListModal
        isOpen={isBookmarksModalOpen}
        onClose={() => setIsBookmarksModalOpen(false)}
        bookmarkedStories={bookmarkedStories}
        onReadStory={handleReadStory}
        onRemoveBookmark={toggleBookmark}
      />

      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        user={user}
        onLogin={handleUserLogin}
        onLogout={handleUserLogout}
        onUpgradeToPremium={handleUpgradeToPremium}
        onSelectHistoryStory={(id) => {
          const s = stories.find((item) => item.id === id);
          if (s) handleReadStory(s);
        }}
      />

      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        categories={categoriesList}
        stories={stories}
        onAddNewStory={handleAddNewStoryFromAdmin}
        onDeleteStory={handleDeleteStoryFromAdmin}
        onAddCategory={handleAddCategoryFromAdmin}
      />

      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        authorName={donationAuthor}
        onDonationSuccess={(amt) => showToast(`रु. ${amt} सहयोगको लागि हार्दिक धन्यवाद! 💖`)}
      />

      <PWAandSEOModal
        isOpen={isPWAOpen}
        onClose={() => setIsPWAOpen(false)}
        onShowToast={showToast}
        onReadStory={handleReadStory}
      />

    </div>
  );
}
