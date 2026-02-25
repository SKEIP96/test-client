"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/cartItem";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/uiStore"; // ✅ ADDED

export default function CartPage() {
  const router = useRouter();

  const pushToast = useUiStore((s) => s.pushToast); // ✅ ADDED

  const {
    current,
    items,
    total,
    itemsCount,
    isLoading,
    error,
    clearError,
    load,
    checkout,
  } = useCart();

  useEffect(() => {
    (async () => {
      try {
        await load();
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          router.push("/login");
        } else {
          console.error(e);
        }
        
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckout = async () => {
    try {
      const paidOrder = await checkout();

      // ✅ CHANGED: toast вместо alert
      pushToast({ type: "success", message: `Order #${paidOrder.id} paid` });

      router.push("/orders");
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        router.push("/login");
        return;
      }

      const msg =
        axios.isAxiosError(e)
          ? ((e.response?.data as any)?.message || e.message)
          : "Checkout failed";

      // ✅ ADDED: toast при ошибке checkout
      pushToast({ type: "error", message: msg });
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Current order</h1>
        <Button variant="outline" onClick={() => router.push("/orders")}>
          Orders history
        </Button>
      </div>

      {error && (
        <div className="rounded border border-red-500 p-3">
          <div className="text-red-500 text-sm">{error}</div>
          <div className="mt-2">
            <Button variant="secondary" onClick={clearError}>
              Close
            </Button>
          </div>
        </div>
      )}

      {isLoading && !current && <div>Loading...</div>}

      {current && (
        <div className="rounded border p-4 space-y-2">
          <div className="flex justify-between">
            <span className="opacity-80">Items</span>
            <span>{itemsCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="pt-2">
            <Button
              
              disabled={isLoading || items.length === 0}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}

      {current && items.length === 0 && (
        <div className="rounded border p-4 opacity-80">Cart is empty</div>
      )}

      <div className="space-y-2">
        {items.map((it) => (
          <CartItem key={it.id} item={it} />
        ))}
      </div>
    </div>
  );
}
