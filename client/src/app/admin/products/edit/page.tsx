"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProduct, updateProduct } from "@/libs/api/product";
import type { ProductWithStock } from "@/types/product";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params; // Получаем ID товара из URL

  const [product, setProduct] = useState<ProductWithStock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Загружаем данные товара при загрузке страницы
  useEffect(() => {
    const numericId = Number(id);
    if (!numericId) return;

    const fetchProduct = async () => {
      try {
        const productData = await getProduct(numericId);
        setProduct(productData);
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Функция для отправки данных на сервер и обновления продукта
  const handleSubmit = async () => {
    if (!product) return;

    setIsSaving(true);
    try {
      const numericId = Number(id);
      await updateProduct(numericId, {
        title: product.title,
        price: product.price,
        in_stock: product.in_stock,
      });
      router.push("/admin/products"); // После сохранения редиректим на страницу с товарами
    } catch (e) {
      console.error("Failed to update product", e);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Product</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Title</div>
          <Input
            value={product.title}
            onChange={(e) =>
              setProduct({ ...product, title: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Price</div>
          <Input
            type="number"
            value={product.price}
            onChange={(e) =>
              setProduct({
                ...product,
                price: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Stock</div>
          <Input
            type="number"
            value={product.in_stock}
            onChange={(e) =>
              setProduct({
                ...product,
                in_stock: Number(e.target.value),
              })
            }
          />
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}