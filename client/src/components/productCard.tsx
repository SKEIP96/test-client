"use client";

import { ProductWithStock } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatMoney } from "@/lib/format";

type Props = {
  product: ProductWithStock;
};

export function ProductCard({ product }: Props) {
  const { addItemByProductId, isLoading } = useCart();

  const outOfStock = product.in_stock <= 0;

  return (
    <Card className={["relative overflow-hidden transition hover:shadow-md", outOfStock ? "bg-muted/80" : "bg-card",].join(" ")}>
      {/* 🔴 DIAGONAL OUT OF STOCK BANNER */}
      {outOfStock && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="rotate-[-20deg]">
            <div className="border-4 border-red-600 px-12 py-4 text-3xl font-bold uppercase tracking-wide text-red-600">
              OUT OF STOCK
            </div>
          </div>
        </div>
      )}

      {/* 🧊 Серый фон + приглушение ТОЛЬКО контента */}
      <div
        className={
          outOfStock ? " opacity-60 grayscale" : ""
        }
      >
        <CardContent className="space-y-3 p-6">
          <h3 className="text-base font-semibold">{product.title}</h3>

          <div className="text-2xl font-bold">
            ${formatMoney(product.price)}
          </div>

          <p className="text-sm text-muted-foreground">
            Workshop-grade essentials for everyday builds.
          </p>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full"
            variant="secondary"
            disabled={outOfStock || isLoading}
            onClick={() => addItemByProductId(product.id, 1)}
          >
            Add to cart
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
