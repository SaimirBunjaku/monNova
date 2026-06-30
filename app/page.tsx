import { Suspense } from "react";
import { ProductListingClient } from "@/components/product-listing-client";
import { ProductGridSkeleton } from "@/components/skeletons";

export default function HomePage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={8} />}>
      <ProductListingClient />
    </Suspense>
  );
}
