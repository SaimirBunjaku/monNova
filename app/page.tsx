import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1200px] px-5 md:px-7 lg:px-8">
        <div className="pt-8 md:pt-10">
          <h1 className="font-heading text-2xl font-bold text-ink">All products</h1>
          <p className="mt-1 text-sm font-medium text-muted">194 items</p>
        </div>

        <div className="grid grid-cols-1 gap-[22px] py-8 md:grid-cols-2 lg:grid-cols-4">
          {MOCK_PRODUCTS.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              primaryButton={index === 0}
            />
          ))}
        </div>
      </main>
    </>
  );
}
