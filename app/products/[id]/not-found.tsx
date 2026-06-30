import Link from "next/link";
import { HeaderShell } from "@/components/header-shell";

export default function ProductNotFound() {
  return (
    <>
      <HeaderShell />
      <main className="mx-auto w-full max-w-[1200px] px-5 py-16 text-center md:px-7 lg:px-8">
        <h1 className="font-heading text-2xl font-bold text-ink">Product not found</h1>
        <p className="mt-2 text-sm font-medium text-muted">
          This product may have been removed or the link is incorrect.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 cursor-pointer items-center rounded-[10px] bg-primary px-5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-hover"
        >
          Back to shop
        </Link>
      </main>
    </>
  );
}
