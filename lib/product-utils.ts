import type { Product } from "@/types/product";

const MIN_DISCOUNT_PERCENT = 1;

export function getEffectiveDiscount(discountPercentage: number): number {
  const rounded = Math.round(discountPercentage);
  return rounded >= MIN_DISCOUNT_PERCENT ? rounded : 0;
}

export function calculateOriginalPrice(
  price: number,
  discountPercentage: number,
): number {
  if (getEffectiveDiscount(discountPercentage) <= 0) {
    return price;
  }

  return price / (1 - discountPercentage / 100);
}

export function formatDiscount(discountPercentage: number): string {
  const effective = getEffectiveDiscount(discountPercentage);
  return `-${effective}%`;
}

export function hasDiscount(product: Product): boolean {
  return getEffectiveDiscount(product.discountPercentage) > 0;
}

export function getReviewCount(product: Product): number {
  return product.reviews?.length ?? 0;
}

/** Strip redundant "ship(s)" wording when the label is already "Shipping". */
export function formatShippingValue(shippingInformation: string): string {
  const trimmed = shippingInformation.trim();
  const withoutShipPrefix = trimmed.replace(/^ships?\s+(?:in\s+)?/i, "");
  const value = withoutShipPrefix.length > 0 ? withoutShipPrefix : trimmed;

  return value.replace(/^([a-z])/, (char) => char.toUpperCase());
}
