"use client";

import { create } from "zustand";
import * as authApi from "@/libs/api/auth";
import { getApiErrorMessage } from "@/libs/api/client";

export type UserRole = "USER" | "ADMIN";

export type AuthUser = authApi.UserDto & {
  role?: UserRole; // role приходит с бэка, но держим optional на случай старых данных
};

type AuthState = {
  user: AuthUser | null;

  // user actions loading
  isLoading: boolean;

  // silent session check
  isChecking: boolean;

  error: string | null;

  // computed helpers
  isAdmin: boolean;

  clearError: () => void;

  fetchMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isChecking: false,
  error: null,

  isAdmin: false,

  clearError: () => set({ error: null }),

  // тихая проверка сессии (для Header/layout)
  fetchMe: async () => {
    try {
      set({ isChecking: true });
      const user = (await authApi.me()) as AuthUser;

      set({
        user,
        isAdmin: user?.role === "ADMIN",
      });
    } catch {
      set({ user: null, isAdmin: false });
    } finally {
      set({ isChecking: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      await authApi.login(email, password);

      const user = (await authApi.me()) as AuthUser;

      set({
        user,
        isAdmin: user?.role === "ADMIN",
      });
    } catch (e) {
      set({ error: getApiErrorMessage(e), user: null, isAdmin: false });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });
      await authApi.register({ name, email, password });
    } catch (e) {
      set({ error: getApiErrorMessage(e), user: null, isAdmin: false });
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
      set({ user: null, isAdmin: false, isLoading: false });
    }
  },
}));
