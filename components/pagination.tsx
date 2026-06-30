"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getVisiblePages } from "@/lib/pagination-utils";

const PAGE_SIZE = 28;
const INTRO_VISIBLE_MS = 2800;
const SCROLL_IDLE_MS = 140;

type VisibilityMode = "intro" | "resting" | "scrolling";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={direction === "left" ? "M11 4.5 6.5 9 11 13.5" : "M7 4.5 11.5 9 7 13.5"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const [visibilityMode, setVisibilityMode] = useState<VisibilityMode>("intro");
  const [isHovered, setIsHovered] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      setVisibilityMode("resting");
    }, INTRO_VISIBLE_MS);

    return () => window.clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setVisibilityMode("scrolling");

      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = window.setTimeout(() => {
        setVisibilityMode("resting");
      }, SCROLL_IDLE_MS);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) {
        return;
      }

      setVisibilityMode("intro");
      window.setTimeout(() => setVisibilityMode("resting"), INTRO_VISIBLE_MS);
      onPageChange(page);
    },
    [currentPage, onPageChange, totalPages],
  );

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalItems);
  const pages = getVisiblePages(currentPage, totalPages);

  const isFullyVisible = isHovered || visibilityMode === "intro";
  const opacityClass = isFullyVisible
    ? "opacity-100 translate-y-0"
    : visibilityMode === "scrolling"
      ? "opacity-[0.42] translate-y-0.5"
      : "opacity-[0.58] translate-y-0.5";

  const navButtonClass =
    "inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-surface/95 text-ink shadow-[0_4px_20px_rgba(20,18,30,0.08)] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-[1.04] hover:border-primary/35 hover:bg-surface hover:text-primary hover:shadow-[0_6px_24px_rgba(91,77,240,0.16)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100 disabled:hover:border-border/80 disabled:hover:text-ink disabled:hover:shadow-[0_4px_20px_rgba(20,18,30,0.08)]";

  return (
    <nav
      aria-label="Product pagination"
      className={`pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:bottom-7 ${opacityClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center gap-2 sm:max-w-none md:gap-3">
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={navButtonClass}
          aria-label="Previous page"
        >
          <ChevronIcon direction="left" />
        </button>

        <div className="horizontal-scroll max-w-[min(100vw-7.5rem,17.5rem)] overflow-x-auto rounded-full border border-border/70 bg-surface/92 px-2 py-1.5 shadow-[0_8px_32px_rgba(20,18,30,0.1)] backdrop-blur-xl sm:max-w-none md:px-3">
          <div className="flex min-w-max items-center gap-0.5 sm:gap-1 md:gap-1.5">
            <span className="sr-only">
              Showing {startItem} to {endItem} of {totalItems}
            </span>

            {pages.map((page, index) => {
              if (page === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="inline-flex h-9 min-w-8 items-center justify-center px-1 text-sm font-semibold text-muted"
                    aria-hidden="true"
                  >
                    …
                  </span>
                );
              }

              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-[10px] px-2.5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                    isActive
                      ? "bg-primary text-white shadow-[0_4px_16px_rgba(91,77,240,0.38)]"
                      : "text-body hover:bg-page-bg hover:text-ink active:scale-[0.97]"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={navButtonClass}
          aria-label="Next page"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
    </nav>
  );
}

export { PAGE_SIZE };
