"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setNavigator } from "@/lib/navigation";

export function NavigationBridge() {
  const router = useRouter();

  useEffect(() => {
    setNavigator((path: string) => router.push(path));
  }, [router]);

  return null;
}
