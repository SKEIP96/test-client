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

export type CreateProductDto = {
  title: string;
  price: string | number;
  in_stock: number;
};

export type UpdateProductDto = Partial<CreateProductDto>;

export async function createProduct(dto: CreateProductDto) {
  const { data } = await apiClient.post("/products", dto);
  return data;
}

export async function updateProduct(id: number, dto: UpdateProductDto) {
  const { data } = await apiClient.patch(`/products/${id}`, dto);
  return data;
}

export async function deleteProduct(id: number) {
  const { data } = await apiClient.delete(`/products/${id}`);
  return data;
}