"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useCart } from "@/hooks/use-cart";

export function SiteHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const { user, logout, isLoading: authLoading } = useAuthStore();
  const { itemsCount } = useCart();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const onLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-tight">
            Workshop Supply
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost">Products</Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost">Cart{itemsCount ? ` (${itemsCount})` : ""}</Button>
            </Link>
            <Link href="/orders">
              <Button variant="ghost">Orders</Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {!user ? (
            <>
              <Link href="/login">
                <Button variant="outline" disabled={authLoading}>
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button disabled={authLoading}>Register</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="hidden sm:block text-sm text-muted-foreground">
                {user.name ?? user.email ?? `User #${user.id}`}
              </div>
              <Button variant="destructive" onClick={onLogout} disabled={authLoading}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
