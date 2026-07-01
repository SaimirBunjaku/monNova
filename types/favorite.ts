import type { Product } from "@/types/product";

export interface FavoriteItem {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  category: string;
  rating: number;
}

export function productToFavoriteItem(product: Product): FavoriteItem {
  return {
    productId: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    category: product.category,
    rating: product.rating,
  };
}

export function favoriteToProduct(item: FavoriteItem): Product {
  return {
    id: item.productId,
    title: item.title,
    description: "",
    category: item.category,
    price: item.price,
    discountPercentage: item.discountPercentage,
    rating: item.rating,
    stock: 99,
    thumbnail: item.thumbnail,
    images: item.thumbnail ? [item.thumbnail] : [],
  };
}
