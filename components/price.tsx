import { formatCurrency } from "@/lib/format";
import { calculateOriginalPrice, getEffectiveDiscount } from "@/lib/product-utils";

interface PriceProps {
  price: number;
  discountPercentage: number;
  size?: "card" | "detail";
  className?: string;
}

export function Price({
  price,
  discountPercentage,
  size = "card",
  className = "",
}: PriceProps) {
  const effectiveDiscount = getEffectiveDiscount(discountPercentage);
  const discounted = effectiveDiscount > 0;
  const originalPrice = calculateOriginalPrice(price, discountPercentage);

  if (size === "detail") {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        <span className="text-[34px] font-bold leading-none text-ink">
          {formatCurrency(price)}
        </span>
        {discounted && (
          <>
            <span className="text-lg font-medium text-muted line-through">
              {formatCurrency(originalPrice)}
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-baseline gap-2 ${className}`}>
      <span className="text-lg font-bold leading-none text-ink">
        {formatCurrency(price)}
      </span>
      {discounted && (
        <span className="text-sm font-medium text-muted line-through">
          {formatCurrency(originalPrice)}
        </span>
      )}
    </div>
  );
}

export function PriceDiscountBadge({
  discountPercentage,
  className = "",
}: {
  discountPercentage: number;
  className?: string;
}) {
  if (getEffectiveDiscount(discountPercentage) <= 0) {
    return null;
  }

  const effective = getEffectiveDiscount(discountPercentage);

  return (
    <span
      className={`inline-flex items-center rounded-full bg-accent-bg px-2 py-0.5 text-xs font-semibold text-accent ${className}`}
    >
      -{effective}%
    </span>
  );
}
