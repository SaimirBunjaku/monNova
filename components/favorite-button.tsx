"use client";

import type { MouseEvent } from "react";
import type { Product } from "@/types/product";
import { useFavorites } from "@/components/favorites-provider";

interface HeartIconProps {
  className?: string;
  filled?: boolean;
}

export function HeartIcon({ className, filled = false }: HeartIconProps) {
  if (filled) {
    return (
      <svg
        className={className}
        width="18"
        height="18"
        viewBox="0 0 18 18"
        aria-hidden="true"
      >
        <path
          d="M9 15.35 3.3 9.65a3.25 3.25 0 0 1 0-4.6 3.25 3.25 0 0 1 4.6 0L9 6.15l1.1-1.1a3.25 3.25 0 0 1 4.6 4.6L9 15.35Z"
          fill="var(--accent)"
        />
      </svg>
    );
  }

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
        d="M9 15.35 3.3 9.65a3.25 3.25 0 0 1 0-4.6 3.25 3.25 0 0 1 4.6 0L9 6.15l1.1-1.1a3.25 3.25 0 0 1 4.6 4.6L9 15.35Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface FavoriteButtonProps {
  product: Product;
  className?: string;
  size?: "sm" | "md";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function FavoriteButton({
  product,
  className = "",
  size = "sm",
  onClick,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(product.id);

  const sizeClasses =
    size === "md" ? "h-10 w-10" : "h-8 w-8";

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        toggleFavorite(product);
      }}
      className={`flex ${sizeClasses} cursor-pointer items-center justify-center rounded-full bg-surface/90 backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        saved
          ? "text-accent hover:text-accent"
          : "text-muted hover:text-accent/70"
      } ${className}`}
      aria-pressed={saved}
      aria-label={
        saved
          ? `Remove ${product.title} from favorites`
          : `Add ${product.title} to favorites`
      }
    >
      <HeartIcon filled={saved} />
    </button>
  );
}
