"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatDiscount, getReviewCount, hasDiscount } from "@/lib/product-utils";
import { Price } from "@/components/price";
import { Rating } from "@/components/rating";

function HeartIcon({ className }: { className?: string }) {
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

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6.25 6.5V5.25a3.75 3.75 0 1 1 7.5 0V6.5M4.5 6.5h11l-1.1 8.25H5.6L4.5 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImagePlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="6"
        y="8"
        width="28"
        height="24"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="14" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 28l8-7 6 5 5-4 9 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatCategoryLabel(category: string): string {
  return category.replace(/-/g, " ").toUpperCase();
}

function stopCardNavigation(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
  event.stopPropagation();
}

interface ProductCardProps {
  product: Product;
  href?: string;
  primaryButton?: boolean;
  animationDelay?: number;
}

export function ProductCard({
  product,
  href,
  primaryButton = false,
  animationDelay = 0,
}: ProductCardProps) {
  const reviewCount = getReviewCount(product);
  const showDiscount = hasDiscount(product);
  const hasImage = Boolean(product.thumbnail);

  const imageContent = hasImage ? (
    <Image
      src={product.thumbnail}
      alt={product.title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className="object-contain p-4"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-muted/50">
      <ImagePlaceholderIcon />
    </div>
  );

  const titleContent = (
    <h2 className="mb-2 line-clamp-2 cursor-pointer text-[15px] font-semibold leading-[1.35] text-ink">
      {product.title}
    </h2>
  );

  return (
    <article
      className="animate-card-in group relative z-0 flex flex-col rounded-2xl border border-border bg-surface p-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:z-10 hover:scale-[1.025]"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-image-bg">
        {href ? (
          <Link href={href} className="block h-full w-full cursor-pointer">
            {imageContent}
          </Link>
        ) : (
          imageContent
        )}

        {showDiscount && (
          <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold leading-none text-white">
            {formatDiscount(product.discountPercentage)}
          </span>
        )}

        <button
          type="button"
          onClick={stopCardNavigation}
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface/90 text-muted backdrop-blur-sm transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-accent"
          aria-label={`Add ${product.title} to wishlist`}
        >
          <HeartIcon />
        </button>
      </div>

      <div className="flex flex-1 flex-col">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">
          {formatCategoryLabel(product.category)}
        </p>

        {href ? <Link href={href}>{titleContent}</Link> : titleContent}

        <Rating rating={product.rating} reviewCount={reviewCount} className="mb-2.5" />

        <Price
          price={product.price}
          discountPercentage={product.discountPercentage}
          className="mb-4"
        />

        <button
          type="button"
          onClick={stopCardNavigation}
          className={`group/btn mt-auto flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] text-sm font-semibold transition-[background-color,border-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            primaryButton
              ? "bg-primary text-white hover:bg-primary-hover"
              : "border border-primary text-primary hover:bg-primary hover:text-white"
          }`}
        >
          <CartIcon />
          Add to cart
        </button>
      </div>
    </article>
  );
}
