import { AnimatedSection } from "@/components/AnimatedSection";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/products";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <AnimatedSection key={product.slug} delay={(index % 6) * 0.05}>
          <ProductCard product={product} priority={index < 3} />
        </AnimatedSection>
      ))}
    </div>
  );
}
