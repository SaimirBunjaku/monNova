"use client";

import type { ChangeEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useFavorites } from "@/components/favorites-provider";

const NAV_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Favorites", href: "/favorites" },
];

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
    <Link href="/" className="inline-flex cursor-pointer items-center" aria-label="NOVA home">
      <span className="font-heading text-[21px] font-extrabold leading-none tracking-tight text-ink">
        NOV<span className="text-primary">A</span>
      </span>
    </Link>
  );
}

function FavoritesButton() {
  const { favoritesCount, openFavorites } = useFavorites();

  return (
    <button
      type="button"
      onClick={openFavorites}
      className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-border bg-surface text-ink transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-page-bg"
      aria-label={`Favorites, ${favoritesCount} items`}
    >
      <svg
        width="20"
        height="20"
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
      {favoritesCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold leading-none text-white">
          {favoritesCount}
        </span>
      )}
    </button>
  );
}

function CartButton() {
  const { cartCount, openCart, lastAddAt } = useCart();
  const [badgePop, setBadgePop] = useState(false);

  useEffect(() => {
    if (!lastAddAt) {
      return;
    }

    setBadgePop(true);
    const timer = window.setTimeout(() => setBadgePop(false), 550);
    return () => window.clearTimeout(timer);
  }, [lastAddAt]);

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-border bg-surface text-ink transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-page-bg"
      aria-label={`Cart, ${cartCount} items`}
    >
      <CartIcon />
      {cartCount > 0 && (
        <span
          className={`absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-none text-white ${
            badgePop ? "animate-cart-badge-pop" : ""
          }`}
        >
          {cartCount}
        </span>
      )}
    </button>
  );
}

interface HeaderProps {
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

const OFF_HOME_SEARCH_DEBOUNCE_MS = 400;

export function Header({
  searchQuery = "",
  onSearchQueryChange,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [offHomeQuery, setOffHomeQuery] = useState("");
  const offHomeTimerRef = useRef<number | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const clearOffHomeTimer = useCallback(() => {
    if (offHomeTimerRef.current !== null) {
      window.clearTimeout(offHomeTimerRef.current);
      offHomeTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearOffHomeTimer, [clearOffHomeTimer]);

  const handleSearchChange = (value: string) => {
    if (isHome) {
      onSearchQueryChange?.(value);
      return;
    }

    setOffHomeQuery(value);
    clearOffHomeTimer();

    offHomeTimerRef.current = window.setTimeout(() => {
      const trimmed = value.trim();
      router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
    }, OFF_HOME_SEARCH_DEBOUNCE_MS);
  };

  const displayedSearchQuery = isHome ? searchQuery : offHomeQuery;

  const searchInputProps = {
    type: "search" as const,
    placeholder: "Search products",
    value: displayedSearchQuery,
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      handleSearchChange(event.target.value);
    },
    className:
      "h-10 w-full rounded-[10px] border border-border bg-page-bg py-0 pl-10 pr-4 text-sm font-medium text-ink placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none",
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-surface"
      data-scrollbar-compensate
    >
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center gap-4 px-5 md:h-[66px] md:gap-8 md:px-7 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
            <Link
              key={link.label}
              href={link.href}
              className={`cursor-pointer text-sm transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:text-ink ${
                isActive
                  ? "font-semibold text-ink"
                  : "font-medium text-body"
              }`}
            >
              {link.label}
            </Link>
            );
          })}
        </nav>

        <div className="hidden flex-1 justify-end md:flex">
          <label className="relative w-full max-w-[280px]">
            <span className="sr-only">Search products</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input {...searchInputProps} />
          </label>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <FavoritesButton />
          <CartButton />
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((open) => !open)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border border-border bg-surface text-ink transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-page-bg"
            aria-label={mobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={mobileSearchOpen}
          >
            <SearchIcon />
          </button>
          <FavoritesButton />
          <CartButton />
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-border px-5 py-3 md:hidden">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input {...searchInputProps} autoFocus />
          </label>
        </div>
      )}
    </header>
  );
}
