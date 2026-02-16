// src/libs/api/product.ts
import { apiClient } from "./client";
import type { ProductWithStock } from "@/types/product";

export type SortKey = "new" | "price_asc" | "price_desc";

export type ProductsPageDto = {
  items: ProductWithStock[];
  page: number;
  take: number;
  hasMore: boolean;
};

export async function getProductsPage(params: {
  take: number;
  page: number;
  q?: string;
  sort?: SortKey;
  inStockOnly?: boolean;
}): Promise<ProductsPageDto> {
  const { data } = await apiClient.get<ProductsPageDto>("/products", { params });
  return data;
}
