export interface Book {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: 'audio' | 'text' | 'audio & text';
  status: 'selected' | 'recommended' | 'suggested';
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
  duration?: number;
}

export interface UserSubscription {
  status: 'basic' | 'premium' | 'premium-plus';
  expiresAt?: Date;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  subscription?: 'free' | 'basic' | 'premium' | 'premium-plus';
}

// NEW: UserBook for library
export interface UserBook {
  bookId: string;
  savedAt: string;
  currentTime: number;
  duration: number;
  finished: boolean;
  finishedAt?: string;
  lastAccessedAt: string;
}

export interface LibraryState {
  savedBooks: UserBook[];
  finishedBooks: UserBook[];
  loading: boolean;
  error: string | null;
}

export interface SubscriptionState {
  subscription: any | null;
  loading: boolean;
  error: string | null;
  processing: boolean;
}

