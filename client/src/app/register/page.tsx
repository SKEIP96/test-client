"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();

  const { register, isLoading, error } = useAuthStore();
  const pushToast = useUiStore((s) => s.pushToast);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(name, email, password);

      pushToast({ type: "success", message: "Account created. Please login." });
      router.push("/login");
    } catch (e) {
      // ошибка уже в сторе, но покажем toast тоже
      pushToast({
        type: "error",
        message: "Registration failed. Check your data.",
      });
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
    <Card className="w-[340px]">
        <CardHeader>
    <CardTitle>Register</CardTitle>
  </CardHeader>
  <CardContent>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 w-full"
      >

        <Input
          className="w-full rounded border px-3 py-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          className="w-full rounded border px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          className="w-full rounded border px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      </CardContent>
    </Card>
    </div>
  );
}
