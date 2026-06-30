import type { Product } from "@/types/product";

export function calculateOriginalPrice(
  price: number,
  discountPercentage: number,
): number {
  if (discountPercentage <= 0) {
    return price;
  }

  return price / (1 - discountPercentage / 100);
}

export function formatDiscount(discountPercentage: number): string {
  const rounded = Math.round(discountPercentage);
  return `-${rounded}%`;
}

export function hasDiscount(product: Product): boolean {
  return product.discountPercentage > 0;
}

export function getReviewCount(product: Product): number {
  return product.reviews?.length ?? 0;
}
