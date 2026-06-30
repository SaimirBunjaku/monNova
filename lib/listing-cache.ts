import type { Product } from "@/types/product";
import { getAllProducts } from "@/lib/api";

interface CatalogCache {
  products: Product[];
  total: number;
}

let catalogCache: CatalogCache | null = null;
let catalogLoadPromise: Promise<CatalogCache> | null = null;

const searchCache = new Map<string, Product[]>();
const searchLoadPromises = new Map<string, Promise<Product[]>>();

export function getCachedCatalog(): CatalogCache | null {
  return catalogCache;
}

export function clearCatalogCache(): void {
  catalogCache = null;
  catalogLoadPromise = null;
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

export function getCachedSearch(query: string): Product[] | null {
  const normalized = query.trim().toLowerCase();
  return searchCache.get(normalized) ?? null;
}

export function setCachedSearch(query: string, products: Product[]): void {
  const normalized = query.trim().toLowerCase();
  searchCache.set(normalized, products);
}

export async function loadSearchWithCache(
  query: string,
  fetcher: () => Promise<Product[]>,
): Promise<Product[]> {
  const normalized = query.trim().toLowerCase();
  const cached = searchCache.get(normalized);

  if (cached) {
    return cached;
  }

  const inFlight = searchLoadPromises.get(normalized);
  if (inFlight) {
    return inFlight;
  }

  const promise = fetcher()
    .then((products) => {
      searchCache.set(normalized, products);
      return products;
    })
    .finally(() => {
      searchLoadPromises.delete(normalized);
    });

  searchLoadPromises.set(normalized, promise);
  return promise;
}

export function clearSearchCache(): void {
  searchCache.clear();
  searchLoadPromises.clear();
}
