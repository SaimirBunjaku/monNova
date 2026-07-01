import type { Metadata } from "next";
import { FavoritesPageClient } from "@/components/favorites-page-client";

export const metadata: Metadata = {
  title: "Favorites · monNova Store",
  description: "Your saved products",
};

export default function FavoritesPage() {
  return <FavoritesPageClient />;
}
