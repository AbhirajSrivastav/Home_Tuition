import { create } from 'zustand';
import { authAPI } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'parent' | 'tutor' | 'admin';
  avatar_url?: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  signup: (
    email: string,
    password: string,
    name: string,
    role: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearError: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  signup: async (email, password, name, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.signup({
        email,
        password,
        name,
        role: role as 'student' | 'parent' | 'tutor',
      });

      const { userId, token, refreshToken } = response.data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      set({
        user: {
          id: userId,
          email,
          name,
          role: role as 'student' | 'parent' | 'tutor' | 'admin',
        },
        accessToken: token,
        refreshToken: refreshToken,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Signup failed',
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });

      const { userId, token, refreshToken, role } = response.data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      set({
        user: {
          id: userId,
          email,
          name: '', // Will be fetched from profile endpoint
          role,
        },
        accessToken: token,
        refreshToken: refreshToken,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      error: null,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },

  hydrate: () => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token && refreshToken) {
      set({
        accessToken: token,
        refreshToken: refreshToken,
      });
    }
  },
}));
