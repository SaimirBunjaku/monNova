"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/types/product";
import type { CartItem, CartSummary } from "@/types/cart";
import { productToCartItem } from "@/types/cart";
import {
  calculateCartSummary,
  getMaxQuantity,
  mergeCartItem,
} from "@/lib/cart-utils";

const STORAGE_KEY = "nova-cart";

export interface CartAddNotification {
  id: number;
  title: string;
  thumbnail: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  summary: CartSummary;
  isOpen: boolean;
  lastAdded: CartAddNotification | null;
  lastAddAt: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  dismissLastAdded: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStoredItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        typeof item.productId === "number" &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartAddNotification | null>(null);
  const [lastAddAt, setLastAddAt] = useState(0);

  useEffect(() => {
    setItems(readStoredItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    const amount = Math.max(1, Math.floor(quantity));

    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);

      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? mergeCartItem(item, amount)
            : item,
        );
      }

      const nextItem = productToCartItem(product, amount);
      nextItem.quantity = Math.min(getMaxQuantity(nextItem), nextItem.quantity);

      return [...current, nextItem];
    });

    setLastAdded({
      id: Date.now(),
      title: product.title,
      thumbnail: product.thumbnail,
      quantity: amount,
    });
    setLastAddAt(Date.now());
  }, []);

  const dismissLastAdded = useCallback(() => {
    setLastAdded(null);
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.productId !== productId);
      }

      return current.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        const max = getMaxQuantity(item);
        return {
          ...item,
          quantity: Math.min(max, Math.max(1, Math.floor(quantity))),
        };
      });
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const summary = useMemo(() => calculateCartSummary(items), [items]);
  const cartCount = summary.itemCount;

  const value = useMemo(
    () => ({
      items,
      cartCount,
      summary,
      isOpen,
      lastAdded,
      lastAddAt,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      dismissLastAdded,
    }),
    [
      items,
      cartCount,
      summary,
      isOpen,
      lastAdded,
      lastAddAt,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      dismissLastAdded,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
