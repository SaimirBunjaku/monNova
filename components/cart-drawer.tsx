"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { CartLineItem } from "@/components/cart-line-item";
import { CartSummaryPanel } from "@/components/cart-summary";

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

function EmptyCartIcon({ className }: { className?: string }) {
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
        d="M14 18V14a10 10 0 1 1 20 0v4M12 18h24l-2.2 16.5H14.2L12 18Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    cartCount,
    summary,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const isEmpty = items.length === 0;

  const goToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-[420px] flex-col border-l border-border bg-surface shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-ink">Your cart</h2>
            <p className="text-xs font-medium text-muted">
              {cartCount === 0
                ? "No items yet"
                : `${cartCount} item${cartCount === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-border text-body transition-colors hover:bg-page-bg hover:text-ink"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <EmptyCartIcon className="mb-4 text-muted/50" />
            <p className="mb-1 font-heading text-base font-bold text-ink">
              Your cart is empty
            </p>
            <p className="mb-6 max-w-xs text-sm text-body">
              Browse our catalog and add products you love.
            </p>
            <Link
              href="/"
              onClick={closeCart}
              className="inline-flex h-10 items-center justify-center rounded-[10px] bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover hover:text-white"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {items.map((item) => (
                <CartLineItem
                  key={item.productId}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-border px-5 py-4">
              <CartSummaryPanel summary={summary} />

              <button
                type="button"
                onClick={goToCheckout}
                className="mb-2 flex h-11 w-full cursor-pointer items-center justify-center rounded-[10px] bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Proceed to checkout
              </button>

              <div className="flex gap-2">
                <Link
                  href="/"
                  onClick={closeCart}
                  className="flex h-10 flex-1 items-center justify-center rounded-[10px] border border-border text-sm font-semibold text-ink transition-colors hover:bg-page-bg"
                >
                  Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="h-10 shrink-0 cursor-pointer rounded-[10px] px-4 text-sm font-semibold text-muted transition-colors hover:bg-page-bg hover:text-accent"
                >
                  Clear cart
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
