"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/components/favorites-provider";
import {
  EmptyFavoritesIcon,
  FavoriteLineItem,
} from "@/components/favorite-line-item";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.5 4.5 13.5 13.5M13.5 4.5 4.5 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FavoritesDrawer() {
  const router = useRouter();
  const {
    items,
    favoritesCount,
    isOpen,
    closeFavorites,
    removeFavorite,
    clearFavorites,
  } = useFavorites();

  const isEmpty = items.length === 0;

  const viewAll = () => {
    closeFavorites();
    router.push("/favorites");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeFavorites}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Favorites"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-[420px] flex-col border-l border-border bg-surface shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-ink">Favorites</h2>
            <p className="text-xs font-medium text-muted">
              {favoritesCount === 0
                ? "No saved items"
                : `${favoritesCount} saved item${favoritesCount === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeFavorites}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-border text-body transition-colors hover:bg-page-bg hover:text-ink"
            aria-label="Close favorites"
          >
            <CloseIcon />
          </button>
        </div>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <EmptyFavoritesIcon className="mb-4 text-muted/50" />
            <p className="mb-1 font-heading text-base font-bold text-ink">
              No favorites yet
            </p>
            <p className="mb-6 max-w-xs text-sm text-body">
              Tap the heart on any product to save it here.
            </p>
            <Link
              href="/"
              onClick={closeFavorites}
              className="inline-flex h-10 items-center justify-center rounded-[10px] bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover hover:text-white"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {items.map((item) => (
                <FavoriteLineItem
                  key={item.productId}
                  item={item}
                  onRemove={removeFavorite}
                />
              ))}
            </div>

            <div className="flex flex-col gap-2 border-t border-border px-5 py-4">
              <button
                type="button"
                onClick={viewAll}
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-[10px] bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                View all favorites
              </button>
              <div className="flex gap-2">
                <Link
                  href="/"
                  onClick={closeFavorites}
                  className="flex h-10 flex-1 items-center justify-center rounded-[10px] border border-border text-sm font-semibold text-ink transition-colors hover:bg-page-bg"
                >
                  Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={clearFavorites}
                  className="h-10 shrink-0 cursor-pointer rounded-[10px] px-4 text-sm font-semibold text-muted transition-colors hover:bg-page-bg hover:text-accent"
                >
                  Clear all
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
