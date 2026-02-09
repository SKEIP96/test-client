"use client";

import { create } from "zustand";
import * as authApi from "@/libs/api/auth";
import { getApiErrorMessage } from "@/libs/api/client";

type AuthState = {
  user: authApi.UserDto | null;

  // user actions loading
  isLoading: boolean;

  // silent session check
  isChecking: boolean;

  error: string | null;

  clearError: () => void;

  fetchMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>; // ✅ ADDED
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isChecking: false,
  error: null,

  clearError: () => set({ error: null }),

  // тихая проверка сессии (для Header/layout)
  fetchMe: async () => {
    try {
      set({ isChecking: true });
      const user = await authApi.me();
      set({ user });
    } catch {
      set({ user: null });
    } finally {
      set({ isChecking: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      await authApi.login(email, password);
      const user = await authApi.me();
      set({ user });
    } catch (e) {
      set({ error: getApiErrorMessage(e), user: null });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ ADDED: регистрация (после успеха обычно редиректим на /login)
  register: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });
      await authApi.register({ name, email, password });
    } catch (e) {
      set({ error: getApiErrorMessage(e), user: null });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await authApi.logout();
    } finally {
      set({ user: null, isLoading: false });
    }
  },
}));
