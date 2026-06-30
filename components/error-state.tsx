interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong while loading products.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 py-16 text-center">
      <p className="mb-6 max-w-md text-sm font-medium text-body">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="h-10 rounded-[10px] bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Try again
        </button>
      )}
    </div>
  );
}
