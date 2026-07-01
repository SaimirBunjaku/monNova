"use client";

import Link from "next/link";
import { useFavorites } from "@/components/favorites-provider";
import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { EmptyState } from "@/components/empty-state";
import { favoriteToProduct } from "@/types/favorite";

export function FavoritesPageClient() {
  const { items, clearFavorites } = useFavorites();

  const products = items.map(favoriteToProduct);

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-[1200px] px-5 md:px-7 lg:px-8">
        <div className="pt-8 md:pt-10">
          <nav
            className="mb-6 text-sm font-medium text-muted"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-ink">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Favorites</span>
          </nav>

          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-ink md:text-3xl">
                Favorites
              </h1>
              <p className="mt-2 text-sm font-medium text-muted">
                {items.length === 0
                  ? "Products you love will appear here"
                  : `${items.length} saved item${items.length === 1 ? "" : "s"}`}
              </p>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearFavorites}
                className="h-10 cursor-pointer rounded-[10px] border border-border px-4 text-sm font-semibold text-body transition-colors hover:bg-page-bg hover:text-accent"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="pb-16">
          {items.length === 0 ? (
            <>
              <EmptyState
                title="No favorites yet"
                message="Tap the heart icon on any product to save it to your favorites."
              />
              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="inline-flex h-10 items-center justify-center rounded-[10px] bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover hover:text-white"
                >
                  Browse products
                </Link>
              </div>
            </>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </main>
    </>
  );
}
