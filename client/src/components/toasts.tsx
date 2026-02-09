"use client";

import { useUiStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/button";

function typeStyles(type: "success" | "error" | "info") {
  switch (type) {
    case "success":
      return "bg-emerald-600 text-white border-emerald-700";
    case "error":
      return "bg-red-600 text-white border-red-700";
    default:
      return "bg-gray-800 text-white border-gray-700";
  }
}

function typeLabel(type: "success" | "error" | "info") {
  if (type === "success") return "Success";
  if (type === "error") return "Error";
  return "Info";
}

export function Toasts() {
  const toasts = useUiStore((s) => s.toasts);
  const removeToast = useUiStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-[320px] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-md border p-3 shadow ${typeStyles(t.type)}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs opacity-70">
                {t.title ?? typeLabel(t.type)}
              </div>
              <div className="mt-1 text-sm">{t.message}</div>
            </div>

            <Button
              variant="outline"
              className="px-2 py-1 h-auto text-xs"
              onClick={() => removeToast(t.id)}
            >
              ✕
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
