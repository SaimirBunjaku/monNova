export interface DisplayCategory {
  slug: string;
  label: string;
}

export const DISPLAY_CATEGORIES: DisplayCategory[] = [
  { slug: "smartphones", label: "Smartphones" },
  { slug: "laptops", label: "Laptops" },
  { slug: "fragrances", label: "Fragrances" },
  { slug: "skincare", label: "Skincare" },
  { slug: "groceries", label: "Groceries" },
  { slug: "furniture", label: "Furniture" },
];

export function formatCategoryLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function normalizeCategorySlug(slug: string): string {
  return slug.trim().toLowerCase();
}
