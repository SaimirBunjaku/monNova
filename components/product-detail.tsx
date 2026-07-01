"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import { formatCategoryLabel } from "@/lib/categories";
import {
  getReviewCount,
  hasDiscount,
  formatShippingValue,
} from "@/lib/product-utils";
import { Header } from "@/components/header";
import { useCart } from "@/components/cart-provider";
import { Price, PriceDiscountBadge } from "@/components/price";
import { ProductGallery } from "@/components/product-gallery";
import { QuantityStepper } from "@/components/quantity-stepper";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 1.5 8.55 5.2l4 .35-3.05 2.6 1 3.9L7 10.2l-3.5 2.85 1-3.9-3.05-2.6 4-.35L7 1.5Z" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
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

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 text-sm">
      <span className="font-medium text-muted">{label}</span>
      <span className="text-right font-semibold text-ink">{value}</span>
    </div>
  );
}

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState(1);

  const reviewCount = getReviewCount(product);
  const categoryLabel = formatCategoryLabel(product.category);
  const categoryHref = `/?category=${encodeURIComponent(product.category)}`;
  const showDiscount = hasDiscount(product);

  const brand = product.brand ?? "—";
  const sku = product.sku ?? "—";
  const warranty = product.warrantyInformation ?? "1 year";
  const shipping = formatShippingValue(
    product.shippingInformation ?? "3–5 days",
  );

  return (
    <>
      <Header searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

      <main className="mx-auto w-full max-w-[1200px] px-5 md:px-7 lg:px-8">
        <nav
          className="flex flex-wrap items-center gap-2 pt-6 text-sm font-medium text-muted md:pt-8"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="cursor-pointer transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-ink"
          >
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={categoryHref}
            className="cursor-pointer transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-ink"
          >
            {categoryLabel}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 py-8 md:grid-cols-[1.05fr_1fr] md:gap-12 lg:gap-14">
          <ProductGallery product={product} />

          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.07em] text-muted">
              {product.category.replace(/-/g, " ").toUpperCase()}
            </p>

            <h1 className="font-heading text-[32px] font-bold leading-tight text-ink md:text-[36px]">
              {product.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StarIcon className="text-star" />
              <span className="text-sm font-medium text-ink">
                {product.rating.toFixed(2)}
              </span>
              <button
                type="button"
                className="cursor-pointer text-sm font-medium text-primary transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-primary-hover"
              >
                {reviewCount} reviews
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Price
                price={product.price}
                discountPercentage={product.discountPercentage}
                size="detail"
              />
              {showDiscount && (
                <PriceDiscountBadge
                  discountPercentage={product.discountPercentage}
                  className="px-2.5 py-1 text-sm"
                />
              )}
            </div>

            <p className="mt-6 text-[15px] leading-relaxed text-body">
              {product.description}
            </p>

            <hr className="my-6 border-border" />

            <div className="flex items-center gap-2 text-sm font-medium text-success">
              <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
              In stock — ships in 3–5 days
            </div>

            {/* Mobile: stepper + add to cart row, buy now below. Desktop: all three in one row. */}
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-stretch">
              <div className="flex w-full min-w-0 items-stretch gap-3 md:contents">
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  max={Math.min(product.stock, 99)}
                  className="shrink-0"
                />

                <button
                  type="button"
                  onClick={() => addToCart(product, quantity)}
                  className="inline-flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-white transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-primary-hover md:min-w-[160px] md:flex-[1.4]"
                >
                  <CartIcon className="shrink-0" />
                  <span className="truncate">Add to cart</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(product, quantity);
                  router.push("/checkout");
                }}
                className="inline-flex h-11 w-full shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-border bg-surface px-6 text-sm font-semibold text-ink transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary/35 hover:bg-page-bg md:w-auto md:min-w-[140px]"
              >
                Buy now
              </button>
            </div>

            <div className="mt-8 border-t border-border">
              <div className="grid grid-cols-1 gap-x-12 border-b border-border py-4 sm:grid-cols-2">
                <SpecCell label="Brand" value={brand} />
                <SpecCell label="SKU" value={sku} />
              </div>
              <div className="grid grid-cols-1 gap-x-12 border-b border-border py-4 sm:grid-cols-2">
                <SpecCell label="Warranty" value={warranty} />
                <SpecCell label="Shipping" value={shipping} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
