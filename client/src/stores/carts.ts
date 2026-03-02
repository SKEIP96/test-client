// src/stores/carts.ts
"use client";

import { create } from "zustand";
import * as ordersApi from "@/libs/api/orders";
import { getApiErrorMessage } from "@/libs/api/client";
import { useUiStore } from "@/stores/uiStore";

type CartState = {
  current: ordersApi.OrderDto | null;
  isLoading: boolean;
  error: string | null;

  load: () => Promise<void>;
  addItemByProductId: (productId: number, quantity?: number) => Promise<void>;
  setQty: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  checkout: () => Promise<ordersApi.OrderDto>;
  clearError: () => void;

  reset: () => void; // ✅ ADDED
};

function applyAdjustmentsToasts(order: any) {
  const adjustments = order?.adjustments ?? [];
  if (!adjustments.length) return;

  const ui = useUiStore.getState();

  for (const a of adjustments) {
    if (a.type === "REMOVED") {
      ui.pushToast({
        type: "error",
        message: `Removed: ${a.title} (out of stock)`,
      });
    } else if (a.type === "REDUCED") {
      ui.pushToast({
        type: "info",
        message: `Adjusted: ${a.title} qty ${a.from} → ${a.to}`,
      });
    }
  }
}

export const useCartStore = create<CartState>((set) => ({
  current: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  // ✅ ADDED: сброс корзины (используем на logout)
  reset: () => set({ current: null, error: null, isLoading: false }),

  load: async () => {
    try {
      set({ isLoading: true, error: null });
      const order = await ordersApi.getCurrentOrder();
      set({ current: order });
      applyAdjustmentsToasts(order);
    } catch (e) {
      set({ current: null, error: getApiErrorMessage(e) });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  addItemByProductId: async (productId, quantity = 1) => {
    try {
      set({ isLoading: true, error: null });
      const order = await ordersApi.addItemToCurrentOrder(productId, quantity);
      set({ current: order });
      applyAdjustmentsToasts(order);
    } catch (e) {
      set({ error: getApiErrorMessage(e) });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  setQty: async (productId, quantity) => {
    try {
      set({ isLoading: true, error: null });
      const order = await ordersApi.setCurrentOrderItemQty(productId, quantity);
      set({ current: order });
      applyAdjustmentsToasts(order);
    } catch (e) {
      set({ error: getApiErrorMessage(e) });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      const order = await ordersApi.setCurrentOrderItemQty(productId, 0);
      set({ current: order });
      applyAdjustmentsToasts(order);
    } catch (e) {
      set({ error: getApiErrorMessage(e) });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  checkout: async () => {
    try {
      set({ isLoading: true, error: null });
      const paidOrder = await ordersApi.checkoutCurrentOrder();
      set({ current: null }); // после checkout текущая корзина очищается
      return paidOrder;
    } catch (e) {
      set({ error: getApiErrorMessage(e) });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },
}));
