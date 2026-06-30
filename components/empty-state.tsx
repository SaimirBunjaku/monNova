interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export function EmptyState({
  title = "No products found",
  message = "We couldn't find any products to display.",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 py-16 text-center">
      <h2 className="mb-2 font-heading text-lg font-bold text-ink">{title}</h2>
      <p className="mb-6 max-w-md text-sm font-medium text-body">{message}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="h-10 rounded-[10px] border border-border bg-surface px-5 text-sm font-semibold text-ink transition-colors hover:bg-page-bg"
        >
          Reset
        </button>
      )}
    </div>
  );
}
