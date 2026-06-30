import type { Category, Product, ProductsResponse } from "@/types/product";

const BASE_URL = "https://dummyjson.com";

async function fetchJson<T>(url: string, errorMessage: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${errorMessage} (status ${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function getProducts(limit = 24): Promise<ProductsResponse> {
  return fetchJson<ProductsResponse>(
    `${BASE_URL}/products?limit=${limit}`,
    "Failed to fetch products",
  );
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  const encoded = encodeURIComponent(query.trim());
  return fetchJson<ProductsResponse>(
    `${BASE_URL}/products/search?q=${encoded}`,
    `Failed to search products for "${query}"`,
  );
}

export async function getCategories(): Promise<Category[]> {
  return fetchJson<Category[]>(
    `${BASE_URL}/products/categories`,
    "Failed to fetch categories",
  );
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<ProductsResponse> {
  const encoded = encodeURIComponent(categorySlug.trim());
  return fetchJson<ProductsResponse>(
    `${BASE_URL}/products/category/${encoded}`,
    `Failed to fetch products for category "${categorySlug}"`,
  );
}

export async function getProduct(id: string | number): Promise<Product> {
  return fetchJson<Product>(
    `${BASE_URL}/products/${id}`,
    `Failed to fetch product with id "${id}"`,
  );
}
