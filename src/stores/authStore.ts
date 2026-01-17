//src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      sendOTP: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.sendOTP(email);
          set({ isLoading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || 'Failed to send OTP';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      verifyOTP: async (email: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.verifyOTP(email, otp);
          const { token, user } = response.data;
          
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || 'Failed to verify OTP';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await authAPI.getMe();
          set({ 
            user: response.data.user,
            isAuthenticated: true 
          });
        } catch (error) {
          set({ 
            isAuthenticated: false, 
            token: null, 
            user: null 
          });
        }
      },

      clearError: () => set({ error: null }),
      
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
