"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Shop", href: "/", active: true },
  { label: "New", href: "#", active: false },
  { label: "Deals", href: "#", active: false },
  { label: "About", href: "#", active: false },
];

const CART_COUNT = 3;

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 3.5a5.5 5.5 0 1 0 3.47 9.82l3.2 3.2a.75.75 0 1 0 1.06-1.06l-3.2-3.2A5.5 5.5 0 0 0 9 3.5Zm0 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
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

function Logo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="NOVA home">
      <span className="font-heading text-[21px] font-extrabold leading-none tracking-tight text-ink">
        NOV<span className="text-primary">A</span>
      </span>
    </Link>
  );
}

function CartButton() {
  return (
    <button
      type="button"
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-border bg-surface text-ink transition-colors hover:bg-page-bg"
      aria-label={`Cart, ${CART_COUNT} items`}
    >
      <CartIcon />
      {CART_COUNT > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-none text-white">
          {CART_COUNT}
        </span>
      )}
    </button>
  );
}

export function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center gap-4 px-5 md:h-[66px] md:gap-8 md:px-7 lg:px-8">
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm transition-colors hover:text-ink ${
                link.active
                  ? "font-semibold text-ink"
                  : "font-medium text-body"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop search */}
        <div className="hidden flex-1 justify-end md:flex">
          <label className="relative w-full max-w-[280px]">
            <span className="sr-only">Search products</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search products"
              className="h-10 w-full rounded-[10px] border border-border bg-page-bg py-0 pl-10 pr-4 text-sm font-medium text-ink placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none"
            />
          </label>
        </div>

        {/* Desktop cart */}
        <div className="hidden md:block">
          <CartButton />
        </div>

        {/* Mobile actions */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border bg-surface text-ink transition-colors hover:bg-page-bg"
            aria-label={mobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={mobileSearchOpen}
          >
            <SearchIcon />
          </button>
          <CartButton />
        </div>
      </div>

      {/* Mobile search panel */}
      {mobileSearchOpen && (
        <div className="border-t border-border px-5 py-3 md:hidden">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search products"
              autoFocus
              className="h-10 w-full rounded-[10px] border border-border bg-page-bg py-0 pl-10 pr-4 text-sm font-medium text-ink placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none"
            />
          </label>
        </div>
      )}
    </header>
  );
}
