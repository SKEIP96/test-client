"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuthStore } from "@/stores/authStore";
import { createProduct } from "@/libs/api/product";
import { getApiErrorMessage } from "@/libs/api/client";
import { useUiStore } from "@/stores/uiStore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AdminNewProductPage() {
  const router = useRouter();
  const { user, isAdmin, isChecking, fetchMe } = useAuthStore();
  const { pushToast } = useUiStore();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<string>("");
  const [inStock, setInStock] = useState<string>("0");
  const [isSaving, setIsSaving] = useState(false);

  // ensure session on refresh
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

  if (isChecking || !user) {
    return (
      <div className="rounded-lg border bg-card p-6 text-muted-foreground">
        Checking access...
      </div>
    );
  }

  if (!isAdmin) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const titleTrim = title.trim();
    const priceNum = Number(price);
    const stockNum = Number(inStock);

    if (!titleTrim) {
      pushToast({ type: "error", message: "Title is required" });
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      pushToast({ type: "error", message: "Price must be a number >= 0" });
      return;
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      pushToast({ type: "error", message: "Stock must be an integer >= 0" });
      return;
    }

    try {
      setIsSaving(true);

      await createProduct({
        title: titleTrim,
        price: priceNum,
        in_stock: stockNum,
      });

      pushToast({ type: "success", message: "Product created" });
      router.push("/admin/products");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      pushToast({ type: "error", message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New product</h1>
          <p className="text-sm text-muted-foreground">
            Create a new catalog item.
          </p>
        </div>

        <Link href="/admin/products">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Title</div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Workbench Clamp"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Price</div>
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 29.90"
                  inputMode="decimal"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">In stock</div>
                <Input
                  value={inStock}
                  onChange={(e) => setInStock(e.target.value)}
                  placeholder="0"
                  inputMode="numeric"
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Create"}
              </Button>

              <Link href="/admin/products">
                <Button type="button" variant="outline" disabled={isSaving}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
