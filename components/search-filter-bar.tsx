"use client";

import { useEffect, useRef, useState } from "react";
import { getCategories } from "@/lib/api";
import { DISPLAY_CATEGORIES } from "@/lib/categories";

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface SearchFilterBarProps {
  selectedCategory: string | null;
  onCategoryChange: (categorySlug: string | null) => void;
}

function CategoryChip({
  label,
  isActive,
  onClick,
  chipRef,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  chipRef?: (node: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={chipRef}
      type="button"
      onClick={onClick}
      className={`inline-flex h-[34px] shrink-0 cursor-pointer items-center rounded-full px-4 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
        isActive
          ? "bg-ink text-white shadow-[0_2px_8px_rgba(22,21,26,0.12)]"
          : "border border-border bg-surface text-body hover:border-primary/35 hover:bg-page-bg hover:text-ink hover:shadow-[0_2px_10px_rgba(91,77,240,0.08)]"
      }`}
    >
      {label}
    </button>
  );
}

export function SearchFilterBar({
  selectedCategory,
  onCategoryChange,
}: SearchFilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [, setApiCategories] = useState<string[]>([]);

  useEffect(() => {
    getCategories()
      .then(setApiCategories)
      .catch(() => {
        // Chips use a fixed display list; API fetch is for normalization only.
      });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({ left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    if (selectedCategory === null) {
      container.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    const activeChip = chipRefs.current.get(selectedCategory);
    if (!activeChip) {
      return;
    }

    const chipLeft = activeChip.offsetLeft;
    const chipRight = chipLeft + activeChip.offsetWidth;
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;

    if (chipLeft < viewLeft) {
      container.scrollTo({ left: chipLeft, behavior: "smooth" });
      return;
    }

    if (chipRight > viewRight) {
      container.scrollTo({
        left: chipRight - container.clientWidth,
        behavior: "smooth",
      });
    }
  }, [selectedCategory]);

  const setChipRef = (key: string) => (node: HTMLButtonElement | null) => {
    if (node) {
      chipRefs.current.set(key, node);
    } else {
      chipRefs.current.delete(key);
    }
  };

  return (
    <div className="mt-5 md:mt-6">
      <div
        ref={scrollRef}
        className="horizontal-scroll chip-scroll flex gap-2.5 overflow-x-auto pb-2 pt-0.5 md:flex-wrap md:overflow-visible md:pb-0"
      >
        <CategoryChip
          label="All"
          isActive={selectedCategory === null}
          onClick={() => onCategoryChange(null)}
          chipRef={setChipRef("all")}
        />

        {DISPLAY_CATEGORIES.map((category) => (
          <CategoryChip
            key={category.slug}
            label={category.label}
            isActive={selectedCategory === category.slug}
            onClick={() => onCategoryChange(category.slug)}
            chipRef={setChipRef(category.slug)}
          />
        ))}
      </div>
    </div>
  );
}

export function SortButton() {
  return (
    <button
      type="button"
      className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] border border-border bg-surface px-3 text-xs font-medium text-body transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:border-primary/35 hover:bg-page-bg hover:text-ink hover:shadow-[0_2px_10px_rgba(91,77,240,0.08)] sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
      aria-label="Sort products (visual only)"
    >
      <span className="whitespace-nowrap">
        Sort: <span className="font-semibold text-ink">Popular</span>
      </span>
      <ChevronDownIcon className="text-muted" />
    </button>
  );
}
