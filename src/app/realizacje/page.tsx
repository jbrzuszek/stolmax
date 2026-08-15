import type { Metadata } from "next";
import { AnimatedSection } from "@/components/AnimatedSection";
import { JsonLd } from "@/components/JsonLd";
import { RealizationCard } from "@/components/RealizationCard";
import { getAllRealizations } from "@/lib/realizations";
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  buildPageMetadata,
  buildWebPageSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Realizacje – Stoły Loftowe na Wymiar Rzeszów",
  description:
    "Realizacje Stolmax - stoły loftowe na wymiar wykonane w Jasionce koło Rzeszowa. Zobacz przykładowe projekty z Podkarpacia.",
  path: "/realizacje",
  ogTitle: "Realizacje stołów loftowych | Stolmax",
});

export default function RealizacjePage() {
  const realizations = getAllRealizations();

  return (
    <div className="pt-16 md:pt-20">
      <JsonLd
        data={buildWebPageSchema({
          path: "/realizacje",
          name: "Realizacje – Stoły Loftowe na Wymiar Rzeszów",
          pageType: "CollectionPage",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Strona główna", path: "/" },
          { name: "Realizacje", path: "/realizacje" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": absoluteUrl("/realizacje#itemlist"),
          name: "Realizacje stołów loftowych Stolmax",
          numberOfItems: realizations.length,
          itemListElement: realizations.map((realization, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: realization.title,
            url: absoluteUrl(`/realizacje/${realization.slug}`),
          })),
        }}
      />

      <section className="section-padding">
        <div className="container-narrow">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.3em] text-oak">Realizacje</p>
            <h1 className="mt-3 font-display text-4xl font-light text-cream md:text-6xl">
              Stoły loftowe wykonane na wymiar – Rzeszów i Podkarpacie
            </h1>
            <p className="mt-4 max-w-2xl text-cream/60">
              Każda realizacja powstaje w naszej manufakturze w Jasionce. Poniżej wybrane projekty
              stołów loftowych dla klientów indywidualnych i biznesowych.
            </p>
          </AnimatedSection>

          {realizations.length === 0 ? (
            <AnimatedSection delay={0.1} className="mt-16">
              <p className="max-w-xl text-cream/60">
                Wkrótce pojawią się tu zdjęcia i opisy naszych realizacji. Już teraz zapraszamy do
                przeglądania oferty modeli oraz kontaktu w sprawie stołu na wymiar.
              </p>
            </AnimatedSection>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {realizations.map((realization, index) => (
                <AnimatedSection key={realization.slug} delay={index * 0.04}>
                  <RealizationCard realization={realization} priority={index < 3} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
