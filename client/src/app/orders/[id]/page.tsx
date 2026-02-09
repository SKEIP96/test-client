"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import * as ordersApi from "@/libs/api/orders";
import { getApiErrorMessage } from "@/libs/api/client";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<ordersApi.OrderDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!orderId || Number.isNaN(orderId)) {
          setError("Invalid order id");
          return;
        }

        const data = await ordersApi.getOrderById(orderId);
        setOrder(data);
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
  }, [orderId]);

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Order details {order ? `#${order.id}` : ""}
        </h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/orders")}>
            Back
          </Button>
          <Button variant="secondary" onClick={() => router.push("/cart")}>
            Current order
          </Button>
        </div>
      </div>

      {isLoading && <div>Loading...</div>}

      {error && (
        <div className="rounded border border-red-500 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {order && (
        <div className="space-y-4">
          <div className="rounded border p-4 space-y-2">
            <div className="flex justify-between">
              <span className="opacity-80">Status</span>
              <span>{order.status}</span>
            </div>

            <div className="flex justify-between">
              <span className="opacity-80">Created</span>
              <span>{new Date(order.created_at).toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="opacity-80">Items</span>
              <span>{order.itemsCount}</span>
            </div>

            <div className="flex justify-between">
              <span className="opacity-80">Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          <div className="rounded border p-4">
            <h2 className="font-semibold mb-3">Items</h2>

            <div className="space-y-2">
              {order.items.map((it) => {
                const price = Number(it.product.price);
                const lineTotal = price * it.quantity;

                return (
                  <div
                    key={it.id}
                    className="flex items-center justify-between border rounded p-2"
                  >
                    <div>
                      <div className="font-medium">{it.product.title}</div>
                      <div className="text-sm opacity-80">
                        ${it.product.price} × {it.quantity}
                      </div>
                    </div>

                    <div className="font-semibold">
                      ${lineTotal.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
