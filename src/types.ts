export type Category =
  | 'सबै'
  | 'लोककथा'
  | 'प्रेरणादायी'
  | 'जीवनकथा'
  | 'रहस्य'
  | 'भावनात्मक'
  | 'सत्यकथा';

export interface Comment {
  id: string;
  userName: string;
  text: string;
  date: string;
  rating?: number;
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
  isFeatured?: boolean;
  videoUrl?: string;
  audioNarratorText?: string;
  date: string;
  comments?: Comment[];
}

export interface ReaderSettings {
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  theme: 'dark' | 'light' | 'sepia';
  lineSpacing: 'normal' | 'relaxed' | 'loose';
}

export type AIStoryModalMode = 'create' | 'continue' | 'moral';
