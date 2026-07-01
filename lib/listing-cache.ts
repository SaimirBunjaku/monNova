import type { Product } from "@/types/product";
import { getAllProducts } from "@/lib/api";

interface CatalogCache {
  products: Product[];
  total: number;
}

let catalogCache: CatalogCache | null = null;
let catalogLoadPromise: Promise<CatalogCache> | null = null;

export function getCachedCatalog(): CatalogCache | null {
  return catalogCache;
}

export async function loadCatalogWithCache(): Promise<CatalogCache> {
  if (catalogCache) {
    return catalogCache;
  }

  if (catalogLoadPromise) {
    return catalogLoadPromise;
  }

  catalogLoadPromise = getAllProducts()
    .then((data) => {
      catalogCache = {
        products: data.products,
        total: data.total,
      };
      return catalogCache;
    })
    .finally(() => {
      catalogLoadPromise = null;
    });

  return catalogLoadPromise;
}
