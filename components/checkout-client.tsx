"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { Header } from "@/components/header";
import { CartSummaryPanel } from "@/components/cart-summary";
import { CartLineItem } from "@/components/cart-line-item";
import {
  createOrderNumber,
  OrderSuccess,
  type OrderConfirmation,
} from "@/components/order-success";
import { formatCurrency } from "@/lib/format";

export function CheckoutClient() {
  const router = useRouter();
  const {
    items,
    summary,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [orderConfirmation, setOrderConfirmation] =
    useState<OrderConfirmation | null>(null);

  const isEmpty = items.length === 0;

  const handlePlaceOrder = (event: React.FormEvent) => {
    event.preventDefault();
    if (isEmpty) {
      return;
    }

    setOrderConfirmation({
      orderNumber: createOrderNumber(),
      name,
      email,
      address,
      items: [...items],
      summary: { ...summary },
      placedAt: new Date(),
    });
    clearCart();
  };

  if (orderConfirmation) {
    return (
      <>
        <Header searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
        <OrderSuccess order={orderConfirmation} />
      </>
    );
  }

  if (isEmpty) {
    return (
      <>
        <Header searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
        <main className="mx-auto max-w-lg px-5 py-16 text-center md:px-7">
          <div className="rounded-2xl border border-border bg-surface px-6 py-12">
            <h1 className="mb-2 font-heading text-xl font-bold text-ink">
              Nothing to checkout
            </h1>
            <p className="mb-8 text-sm text-body">
              Your cart is empty. Add items before proceeding to checkout.
            </p>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-[10px] bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover hover:text-white"
            >
              Browse products
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
      <main className="mx-auto w-full max-w-[1200px] px-5 py-8 md:px-7 lg:px-8">
        <nav className="mb-6 text-sm font-medium text-muted" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-ink">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Checkout</span>
        </nav>

        <h1 className="font-heading text-2xl font-bold text-ink md:text-3xl">
          Checkout
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
              <h2 className="mb-4 font-heading text-lg font-bold text-ink">
                Contact &amp; shipping
              </h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-body">
                    Full name
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-11 w-full rounded-[10px] border border-border bg-page-bg px-4 text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                    placeholder="Jane Doe"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-body">
                    Email
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 w-full rounded-[10px] border border-border bg-page-bg px-4 text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                    placeholder="jane@example.com"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-body">
                    Shipping address
                  </span>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="w-full resize-none rounded-[10px] border border-border bg-page-bg px-4 py-3 text-sm text-ink focus:border-primary focus:bg-surface focus:outline-none"
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </label>
              </form>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="font-heading text-lg font-bold text-ink">
                  Order items ({cartCount})
                </h2>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  Add more
                </button>
              </div>

              <div className="divide-y divide-border">
                {items.map((item) => (
                  <CartLineItem
                    key={item.productId}
                    item={item}
                    onQuantityChange={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </section>
          </div>

          <aside className="flex h-fit flex-col gap-6 rounded-2xl border border-border bg-surface p-5 md:p-6 lg:sticky lg:top-24">
            <h2 className="font-heading text-lg font-bold text-ink">
              Order summary
            </h2>

            <CartSummaryPanel summary={summary} />

            <button
              type="submit"
              form="checkout-form"
              className="mb-3 flex h-11 w-full cursor-pointer items-center justify-center rounded-[10px] bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Place order · {formatCurrency(summary.total)}
            </button>

          </aside>
        </div>
      </main>
    </>
  );
}
