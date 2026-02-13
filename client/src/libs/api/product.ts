import { apiClient } from "./client";
import type { ProductWithStock } from "../../types/product";

// сортировка как на бэке
export type SortKey = "new" | "price_asc" | "price_desc" | "stock_desc";

// ответ пагинации от бэка
export type ProductsPageDto = {
  items: ProductWithStock[];
  nextCursor: number | null;
};

// ✅ новый метод для server pagination (Load more)
export async function getProductsPage(params?: {
  take?: number;
  cursor?: number | null;
  q?: string;
  sort?: SortKey;
}): Promise<ProductsPageDto> {
  const res = await apiClient.get<ProductsPageDto>("/products", { params });
  return res.data;
}

// (опционально) старый метод "получить всё" — лучше не использовать в каталоге.
// Можно удалить, но оставляю для совместимости, чтобы проект не упал сразу.
export async function getProductsAll(): Promise<ProductWithStock[]> {
  const res = await apiClient.get<ProductsPageDto>("/products", { params: { take: 1000 } });
  return res.data.items;
}

export type CreateProductDto = {
  title: string;
  price: number | string;
  in_stock: number;
};

export async function createProduct(dto: CreateProductDto): Promise<ProductWithStock> {
  const { data } = await apiClient.post<ProductWithStock>("/products", dto);
  return data;
}