// Базовые данные продукта
export interface ProductBase {
    id: number;
    title: string;
    price: number;
  }
  
  // Продукт с информацией о наличии на складе
  export interface ProductWithStock extends ProductBase {
    in_stock: number;
  }
  
