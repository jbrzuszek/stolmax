import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/products";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-[0.3em] text-oak">Bestsellery</p>
          <h2 className="mt-3 font-display text-3xl font-light text-cream md:text-5xl">
            Najpopularniejsze stoły loftowe
          </h2>
          <p className="mt-4 max-w-2xl text-cream/60">
            Wybrane modele stołów na wymiar - od klasycznych prostokątów po rozkładane stoły ELKA
            z systemem 8 nóg.
          </p>
        </AnimatedSection>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <AnimatedSection key={product.slug} delay={index * 0.08}>
              <ProductCard product={product} priority={index < 2} />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-12 text-center" delay={0.3}>
          <Link
            href="/oferta"
            className="inline-flex min-h-[52px] items-center justify-center border border-oak/40 px-10 text-sm uppercase tracking-[0.15em] text-cream transition-colors hover:border-oak hover:text-oak"
          >
            Poznaj całą ofertę
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
