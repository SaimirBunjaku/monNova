import { formatCurrency } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart-utils";
import type { CartSummary } from "@/types/cart";

interface CartSummaryPanelProps {
  summary: CartSummary;
  className?: string;
}

function SummaryRow({
  label,
  value,
  emphasis = false,
  muted = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className={muted ? "text-muted" : "font-medium text-body"}>{label}</span>
      <span
        className={
          emphasis
            ? "font-heading text-lg font-bold text-ink"
            : "font-semibold text-ink"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function CartSummaryPanel({ summary, className = "" }: CartSummaryPanelProps) {
  const { subtotal, savings, shipping, tax, total, qualifiesForFreeShipping, amountUntilFreeShipping } =
    summary;

  const showFreeShippingHint = !qualifiesForFreeShipping && subtotal > 0;
  const showFreeShippingQualified = qualifiesForFreeShipping && subtotal > 0;

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {(showFreeShippingHint || showFreeShippingQualified) && (
        <div>
          {showFreeShippingHint && (
            <p className="rounded-[10px] bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
              Add {formatCurrency(amountUntilFreeShipping)} more for free shipping on orders over{" "}
              {formatCurrency(FREE_SHIPPING_THRESHOLD)}.
            </p>
          )}
          {showFreeShippingQualified && (
            <p className="rounded-[10px] bg-success/10 px-3 py-2 text-xs font-medium text-success">
              You qualify for free shipping.
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
        <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
        {savings > 0 && (
          <SummaryRow
            label="You save"
            value={`-${formatCurrency(savings)}`}
            muted
          />
        )}
        <SummaryRow
          label="Shipping"
          value={shipping === 0 ? "Free" : formatCurrency(shipping)}
          muted
        />
        <SummaryRow label="Estimated tax" value={formatCurrency(tax)} muted />

        <div className="border-t border-border pt-3">
          <SummaryRow label="Total" value={formatCurrency(total)} emphasis />
        </div>
      </div>
    </div>
  );
}
