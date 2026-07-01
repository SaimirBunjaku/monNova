"use client";

import Link from "next/link";
import Image from "next/image";
import type { FavoriteItem } from "@/types/favorite";
import { formatCurrency } from "@/lib/format";
import { getEffectiveDiscount, calculateOriginalPrice } from "@/lib/product-utils";
import { useCart } from "@/components/cart-provider";
import { useFavorites } from "@/components/favorites-provider";
import { favoriteToProduct } from "@/types/favorite";

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 4.5h9M6 4.5V3.25a1.25 1.25 0 0 1 1.25-1.25h1.5A1.25 1.25 0 0 1 10 3.25V4.5m1 0V12a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 5 12V4.5h6Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface FavoriteLineItemProps {
  item: FavoriteItem;
  onRemove: (productId: number) => void;
}

export function FavoriteLineItem({ item, onRemove }: FavoriteLineItemProps) {
  const { addToCart } = useCart();
  const { closeFavorites } = useFavorites();
  const hasDiscount = getEffectiveDiscount(item.discountPercentage) > 0;
  const originalPrice = calculateOriginalPrice(item.price, item.discountPercentage);

  return (
    <article className="flex gap-3 border-b border-border py-4 last:border-b-0">
      <Link
        href={`/products/${item.productId}`}
        onClick={closeFavorites}
        className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-image-bg"
      >
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="72px"
            className="object-contain p-1.5"
          />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.productId}`}
              onClick={closeFavorites}
              className="line-clamp-2 text-sm font-semibold leading-snug text-ink hover:text-primary"
            >
              {item.title}
            </Link>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted">
              {item.category.replace(/-/g, " ")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-page-bg hover:text-accent"
            aria-label={`Remove ${item.title} from favorites`}
          >
            <TrashIcon />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-ink">
              {formatCurrency(item.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(favoriteToProduct(item), 1)}
            className="inline-flex h-8 cursor-pointer items-center justify-center rounded-[8px] bg-primary px-3 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyFavoritesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M24 38.5 10.5 24.9a7.5 7.5 0 0 1 0-10.6 7.5 7.5 0 0 1 10.6 0L24 17.2l2.9-2.9a7.5 7.5 0 0 1 10.6 10.6L24 38.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { EmptyFavoritesIcon };
