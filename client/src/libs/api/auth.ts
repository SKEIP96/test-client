// src/libs/api/auth.ts
import { apiClient } from "./client";

export type UserRole = "USER" | "ADMIN";

export type UserDto = {
  id: number;
  email?: string;
  name?: string;
  role?: UserRole;
};

export type RegisterDto = {
  name: string;
  email: string;
  password: string;
};

export async function login(email: string, password: string) {
  await apiClient.post("/auth/login", { email, password });
}

export async function register(dto: RegisterDto) {
  await apiClient.post("/auth/register", dto);
}

export async function logout() {
  await apiClient.post("/auth/logout");
}

export async function me(): Promise<UserDto> {
  const { data } = await apiClient.get("/auth/me");
  return data;
}

export async function refresh() {
  await apiClient.post("/auth/refresh");
}
