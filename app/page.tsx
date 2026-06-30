import { Header } from "@/components/header";
import { ProductListingClient } from "@/components/product-listing-client";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1200px] px-5 md:px-7 lg:px-8">
        <ProductListingClient />
      </main>
    </>
  );
}
