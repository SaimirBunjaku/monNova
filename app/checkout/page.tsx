import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout-client";

export const metadata: Metadata = {
  title: "Checkout · monNova Store",
  description: "Review your order and complete checkout",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
