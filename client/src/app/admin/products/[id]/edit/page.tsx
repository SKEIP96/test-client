"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; // ✅ CHANGED: useParams

import { useAuthStore } from "@/stores/authStore";
import { getApiErrorMessage } from "@/libs/api/client";
import { useUiStore } from "@/stores/uiStore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { getProduct, updateProduct } from "@/libs/api/product";

export default function AdminEditProductPage() {
  const router = useRouter();

  // ✅ CHANGED: вместо props.params берём id из useParams()
  const routeParams = useParams<{ id: string }>();
  const idStr = routeParams?.id ?? ""; // на всякий случай
  const productId = useMemo(() => Number(idStr), [idStr]);

  const { user, isAdmin, isChecking, fetchMe } = useAuthStore();
  const pushToast = useUiStore((s: any) => s.pushToast);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(""); // строкой удобнее для input
  const [inStock, setInStock] = useState<number>(0);

  // подтянуть сессию при обновлении страницы
  useEffect(() => {
    if (!user) fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // guard
  useEffect(() => {
    if (isChecking) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user && !isAdmin) {
      router.replace("/");
    }
  }, [user, isAdmin, isChecking, router]);

  // загрузка товара
  useEffect(() => {
    if (!isAdmin) return;

    if (!Number.isFinite(productId) || productId <= 0) {
      setError("Invalid product id");
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const p = await getProduct(productId);
        setTitle(p.title ?? "");
        setPrice(String(p.price ?? ""));
        setInStock(Number(p.in_stock ?? 0));
      } catch (e) {
        setError(getApiErrorMessage(e));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [productId, isAdmin]);

  const onSave = async () => {
    const t = title.trim();
    if (!t) {
      setError("Title is required");
      return;
    }

    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError("Price must be a number >= 0");
      return;
    }

    if (!Number.isInteger(Number(inStock)) || Number(inStock) < 0) {
      setError("Stock must be an integer >= 0");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await updateProduct(productId, {
        title: t,
        price: String(priceNum),
        in_stock: Number(inStock),
      });

      pushToast?.({ type: "success", message: "Product updated" });
      router.push("/admin/products");
    } catch (e) {
      const msg = getApiErrorMessage(e);
      setError(msg);
      pushToast?.({ type: "error", message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  if (isChecking || !user) {
    return (
      <div className="rounded-lg border bg-card p-6 text-muted-foreground">
        Checking access...
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit product</h1>
          <p className="text-sm text-muted-foreground">
            Update title, price and stock.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          {/* ✅ CHANGED: было params.id */}
          <CardTitle>Product #{idStr}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : (
            <>
              {error && (
                <div className="rounded-md border p-4">
                  <div className="font-medium">Couldn’t save</div>
                  <div className="mt-1 text-sm text-muted-foreground">{error}</div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Title</div>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Price</div>
                  <Input
                    inputMode="decimal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="12.50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Stock</div>
                  <Input
                    inputMode="numeric"
                    value={String(inStock)}
                    onChange={(e) => setInStock(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-end gap-2">
                <Link href="/admin/products">
                  <Button variant="outline" disabled={isSaving}>
                    Cancel
                  </Button>
                </Link>

                <Button onClick={onSave} disabled={isSaving}>
                  {isSaving ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}