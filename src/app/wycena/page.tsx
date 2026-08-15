import type { Metadata } from "next";
import { AnimatedSection } from "@/components/AnimatedSection";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/QuoteForm";
import { getAllProducts } from "@/lib/products";
import {
  buildBreadcrumbSchema,
  buildPageMetadata,
  buildWebPageSchema,
} from "@/lib/seo";

interface PageProps {
  searchParams: Promise<{ model?: string }>;
}

export const metadata: Metadata = buildPageMetadata({
  title: "Poproś o wycenę – Stoły Loftowe na Wymiar",
  description:
    "Wyślij zapytanie o wycenę stołu loftowego Stolmax. Wybierz model, podaj dane kontaktowe i opcjonalnie rozmiar oraz kolor blatu.",
  path: "/wycena",
  ogTitle: "Poproś o wycenę | Stolmax",
});

export default async function WycenaPage({ searchParams }: PageProps) {
  const { model } = await searchParams;
  const products = getAllProducts().map((product) => ({
    slug: product.slug,
    title: product.title,
    cover: product.images[0],
  }));

  return (
    <div className="pt-16 md:pt-20">
      <JsonLd
        data={buildWebPageSchema({
          path: "/wycena",
          name: "Poproś o wycenę – Stoły Loftowe na Wymiar",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Strona główna", path: "/" },
          { name: "Poproś o wycenę", path: "/wycena" },
        ])}
      />
      <section className="section-padding">
        <div className="container-narrow">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.3em] text-oak">Wycena</p>
            <h1 className="mt-3 font-display text-4xl font-light text-cream md:text-6xl">
              Poproś o wycenę stołu na wymiar
            </h1>
            <p className="mt-4 max-w-2xl text-cream/60">
              Wybierz model z oferty i wyślij zapytanie. Rozmiar oraz kolor blatu możesz podać
              od razu albo zostawić puste - doprecyzujemy szczegóły w kontakcie.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="mt-12">
            <QuoteForm products={products} initialSlug={model} />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
