"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "@/libs/api/client";
import { getProductsPage, SortKey } from "@/libs/api/product";
import type { ProductWithStock } from "@/types/product";

type Options = {
  q?: string;
  sort?: SortKey;
  take?: number;
  inStockOnly?: boolean;
};

export function useProducts(opts?: Options) {
  const q = opts?.q ?? "";
  const sort = opts?.sort ?? "new";
  const take = opts?.take ?? 12;
  const inStockOnly = opts?.inStockOnly ?? false;

  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reqIdRef = useRef(0);

  const loadPage = useCallback(
    async (targetPage: number, mode: "replace" | "append") => {
      const reqId = ++reqIdRef.current;

      try {
        if (mode === "replace") setIsLoading(true);
        else setIsLoadingMore(true);

        setError(null);

        const data = await getProductsPage({
          take,
          page: targetPage,
          q,
          sort,
          inStockOnly,
        });

        if (reqId !== reqIdRef.current) return;

        setHasMore(data.hasMore);
        setPage(data.page);

        setProducts((prev) => (mode === "append" ? [...prev, ...data.items] : data.items));
      } catch (e) {
        if (reqId !== reqIdRef.current) return;
        setError(getApiErrorMessage(e));
        if (mode === "replace") setProducts([]);
      } finally {
        if (reqId === reqIdRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [take, q, sort, inStockOnly]
  );

  // при смене q/sort/inStockOnly/take — заново с page=1
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(false);
    loadPage(1, "replace");
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;
    await loadPage(page + 1, "append");
  }, [hasMore, isLoadingMore, loadPage, page]);

  const refetch = useCallback(async () => {
    await loadPage(1, "replace");
  }, [loadPage]);

  return {
    products,
    page,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    canLoadMore: hasMore,
    loadMore,
    refetch,
  };
}
