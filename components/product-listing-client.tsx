"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { getAllProducts, searchProducts } from "@/lib/api";
import { normalizeCategorySlug } from "@/lib/categories";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Header } from "@/components/header";
import { PAGE_SIZE, Pagination } from "@/components/pagination";
import { ProductGrid } from "@/components/product-grid";
import {
  SearchFilterBar,
  SortButton,
} from "@/components/search-filter-bar";
import { ProductGridSkeleton } from "@/components/skeletons";

const SEARCH_DEBOUNCE_MS = 400;

function filterByCategory(
  products: Product[],
  categorySlug: string | null,
): Product[] {
  if (!categorySlug) {
    return products;
  }

  const normalized = normalizeCategorySlug(categorySlug);
  return products.filter(
    (product) => normalizeCategorySlug(product.category) === normalized,
  );
}

export function ProductListingClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true);
    setCatalogError(null);

    try {
      const data = await getAllProducts();
      setAllProducts(data.products);
    } catch (err) {
      setAllProducts([]);
      setCatalogError(
        err instanceof Error ? err.message : "Failed to load products.",
      );
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      setAppliedSearch("");
      return;
    }

    const timer = window.setTimeout(() => {
      setAppliedSearch(trimmed);
      setSelectedCategory(null);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!appliedSearch) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    let cancelled = false;

    const runSearch = async () => {
      setSearchLoading(true);
      setSearchError(null);

      try {
        const data = await searchProducts(appliedSearch);
        if (!cancelled) {
          setSearchResults(data.products);
        }
      } catch (err) {
        if (!cancelled) {
          setSearchResults([]);
          setSearchError(
            err instanceof Error ? err.message : "Failed to search products.",
          );
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    };

    void runSearch();

    return () => {
      cancelled = true;
    };
  }, [appliedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedSearch, selectedCategory]);

  const filteredProducts = useMemo(() => {
    if (appliedSearch) {
      return searchResults;
    }

    return filterByCategory(allProducts, selectedCategory);
  }, [allProducts, appliedSearch, searchResults, selectedCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredProducts]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    setSearchQuery("");
    setAppliedSearch("");
  };

  const handleReset = () => {
    setSearchQuery("");
    setAppliedSearch("");
    setSelectedCategory(null);
  };

  const handleRetry = () => {
    if (catalogError) {
      void loadCatalog();
      return;
    }

    if (appliedSearch) {
      setSearchError(null);
      setSearchLoading(true);
      searchProducts(appliedSearch)
        .then((data) => setSearchResults(data.products))
        .catch((err) =>
          setSearchError(
            err instanceof Error ? err.message : "Failed to search products.",
          ),
        )
        .finally(() => setSearchLoading(false));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loading = catalogLoading || searchLoading;
  const error = catalogError ?? searchError;
  const itemCount = filteredProducts.length;
  const isFiltered = Boolean(appliedSearch || selectedCategory);

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <main className="mx-auto w-full max-w-[1200px] px-5 md:px-7 lg:px-8">
        <div className="pt-8 md:pt-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <h1 className="min-w-0 font-heading text-2xl font-bold leading-none text-ink">
                All products
              </h1>
              <SortButton />
            </div>
            <p className="text-sm font-medium text-muted">
              {loading ? "Loading..." : `${itemCount} items`}
            </p>
          </div>

          <SearchFilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        <div className={`py-8 ${totalPages > 1 ? "pb-28 md:pb-32" : ""}`}>
          {loading && <ProductGridSkeleton count={PAGE_SIZE} />}

          {!loading && error && (
            <ErrorState message={error} onRetry={handleRetry} />
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <EmptyState
              title="No products found"
              message={
                appliedSearch
                  ? `We couldn't find any products matching "${appliedSearch}".`
                  : "We couldn't find any products in this category."
              }
              onReset={isFiltered ? handleReset : undefined}
            />
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <>
              <ProductGrid products={paginatedProducts} pageKey={currentPage} />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={itemCount}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
