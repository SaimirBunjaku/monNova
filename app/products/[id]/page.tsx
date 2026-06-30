import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import { ProductDetail } from "@/components/product-detail";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const product = await getProduct(id);
    return <ProductDetail product={product} />;
  } catch {
    notFound();
  }
}
