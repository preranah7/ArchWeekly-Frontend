//src/types/index.ts
// ===== USER & AUTH TYPES =====
export interface User {
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface OTPResponse {
  message: string;
  email: string;
  expiresIn: string;
  otp?: string; // Only in development
  note?: string;
}

export interface OTPRequest {
  email: string;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
}

// ===== SUBSCRIBER TYPES =====
export interface Subscriber {
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
  referralCode: string;
  referredBy?: string | null;
}

export interface SubscribeRequest {
  email: string;
  referredBy?: string;
}

export interface SubscribeResponse {
  message: string;
  subscriber: {
    email: string;
    referralCode: string;
    subscribedAt: string;
  };
}

export interface SubscriberStats {
  total: number;
  active: number;
  inactive: number;
}

export interface SubscriberCount {
  activeSubscribers: number;
  totalSubscribers: number;
  verifiedUsers: number;
  inactiveSubscribers: number;
  totalUnique: number;
  breakdown: {
    subscribersOnly: number;
    verifiedUsersOnly: number;
    combined: number;
  };
}

export interface ReferralStats {
  email: string;
  referralCode: string;
  totalReferrals: number;
  referrals: Array<{
    email: string;
    subscribedAt: string;
  }>;
}

// ===== ARTICLE TYPES =====
export interface Article {
  _id: string;
  title: string;
  url: string;
  source: string;
  description?: string;
  score?: number;
  category?: string;
  reasoning?: string;
  keyInsights?: string[];
  upvotes?: number;
  comments?: number;
  rank?: number;
  scrapedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ===== NEWSLETTER TYPES =====
export interface NewsletterArticle {
  title: string;
  url: string;
  source: string;
  description?: string;
  category?: string;
  score?: number;
  rank?: number;
  reasoning?: string;
  keyInsights?: string[];
}

export interface Newsletter {
  _id: string;
  title: string;
  date: string;
  articles: NewsletterArticle[];
  sentTo?: number;
  sentAt?: string;
  status: 'draft' | 'sent';
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSummary {
  id: string;
  title: string;
  date: string;
  sentAt?: string;
  sentTo?: number;
  articleCount: number;
}

export interface NewsletterResponse {
  newsletter: {
    id?: string;
    title: string;
    date: string;
    sentAt?: string;
    sentTo?: number;
    totalArticles: number;
    status?: string;
  };
  articles: NewsletterArticle[];
}

export interface NewsletterArchiveResponse {
  articles: Article[];
  pagination: Pagination;
}

export interface NewsletterByIdResponse {
  newsletter: {
    id: string;
    title: string;
    date: string;
    sentAt?: string;
    sentTo?: number;
    status: string;
  };
  articles: NewsletterArticle[];
}

export interface TopArticlesResponse {
  count: number;
  articles: Article[];
}

export interface CategoryArticlesResponse {
  category: string;
  count: number;
  articles: Article[];
}

// ===== NEWSLETTER SENDING TYPES (ADMIN) =====
export interface NewsletterSendResult {
  message: string;
  stats: {
    total: number;
    sent: number;
    failed: number;
  };
  newsletterId?: string;
  failedEmails?: Array<{
    email: string;
    error?: string;
  }>;
}

export interface TestEmailRequest {
  email?: string;
}

export interface TestEmailResponse {
  message: string;
  email: string;
  emailId?: string;
}

// ===== PAGINATION =====
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// ===== API ERROR TYPES =====
export interface APIError {
  error: string;
  message?: string;
  details?: any;
}

// ===== FORM TYPES =====
export interface LoginFormData {
  email: string;
  otp: string;
}

export interface SubscribeFormData {
  email: string;
  referredBy?: string;
}
