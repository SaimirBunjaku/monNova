"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { getProducts } from "@/lib/api";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/skeletons";

export function ProductListingClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProducts(24);
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      setProducts([]);
      setTotal(null);
      setError(
        err instanceof Error ? err.message : "Failed to load products.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const itemCount = total ?? products.length;

  return (
    <>
      <div className="pt-8 md:pt-10">
        <h1 className="font-heading text-2xl font-bold text-ink">All products</h1>
        <p className="mt-1 text-sm font-medium text-muted">
          {loading ? "Loading..." : `${itemCount} items`}
        </p>
      </div>

      <div className="py-8">
        {loading && <ProductGridSkeleton />}

        {!loading && error && (
          <ErrorState message={error} onRetry={loadProducts} />
        )}

        {!loading && !error && products.length === 0 && <EmptyState />}

        {!loading && !error && products.length > 0 && (
          <ProductGrid products={products} />
        )}
      </div>
    </>
  );
}
