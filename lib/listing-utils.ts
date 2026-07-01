import type { Product } from "@/types/product";
import { getEffectiveDiscount, getReviewCount } from "@/lib/product-utils";

export type SortOption =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "discount"
  | "name";

export const SORT_LABELS: Record<SortOption, string> = {
  popular: "Popular",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  discount: "Discount",
  name: "Name",
};

export function matchesSearchQuery(product: Product, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  const title = product.title.toLowerCase();
  const brand = (product.brand ?? "").toLowerCase();

  return title.includes(normalized) || brand.includes(normalized);
}

export function filterSearchResults(
  products: Product[],
  query: string,
): Product[] {
  return products.filter((product) => matchesSearchQuery(product, query));
}

export function sortProducts(
  products: Product[],
  sort: SortOption,
): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "discount":
      return sorted.sort((a, b) => {
        const discountA = getEffectiveDiscount(a.discountPercentage);
        const discountB = getEffectiveDiscount(b.discountPercentage);
        if (discountB !== discountA) {
          return discountB - discountA;
        }
        return b.rating - a.rating;
      });
    case "name":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "popular":
    default:
      return sorted.sort((a, b) => {
        const scoreA = a.rating * (getReviewCount(a) + 1);
        const scoreB = b.rating * (getReviewCount(b) + 1);
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return b.rating - a.rating;
      });
  }
}
