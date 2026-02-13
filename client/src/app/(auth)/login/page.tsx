"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await login(email, password);
      router.push("/"); // после логина на главную (где товары)
    } catch {
      // error уже в сторе
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded border p-6"
      >
        <h1 className="text-xl font-semibold">Login</h1>

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center">
          No account?{" "}
          <a href="/register" className="underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
