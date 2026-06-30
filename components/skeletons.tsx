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

export function ProductDetailSkeleton() {
  return (
    <>
      <div className="h-14 border-b border-border bg-surface md:h-[66px]" />

      <main className="mx-auto w-full max-w-[1200px] px-5 md:px-7 lg:px-8">
        <div className="flex gap-2 pt-6 md:pt-8">
          <div className="h-4 w-10 animate-pulse rounded bg-image-bg" />
          <div className="h-4 w-4 animate-pulse rounded bg-image-bg" />
          <div className="h-4 w-24 animate-pulse rounded bg-image-bg" />
          <div className="h-4 w-4 animate-pulse rounded bg-image-bg" />
          <div className="h-4 w-32 animate-pulse rounded bg-image-bg" />
        </div>

        <div className="grid grid-cols-1 gap-10 py-8 md:grid-cols-[1.05fr_1fr] md:gap-12">
          <div>
            <div className="aspect-square animate-pulse rounded-2xl bg-image-bg" />
            <div className="mt-4 grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="aspect-square animate-pulse rounded-xl bg-image-bg"
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-3 w-24 animate-pulse rounded bg-image-bg" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-image-bg" />
            <div className="h-4 w-32 animate-pulse rounded bg-image-bg" />
            <div className="h-10 w-48 animate-pulse rounded bg-image-bg" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full animate-pulse rounded bg-image-bg" />
              <div className="h-4 w-full animate-pulse rounded bg-image-bg" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-image-bg" />
            </div>
            <div className="h-4 w-40 animate-pulse rounded bg-image-bg pt-4" />
            <div className="flex gap-3 pt-2">
              <div className="h-11 w-32 animate-pulse rounded-[10px] bg-image-bg" />
              <div className="h-11 flex-1 animate-pulse rounded-[10px] bg-image-bg" />
            </div>
            <div className="h-11 w-full animate-pulse rounded-[10px] bg-image-bg" />
          </div>
        </div>
      </main>
    </>
  );
}
