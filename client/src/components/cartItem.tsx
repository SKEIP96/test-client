// src/components/cartItem.tsx
"use client";

import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";

type Props = {
  item: {
    id: number; // orderItem id
    quantity: number;
    product: {
      id: number; // product id
      title: string;
      price: string;
    };
  };
};

export const CartItem = ({ item }: Props) => {
  const { removeItem, setQty, isLoading } = useCart();

  const priceNum = Number(item.product.price);
  const lineTotal = priceNum * item.quantity;

  return (
    <div className="flex items-center justify-between border p-2 rounded">
      <div>
        <div className="font-medium">{item.product.title}</div>
        <div className="text-sm opacity-80">
          ${item.product.price} × {item.quantity} = ${lineTotal.toFixed(2)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={isLoading || item.quantity <= 1}
          onClick={() => setQty(item.product.id, item.quantity - 1)}
        >
          -
        </Button>

        <span className="w-8 text-center">{item.quantity}</span>

        <Button
          variant="outline"
          disabled={isLoading}
          onClick={() => setQty(item.product.id, item.quantity + 1)}
        >
          +
        </Button>

        <Button
          variant="destructive"
          disabled={isLoading}
          onClick={() => removeItem(item.product.id)}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};
