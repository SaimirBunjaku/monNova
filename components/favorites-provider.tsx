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
import type { FavoriteItem } from "@/types/favorite";
import { productToFavoriteItem } from "@/types/favorite";
import { FavoritesDrawer } from "@/components/favorites-drawer";
import {
  applyScrollbarCompensation,
  clearScrollbarCompensation,
} from "@/lib/scroll-lock";

const STORAGE_KEY = "nova-favorites";

interface FavoritesContextValue {
  items: FavoriteItem[];
  favoritesCount: number;
  isOpen: boolean;
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: Product) => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  clearFavorites: () => void;
  openFavorites: () => void;
  closeFavorites: () => void;
  toggleFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function readStoredFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as FavoriteItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        typeof item.productId === "number" &&
        typeof item.title === "string",
    );
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredFavorites());
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

    applyScrollbarCompensation();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      clearScrollbarCompensation();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const isFavorite = useCallback(
    (productId: number) => items.some((item) => item.productId === productId),
    [items],
  );

  const addFavorite = useCallback((product: Product) => {
    setItems((current) => {
      if (current.some((item) => item.productId === product.id)) {
        return current;
      }

      return [...current, productToFavoriteItem(product)];
    });
  }, []);

  const removeFavorite = useCallback((productId: number) => {
    setItems((current) =>
      current.filter((item) => item.productId !== productId),
    );
  }, []);

  const toggleFavorite = useCallback((product: Product) => {
    setItems((current) => {
      const exists = current.some((item) => item.productId === product.id);

      if (exists) {
        return current.filter((item) => item.productId !== product.id);
      }

      return [...current, productToFavoriteItem(product)];
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setItems([]);
  }, []);

  const openFavorites = useCallback(() => setIsOpen(true), []);
  const closeFavorites = useCallback(() => setIsOpen(false), []);
  const toggleFavorites = useCallback(() => setIsOpen((open) => !open), []);

  const favoritesCount = items.length;

  const value = useMemo(
    () => ({
      items,
      favoritesCount,
      isOpen,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      clearFavorites,
      openFavorites,
      closeFavorites,
      toggleFavorites,
    }),
    [
      items,
      favoritesCount,
      isOpen,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      clearFavorites,
      openFavorites,
      closeFavorites,
      toggleFavorites,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
      <FavoritesDrawer />
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}
