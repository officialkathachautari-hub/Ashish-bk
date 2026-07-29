export type Category =
  | 'सबै'
  | 'लोककथा'
  | 'प्रेरणादायी'
  | 'जीवनकथा'
  | 'रहस्य'
  | 'भावनात्मक'
  | 'सत्यकथा'
  | 'प्रेम'
  | 'दुःख';

export interface Comment {
  id: string;
  userName: string;
  text: string;
  date: string;
  rating?: number;
}

export interface Badge {
  id: string;
  title: string;
  emoji: string;
  description: string;
  earnedAt?: string;
}

export interface ReadingHistoryItem {
  storyId: string;
  storyTitle: string;
  author: string;
  category: string;
  readAt: string;
  progressPercent: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  isPremium: boolean;
  streakDays: number;
  lastReadDate?: string;
  badges: Badge[];
  readingHistory: ReadingHistoryItem[];
  followedAuthors: string[];
}

export interface StoryReactions {
  love: number;
  clap: number;
  fire: number;
  wow: number;
  sad: number;
  thanks: number;
}

export interface Story {
  id: string;
  title: string;
  category: Category;
  snippet: string;
  fullContent: string;
  moral?: string;
  coverImage: string;
  author: string;
  readTime: string;
  views: number;
  likes: number;
  averageRating?: number;
  totalRatings?: number;
  isFeatured?: boolean;
  isSponsored?: boolean;
  sponsorName?: string;
  affiliateLink?: { text: string; url: string };
  videoUrl?: string;
  audioNarratorText?: string;
  date: string;
  comments?: Comment[];
  reactions?: StoryReactions;
  isUserPublished?: boolean;
  contestId?: string;
  contestVotes?: number;
}

export interface StoryContest {
  id: string;
  title: string;
  theme: string;
  description: string;
  prize: string;
  deadline: string;
  bannerImage: string;
  entriesCount: number;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorAvatar?: string;
  title: string;
  content: string;
  likes: number;
  date: string;
  commentsCount: number;
  category?: string;
}

export interface ReaderSettings {
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  theme: 'dark' | 'light' | 'sepia';
  lineSpacing: 'normal' | 'relaxed' | 'loose';
}

export type AIStoryModalMode = 'create' | 'continue' | 'moral' | 'recommend' | 'ask';
