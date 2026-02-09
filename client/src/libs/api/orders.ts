// src/libs/api/orders.ts
import { apiClient } from "./client";

export type OrderDto = {
  id: number;
  status: "CART" | "PAID" | "CANCELED";
  created_at: string;
  itemsCount: number;
  total: number;
  items: Array<{
    id: number; // orderItem id
    quantity: number;
    product: {
      id: number; // product id
      title: string;
      price: string; // "15.75"
    };
  }>;
};

export async function getCurrentOrder(): Promise<OrderDto> {
  const { data } = await apiClient.get("/orders/current");
  return data;
}

export async function addItemToCurrentOrder(
  productId: number,
  quantity = 1
): Promise<OrderDto> {
  const { data } = await apiClient.post("/orders/current/items", {
    productId,
    quantity,
  });
  return data;
}

export async function setCurrentOrderItemQty(
  productId: number,
  quantity: number
): Promise<OrderDto> {
  const { data } = await apiClient.patch(`/orders/current/items/${productId}`, {
    quantity,
  });
  return data;
}

export async function checkoutCurrentOrder(): Promise<OrderDto> {
  const { data } = await apiClient.post("/orders/current/checkout");
  return data;
}

export async function listOrders(): Promise<OrderDto[]> {
  const { data } = await apiClient.get("/orders");
  return data;
}

export async function getOrderById(orderId: number): Promise<OrderDto> {
  const { data } = await apiClient.get(`/orders/${orderId}`);
  // твой бэк местами возвращает { order: ... }, местами просто order
  return data?.order ?? data;
}

