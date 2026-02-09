"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/productCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type SortKey = "new" | "price_asc" | "price_desc" | "stock_desc";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("new");

  // ✅ server pagination + server search/sort
  const {
    products,
    isLoading,
    isLoadingMore,
    error,
    canLoadMore,
    loadMore,
    refetch,
  } = useProducts({ q: query, sort, take: 12 });

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-lg border bg-card p-6">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Workshop Supply
          </h1>
          <p className="text-muted-foreground">
            Tools, materials, and essentials for clean builds — simple checkout,
            clear stock, no noise.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="md:w-[600px] md:h-[40px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Sort</div>

              <ToggleGroup
                type="single"
                value={sort}
                onValueChange={(v) => {
                  if (!v) return;
                  setSort(v as SortKey);
                }}
                className="rounded-md border border-input p-1"
              >
                <ToggleGroupItem
                  value="new"
                  className="h-9 px-4 text-sm data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  Featured
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="price_asc"
                  className="h-9 px-4 text-sm data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  Price ↑
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="price_desc"
                  className="h-9 px-4 text-sm data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  Price ↓
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="stock_desc"
                  className="h-9 px-4 text-sm data-[state=on]:bg-foreground data-[state=on]:text-background"
                >
                  Stock
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="text-foreground font-medium">
              {products.length}
            </span>{" "}
            product(s)
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {isLoading && (
        <div className="rounded-lg border bg-card p-6 text-muted-foreground">
          Loading products...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border bg-card p-6">
          <div className="font-medium">Couldn’t load products</div>
          <div className="text-sm text-muted-foreground mt-1">{error}</div>

          {/* optional retry button without importing Button */}
          <button
            onClick={refetch}
            className="mt-3 inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="rounded-lg border bg-card p-6 text-muted-foreground">
          No products found.
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Load more */}
          <div className="flex justify-center pb-6">
            {canLoadMore ? (
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="inline-flex h-10 min-w-40 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent disabled:opacity-50"
              >
                {isLoadingMore ? "Loading…" : "Load more"}
              </button>
            ) : (
              <div className="text-xs text-muted-foreground">
                That’s everything.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
