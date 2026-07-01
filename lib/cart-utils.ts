import type { CartItem, CartSummary } from "@/types/cart";
import { calculateOriginalPrice, getEffectiveDiscount } from "@/lib/product-utils";

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD = 50;
export const FLAT_SHIPPING_RATE = 5.99;

export function getLineTotal(item: CartItem): number {
  return item.price * item.quantity;
}

export function getLineSavings(item: CartItem): number {
  if (getEffectiveDiscount(item.discountPercentage) <= 0) {
    return 0;
  }

  const original = calculateOriginalPrice(item.price, item.discountPercentage);
  return (original - item.price) * item.quantity;
}

export function getMaxQuantity(item: CartItem): number {
  return Math.max(1, Math.min(item.stock, 99));
}

export function calculateCartSummary(items: CartItem[]): CartSummary {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueCount = items.length;
  const subtotal = items.reduce((sum, item) => sum + getLineTotal(item), 0);
  const savings = items.reduce((sum, item) => sum + getLineSavings(item), 0);

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const amountUntilFreeShipping = qualifiesForFreeShipping
    ? 0
    : FREE_SHIPPING_THRESHOLD - subtotal;

  const shipping =
    subtotal === 0 ? 0 : qualifiesForFreeShipping ? 0 : FLAT_SHIPPING_RATE;

  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return {
    itemCount,
    uniqueCount,
    subtotal,
    savings,
    shipping,
    tax,
    total,
    qualifiesForFreeShipping,
    amountUntilFreeShipping,
  };
}

export function mergeCartItem(existing: CartItem, quantity: number): CartItem {
  const max = getMaxQuantity(existing);
  const nextQuantity = Math.min(max, existing.quantity + quantity);

  return {
    ...existing,
    quantity: nextQuantity,
  };
}
