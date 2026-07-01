"use client";

import Link from "next/link";
import Image from "next/image";
import type { CartItem } from "@/types/cart";
import { formatCurrency } from "@/lib/format";
import { getLineTotal, getMaxQuantity } from "@/lib/cart-utils";
import { calculateOriginalPrice, getEffectiveDiscount } from "@/lib/product-utils";
import { QuantityStepper } from "@/components/quantity-stepper";

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

interface CartLineItemProps {
  item: CartItem;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
}: CartLineItemProps) {
  const lineTotal = getLineTotal(item);
  const maxQuantity = getMaxQuantity(item);
  const hasDiscount = getEffectiveDiscount(item.discountPercentage) > 0;
  const originalUnit = calculateOriginalPrice(item.price, item.discountPercentage);

  return (
    <article className="flex gap-3 border-b border-border py-4 last:border-b-0">
      <Link
        href={`/products/${item.productId}`}
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
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted">
            No image
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.productId}`}
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
            aria-label={`Remove ${item.title} from cart`}
          >
            <TrashIcon />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <QuantityStepper
            value={item.quantity}
            onChange={(value) => onQuantityChange(item.productId, value)}
            min={1}
            max={maxQuantity}
            size="compact"
          />

          <div className="text-right">
            <p className="text-sm font-bold text-ink">{formatCurrency(lineTotal)}</p>
            {hasDiscount && (
              <p className="text-xs text-muted line-through">
                {formatCurrency(originalUnit * item.quantity)}
              </p>
            )}
          </div>
        </div>

        {item.quantity >= maxQuantity && maxQuantity < 99 && (
          <p className="mt-1.5 text-[11px] font-medium text-accent">
            Only {maxQuantity} left in stock
          </p>
        )}
      </div>
    </article>
  );
}
