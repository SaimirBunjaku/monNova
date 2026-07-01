"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import type { CartItem, CartSummary } from "@/types/cart";
import { formatCurrency } from "@/lib/format";
import { getLineTotal } from "@/lib/cart-utils";

export interface OrderConfirmation {
  orderNumber: string;
  name: string;
  email: string;
  address: string;
  items: CartItem[];
  summary: CartSummary;
  placedAt: Date;
}

interface OrderSuccessProps {
  order: OrderConfirmation;
}

function SuccessCheckmark() {
  return (
    <div className="animate-success-icon relative mx-auto mb-8 flex h-[72px] w-[72px] items-center justify-center">
      <span
        className="absolute inset-0 rounded-full bg-success/15 animate-success-ring"
        aria-hidden="true"
      />
      <span
        className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-success shadow-[0_8px_32px_rgba(31,169,113,0.28)]"
        aria-hidden="true"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            className="animate-success-check"
            d="M9 16.5 13.5 21 23 11"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
          />
        </svg>
      </span>
    </div>
  );
}

function formatPlacedDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function OrderSuccess({ order }: OrderSuccessProps) {
  const { orderNumber, name, email, address, items, summary, placedAt } = order;
  const firstName = name.trim().split(/\s+/)[0] || "there";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-[520px] flex-col items-center justify-start px-5 pb-16 pt-10 md:px-7 md:pb-20 md:pt-14">
      <div className="w-full text-center">
        <SuccessCheckmark />

        <div className="animate-success-fade-up">
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
            Order confirmed
          </p>
          <h1 className="font-heading text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[38px]">
            Thank you, {firstName}.
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-body">
            We&apos;ve received your order and will send a confirmation to{" "}
            <span className="font-medium text-ink">{email}</span>.
          </p>
        </div>

        <p
          className="animate-success-fade-up mt-6 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-[13px] font-medium text-muted shadow-[0_1px_3px_rgba(22,21,26,0.06)]"
          style={{ animationDelay: "0.12s" }}
        >
          <span className="text-body">Order</span>
          <span className="font-semibold tracking-wide text-ink">{orderNumber}</span>
        </p>
      </div>

      <div
        className="animate-success-fade-up mt-10 w-full overflow-hidden rounded-[20px] bg-surface shadow-[0_2px_24px_rgba(22,21,26,0.06),0_0_0_1px_rgba(22,21,26,0.04)]"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="border-b border-border/80 px-6 py-5">
          <p className="text-[13px] font-medium text-muted">{formatPlacedDate(placedAt)}</p>
          <p className="mt-1 text-sm font-semibold text-ink">
            Estimated delivery · 3–5 business days
          </p>
        </div>

        <ul className="divide-y divide-border/80 px-6">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3.5 py-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-image-bg">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-ink">{item.title}</p>
                <p className="text-xs text-muted">Qty {item.quantity}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                {formatCurrency(getLineTotal(item))}
              </p>
            </li>
          ))}
        </ul>

        <div className="space-y-2.5 border-t border-border/80 bg-page-bg/50 px-6 py-5">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="font-medium tabular-nums text-ink">
              {formatCurrency(summary.subtotal)}
            </span>
          </div>
          {summary.savings > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">Savings</span>
              <span className="font-medium tabular-nums text-success">
                −{formatCurrency(summary.savings)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted">Shipping</span>
            <span className="font-medium tabular-nums text-ink">
              {summary.shipping === 0 ? "Free" : formatCurrency(summary.shipping)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Tax</span>
            <span className="font-medium tabular-nums text-ink">
              {formatCurrency(summary.tax)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border/80 pt-3">
            <span className="text-sm font-semibold text-ink">Total paid</span>
            <span className="font-heading text-lg font-bold tabular-nums text-ink">
              {formatCurrency(summary.total)}
            </span>
          </div>
        </div>

        <div className="border-t border-border/80 px-6 py-5 text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
            Shipping to
          </p>
          <p className="mt-1.5 text-sm font-medium text-ink">{name}</p>
          <p className="mt-0.5 whitespace-pre-line text-sm leading-relaxed text-body">
            {address}
          </p>
        </div>
      </div>

      <div
        className="animate-success-fade-up mt-10 flex w-full flex-col items-center gap-3"
        style={{ animationDelay: "0.32s" }}
      >
        <Link
          href="/"
          className="inline-flex h-12 w-full max-w-xs items-center justify-center rounded-full bg-primary text-[15px] font-semibold text-white transition-all duration-300 hover:bg-primary-hover hover:text-white hover:shadow-[0_4px_20px_rgba(91,77,240,0.35)] active:scale-[0.98]"
        >
          Continue shopping
        </Link>
        <p className="text-xs text-muted">
          A receipt has been sent to your email.
        </p>
      </div>
    </main>
  );
}

export function createOrderNumber(): string {
  const segment = Date.now().toString(36).toUpperCase().slice(-6);
  return `#NV-${segment}`;
}
