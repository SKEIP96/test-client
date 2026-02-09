import axios, { AxiosError } from "axios";
import { goLogin } from "@/lib/navigation";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL="http://localhost:4000",
  withCredentials: true,
  timeout: 10000,
});

// Extract backend message safely
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || error.message || "Request failed";
  }
  return "Request failed";
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Глобальный редирект на /login при 401
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      // Чтобы не зациклиться: если мы уже на /login — не редиректим снова
      if (status === 401 && typeof window !== "undefined") {
        const path = window.location.pathname;

        const isAuthPage = path.startsWith("/login") || path.startsWith("/register");

        if (!isAuthPage) {
          goLogin();
        }
      }
    }

    return Promise.reject(error);
  }
);
