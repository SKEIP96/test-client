"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, isChecking, fetchMe } = useAuthStore();

  // если пользователь обновил страницу — подтягиваем сессию
  useEffect(() => {
    if (!user) fetchMe();
  }, []);

  // guard
  useEffect(() => {
    if (isChecking) return;

    // если не залогинен — на /login
    if (!user) {
      router.replace("/login");
      return;
    }

    // если не админ — на главную
    if (user && !isAdmin) {
      router.replace("/");
    }
  }, [user, isAdmin, isChecking, router]);

  if (isChecking || !user) {
    return (
      <div className="rounded-lg border bg-card p-6 text-muted-foreground">
        Checking access...
      </div>
    );
  }

  if (!isAdmin) {
    return null; // редирект уже пошёл
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
          <p className="text-muted-foreground">
            Manage catalog and operations.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalog</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/admin/products">
            <Button variant="outline">Manage products</Button>
          </Link>

          <div className="text-sm text-muted-foreground">
            (Next step: products CRUD)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
