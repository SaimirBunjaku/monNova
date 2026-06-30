export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 aspect-square animate-pulse rounded-xl bg-image-bg" />

      <div className="mb-2 h-3 w-16 animate-pulse rounded bg-image-bg" />
      <div className="mb-1 h-4 w-full animate-pulse rounded bg-image-bg" />
      <div className="mb-3 h-4 w-4/5 animate-pulse rounded bg-image-bg" />

      <div className="mb-2.5 flex gap-2">
        <div className="h-3.5 w-20 animate-pulse rounded bg-image-bg" />
      </div>

      <div className="mb-4 h-5 w-24 animate-pulse rounded bg-image-bg" />

      <div className="mt-auto h-10 w-full animate-pulse rounded-[10px] bg-image-bg" />
    </div>
  );
}

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export function ProductGridSkeleton({
  count = 8,
  className = "",
}: ProductGridSkeletonProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-[22px] md:grid-cols-2 lg:grid-cols-4 ${className}`}
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
