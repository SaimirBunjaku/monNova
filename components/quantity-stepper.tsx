"use client";

import { useState } from "react";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

function MinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 3v8M3 7h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className = "",
}: QuantityStepperProps) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={`inline-flex h-11 shrink-0 items-center rounded-[10px] border border-border bg-surface ${className}`}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        className="flex h-full w-11 cursor-pointer items-center justify-center text-body transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <MinusIcon />
      </button>
      <span className="min-w-10 select-none text-center text-sm font-semibold text-ink">
        {value}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        className="flex h-full w-11 cursor-pointer items-center justify-center text-body transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <PlusIcon />
      </button>
    </div>
  );
}

export function useQuantity(initial = 1) {
  const [quantity, setQuantity] = useState(initial);
  return { quantity, setQuantity };
}
