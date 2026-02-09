// src/hooks/useCart.ts
"use client";

import { useCartStore } from "@/stores/carts";

export const useCart = () => {
  // Берём только store values без "?? []" внутри селектора
  const current = useCartStore((s) => s.current);

  const isLoading = useCartStore((s) => s.isLoading);
  const error = useCartStore((s) => s.error);

  const load = useCartStore((s) => s.load);
  const addItemByProductId = useCartStore((s) => s.addItemByProductId);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const checkout = useCartStore((s) => s.checkout);
  const clearError = useCartStore((s) => s.clearError);

  // Производные значения вычисляем тут (это безопасно)
  const items = current?.items ?? [];
  const total = current?.total ?? 0;
  const itemsCount = current?.itemsCount ?? 0;

  return {
    current,
    items,
    total,
    itemsCount,
    isLoading,
    error,
    clearError,
    load,
    addItemByProductId,
    setQty,
    removeItem,
    checkout,
  };
};
