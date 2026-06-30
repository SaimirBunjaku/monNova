import { formatCurrency } from "@/lib/format";
import { calculateOriginalPrice } from "@/lib/product-utils";

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
  const discounted = discountPercentage > 0;
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
  if (discountPercentage <= 0) {
    return null;
  }

  const rounded = Math.round(discountPercentage);

  return (
    <span
      className={`inline-flex items-center rounded-full bg-accent-bg px-2 py-0.5 text-xs font-semibold text-accent ${className}`}
    >
      -{rounded}%
    </span>
  );
}
