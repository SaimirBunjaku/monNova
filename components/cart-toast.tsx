"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 7.5 5.8 9.8 10.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 3.5 10.5 10.5M10.5 3.5 3.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const DISMISS_DELAY_MS = 2600;
const HIDE_DELAY_MS = 3000;
const EXIT_ANIMATION_MS = 350;

export function CartToast() {
  const { lastAdded, openCart, dismissLastAdded } = useCart();
  const [exiting, setExiting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const exitTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const isDismissingRef = useRef(false);
  const lastNotificationIdRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const startDismissTimers = useCallback(() => {
    clearTimers();
    setExiting(false);
    exitTimerRef.current = window.setTimeout(() => setExiting(true), DISMISS_DELAY_MS);
    hideTimerRef.current = window.setTimeout(() => {
      dismissLastAdded();
      setExiting(false);
    }, HIDE_DELAY_MS);
  }, [clearTimers, dismissLastAdded]);

  const dismissNow = useCallback(() => {
    clearTimers();
    isDismissingRef.current = true;
    setIsHovered(false);
    setExiting(true);
    hideTimerRef.current = window.setTimeout(() => {
      dismissLastAdded();
      setExiting(false);
      isDismissingRef.current = false;
    }, EXIT_ANIMATION_MS);
  }, [clearTimers, dismissLastAdded]);

  useEffect(() => {
    if (!lastAdded) {
      setIsHovered(false);
      setExiting(false);
      isDismissingRef.current = false;
      lastNotificationIdRef.current = null;
      clearTimers();
      return;
    }

    if (lastNotificationIdRef.current !== lastAdded.id) {
      isDismissingRef.current = false;
      lastNotificationIdRef.current = lastAdded.id;
    }

    if (isDismissingRef.current) {
      return;
    }

    if (isHovered) {
      clearTimers();
      setExiting(false);
      return;
    }

    startDismissTimers();
    return clearTimers;
  }, [lastAdded, isHovered, clearTimers, startDismissTimers]);

  if (!lastAdded) {
    return null;
  }

  const quantityLabel =
    lastAdded.quantity > 1 ? `${lastAdded.quantity} × ` : "";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-5 md:inset-x-auto md:bottom-auto md:right-6 md:top-[78px] md:justify-end ${
        exiting ? "animate-cart-toast-out" : "animate-cart-toast-in"
      }`}
    >
      <div
        className="pointer-events-auto relative w-full max-w-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-surface/95 py-3 pl-3 pr-4 shadow-[0_8px_32px_rgba(22,21,26,0.12),0_0_0_1px_rgba(22,21,26,0.04)] backdrop-blur-md">
          <div className="relative h-11 w-11 shrink-0">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-image-bg">
              {lastAdded.thumbnail ? (
                <Image
                  src={lastAdded.thumbnail}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-contain p-1"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-success/10 text-success">
                  <CheckIcon />
                </div>
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-success text-white ring-2 ring-surface">
              <CheckIcon className="h-2.5 w-2.5" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-ink">Added to cart</p>
            <p className="truncate text-xs text-body">
              {quantityLabel}
              {lastAdded.title}
            </p>
          </div>

          <button
            type="button"
            onClick={openCart}
            className="shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/8"
          >
            View cart
          </button>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            dismissNow();
          }}
          onMouseDown={(event) => event.preventDefault()}
          className="absolute -right-2.5 -top-2.5 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-muted shadow-[0_2px_8px_rgba(22,21,26,0.12)] ring-2 ring-surface transition-colors hover:bg-page-bg hover:text-ink"
          aria-label="Dismiss notification"
        >
          <CloseIcon className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
