"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/product";

function ImagePlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="6"
        y="8"
        width="28"
        height="24"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="14" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 28l8-7 6 5 5-4 9 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getGalleryImages(product: Product): string[] {
  const imgs = product.images?.filter(Boolean) ?? [];

  if (imgs.length > 0) {
    return imgs;
  }

  return product.thumbnail ? [product.thumbnail] : [];
}

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = getGalleryImages(product);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="w-full">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-image-bg">
        {activeImage ? (
          <Image
            key={activeImage}
            src={activeImage}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-contain p-6 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted/50">
            <ImagePlaceholderIcon />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {images.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-[88px] w-[88px] shrink-0 cursor-pointer overflow-hidden rounded-xl bg-image-bg transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-page-bg"
                    : "opacity-80 hover:opacity-100"
                }`}
                aria-label={`View image ${index + 1}`}
                aria-current={isActive}
              >
                <Image
                  src={image}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  fill
                  sizes="88px"
                  className="object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
