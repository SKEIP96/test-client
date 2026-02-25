"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import * as ordersApi from "@/libs/api/orders";
import { getApiErrorMessage } from "@/libs/api/client";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<ordersApi.OrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const list = await ordersApi.listOrders();
        setOrders(list);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          router.push("/login");
          return;
        }
        setError(getApiErrorMessage(e));
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My orders</h1>
        <Button variant="outline" onClick={() => router.push("/cart")}>
          Current order
        </Button>
      </div>

      {isLoading && <div>Loading...</div>}

      {error && (
        <div className="rounded border border-red-500 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="rounded border p-4 opacity-80">No orders yet</div>
      )}

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded border p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Order #{o.id}</div>
              <div className="text-sm opacity-80">{o.status}</div>
            </div>

            <div className="mt-2 text-sm opacity-80">
              {new Date(o.created_at).toLocaleString()}
            </div>

            <div className="mt-2 flex justify-between">
              <span>Items:</span>
              <span>{o.itemsCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span>${Number(o.total).toFixed(2)}</span>
            </div>

            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={() => router.push(`/orders/${o.id}`)}
              >
                View details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
