"use client";

import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  createdAt: number;
  durationMs: number;
};

type UiState = {
  toasts: ToastItem[];
  pushToast: (args: {
    message: string;
    type?: ToastType;
    title?: string;
    durationMs?: number;
  }) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],

  pushToast: ({ message, type = "info", title, durationMs = 3500 }) => {
    const id = makeId();
    const toast: ToastItem = {
      id,
      type,
      title,
      message,
      createdAt: Date.now(),
      durationMs,
    };

    set((s) => ({ toasts: [toast, ...s.toasts].slice(0, 5) }));

    // auto-remove
    window.setTimeout(() => {
      // remove only if still exists
      const exists = get().toasts.some((t) => t.id === id);
      if (exists) get().removeToast(id);
    }, durationMs);

    return id;
  },

  removeToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },

  clearToasts: () => set({ toasts: [] }),
}));
