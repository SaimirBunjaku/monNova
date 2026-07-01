import type { Product } from "@/types/product";

export interface CartItem {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  category: string;
  stock: number;
  quantity: number;
}

export interface CartSummary {
  itemCount: number;
  uniqueCount: number;
  subtotal: number;
  savings: number;
  shipping: number;
  tax: number;
  total: number;
  qualifiesForFreeShipping: boolean;
  amountUntilFreeShipping: number;
}

export function productToCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    category: product.category,
    stock: product.stock,
    quantity: Math.max(1, Math.floor(quantity)),
  };
}
