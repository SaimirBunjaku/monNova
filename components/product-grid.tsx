import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product-card";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          href={`/products/${product.id}`}
          primaryButton={index === 0}
        />
      ))}
    </div>
  );
}
