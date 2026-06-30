function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 1.5 8.55 5.2l4 .35-3.05 2.6 1 3.9L7 10.2l-3.5 2.85 1-3.9-3.05-2.6 4-.35L7 1.5Z" />
    </svg>
  );
}

interface RatingProps {
  rating: number;
  reviewCount?: number;
  className?: string;
}

export function Rating({ rating, reviewCount, className = "" }: RatingProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <StarIcon className="shrink-0 text-star" />
      <span className="text-[13px] font-medium leading-none text-ink">
        {rating.toFixed(2)}
      </span>
      {reviewCount !== undefined && (
        <span className="text-[13px] font-medium leading-none text-muted">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
