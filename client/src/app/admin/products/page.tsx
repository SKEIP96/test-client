"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useProducts } from "@/hooks/use-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, isAdmin, isChecking, fetchMe } = useAuthStore();

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

  // список товаров (пока без поиска/сортировки — добавим позже)
  const { products, isLoading, error, refetch } = useProducts({
    q: "",
    sort: "new",
    take: 50,
  });

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
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Admin view: manage catalog items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline">Back</Button>
          </Link>
          {/* кнопку Create добавим следующим шагом */}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading…</div>
          )}

          {!isLoading && error && (
            <div className="rounded-md border p-4">
              <div className="font-medium">Couldn’t load products</div>
              <div className="mt-1 text-sm text-muted-foreground">{error}</div>
              <Button className="mt-3" variant="outline" onClick={refetch}>
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div className="text-sm text-muted-foreground">No products.</div>
          )}

          {!isLoading && !error && products.length > 0 && (
            <div className="divide-y rounded-md border">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 p-3"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {p.id} • Price: {p.price} • Stock: {p.in_stock}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Edit/Delete добавим следующим шагом */}
                    <Button variant="outline" size="sm" disabled>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" disabled>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator />
          <div className="text-xs text-muted-foreground">
            Next: enable Create / Edit / Delete (protected by backend admin
            middleware).
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
