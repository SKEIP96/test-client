"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ProductWithStock } from "../types/product";
import { getApiErrorMessage } from "../libs/api/client";
import { getProductsPage, type SortKey } from "../libs/api/product";

type Params = {
  q?: string;
  sort?: SortKey;
  take?: number;
};

export const useProducts = (params?: Params) => {
  const q = params?.q ?? "";
  const sort = params?.sort ?? "new";
  const take = params?.take ?? 12;

  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // защита от гонок запросов (быстро меняют q/sort)
  const requestKeyRef = useRef(0);

  const loadFirst = async () => {
    const key = ++requestKeyRef.current;
    try {
      setIsLoading(true);
      setError(null);

      const res = await getProductsPage({
        take,
        cursor: null,
        q,
        sort,
      });

      if (requestKeyRef.current !== key) return;

      setProducts(res.items);
      setNextCursor(res.nextCursor);
    } catch (e) {
      if (requestKeyRef.current !== key) return;
      setError(getApiErrorMessage(e));
    } finally {
      if (requestKeyRef.current === key) setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (nextCursor == null || isLoadingMore) return;

    const key = requestKeyRef.current;
    try {
      setIsLoadingMore(true);
      setError(null);

      const res = await getProductsPage({
        take,
        cursor: nextCursor,
        q,
        sort,
      });

      if (requestKeyRef.current !== key) return;

      setProducts((prev) => [...prev, ...res.items]);
      setNextCursor(res.nextCursor);
    } catch (e) {
      if (requestKeyRef.current !== key) return;
      setError(getApiErrorMessage(e));
    } finally {
      if (requestKeyRef.current === key) setIsLoadingMore(false);
    }
  };

  // загружаем при старте и при смене q/sort/take
  useEffect(() => {
    loadFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort, take]);

  const canLoadMore = useMemo(() => nextCursor !== null, [nextCursor]);

  return {
    products,
    isLoading,
    isLoadingMore,
    error,
    canLoadMore,
    loadMore,
    refetch: loadFirst,
  };
};
