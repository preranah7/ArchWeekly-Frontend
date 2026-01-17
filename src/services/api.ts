//src/services/api.ts
import axios, { AxiosError } from 'axios';
import type {
  AuthResponse,
  OTPResponse,
  OTPRequest,
  OTPVerifyRequest,
  SubscribeRequest,
  SubscribeResponse,
  SubscriberStats,
  SubscriberCount,
  ReferralStats,
  NewsletterResponse,
  NewsletterArchiveResponse,
  NewsletterByIdResponse,
  TopArticlesResponse,
  CategoryArticlesResponse,
  NewsletterSendResult,
  TestEmailRequest,
  TestEmailResponse,
} from '../types';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (parsed.state?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.token}`;
        }
      } catch {
        // Silent fail - token parsing error
        localStorage.removeItem('auth-storage');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTHENTICATION ENDPOINTS =====
export const authAPI = {
  sendOTP: (email: string) =>
    api.post<OTPResponse>('/auth/send-otp', { email } as OTPRequest),
  
  verifyOTP: (email: string, otp: string) =>
    api.post<AuthResponse>('/auth/verify-otp', { email, otp } as OTPVerifyRequest),
  
  getMe: () =>
    api.get<{ user: AuthResponse['user'] }>('/auth/me'),
  
  logout: () =>
    api.post('/auth/logout'),
};

// ===== SUBSCRIBER ENDPOINTS =====
export const subscriberAPI = {
  subscribe: (email: string, referredBy?: string) =>
    api.post<SubscribeResponse>('/subscribers/subscribe', { email, referredBy } as SubscribeRequest),
  
  unsubscribe: (email: string) =>
    api.delete(`/subscribers/unsubscribe/${email}`),
  
  getStats: () =>
    api.get<SubscriberStats>('/subscribers/stats'),
  
  getCount: () =>
    api.get<SubscriberCount>('/subscribers/count'),
  
  getReferralStats: (email: string) =>
    api.get<ReferralStats>(`/subscribers/referrals/${email}`),
  
  getAll: (page = 1, limit = 50) =>
    api.get('/subscribers', { params: { page, limit } }),
};

// ===== NEWSLETTER ENDPOINTS =====
export const newsletterAPI = {
  getLatest: () =>
    api.get<NewsletterResponse>('/newsletters/latest'),
  
  getArchive: (page = 1) =>
    api.get<NewsletterArchiveResponse>('/newsletters', { params: { page } }),
  
  getById: (id: string) =>
    api.get<NewsletterByIdResponse>(`/newsletters/${id}`),
  
  getTopArticles: (limit = 10) =>
    api.get<TopArticlesResponse>('/newsletters/top', { params: { limit } }),
  
  getByCategory: (category: string) =>
    api.get<CategoryArticlesResponse>(`/newsletters/category/${category}`),
  
  sendToAll: () =>
    api.post<NewsletterSendResult>('/newsletters/send'),
  
  sendTest: (email?: string) =>
    api.post<TestEmailResponse>('/newsletters/test', { email } as TestEmailRequest),
  
  triggerWorkflow: () =>
    api.post<NewsletterSendResult>('/newsletters/trigger', {}, {
      timeout: 300000,
    }),
};

// ===== HEALTH CHECK =====
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch {
    return { status: 'error', message: 'API is down' };
  }
};

export default api;