import type { Metadata } from "next";
import { AnimatedSection } from "@/components/AnimatedSection";
import { JsonLd } from "@/components/JsonLd";
import { OfertaCatalog } from "@/components/OfertaCatalog";
import { getAllProducts } from "@/lib/products";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildPageMetadata,
  buildWebPageSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Oferta – Stoły Loftowe na Wymiar Rzeszów",
  description:
    "Pełna oferta stołów loftowych Stolmax - stoły na wymiar Rzeszów, Jasionka, Podkarpacie. Prostokąt, owal, koło, rozkładane modele ELKA i Kacper.",
  path: "/oferta",
  ogTitle: "Oferta Stołów Loftowych | Stolmax Rzeszów",
});

export default function OfertaPage() {
  const products = getAllProducts();

  return (
    <div className="pt-16 md:pt-20">
      <JsonLd
        data={buildWebPageSchema({
          path: "/oferta",
          name: "Oferta – Stoły Loftowe na Wymiar Rzeszów",
          pageType: "CollectionPage",
        })}
      />
      <JsonLd data={buildItemListSchema(products)} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Strona główna", path: "/" },
          { name: "Oferta", path: "/oferta" },
        ])}
      />
      <section className="section-padding">
        <div className="container-narrow">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.3em] text-oak">Oferta</p>
            <h1 className="mt-3 font-display text-4xl font-light text-cream md:text-6xl">
              Stoły loftowe na wymiar – Rzeszów i Podkarpacie
            </h1>
            <p className="mt-4 max-w-2xl text-cream/60">
              Każdy stół wykonujemy na indywidualne zamówienie w naszym zakładzie w Jasionce.
            </p>
          </AnimatedSection>

          <div className="mt-12">
            <OfertaCatalog products={products} />
          </div>
        </div>
      </section>
    </div>
  );
}
