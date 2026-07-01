"use client";

import Link from "next/link";
import { ErrorState } from "@/components/error-state";
import { Header } from "@/components/header";

interface ProductErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductError({ error, reset }: ProductErrorProps) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1200px] px-5 py-16 md:px-7 lg:px-8">
        <ErrorState
          message={error.message || "Something went wrong loading this product."}
          onRetry={reset}
        />
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="cursor-pointer text-sm font-semibold text-primary transition-colors duration-300 hover:text-primary-hover"
          >
            Back to all products
          </Link>
        </div>
      </main>
    </>
  );
}
