import type { Metadata } from "next";
import { AboutSection } from "@/components/AboutSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { RealizationsSection } from "@/components/RealizationsSection";
import { getFeaturedProducts } from "@/lib/products";
import { getLatestRealizations } from "@/lib/realizations";
import { buildPageMetadata, buildWebPageSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Stoły Loftowe na Wymiar Rzeszów | Stolmax – Jasionka, Podkarpacie",
  description:
    "Stolmax - producent stołów loftowych na wymiar w Jasionce koło Rzeszowa. Stoły z laminatu, forniru i forniru dębowego. Stoły Podkarpacie - hurt i detal od 2008 roku.",
  path: "/",
  ogTitle: "Stoły Loftowe na Wymiar – Rzeszów i Podkarpacie | Stolmax",
});

export default function HomePage() {
  const featured = getFeaturedProducts();
  const latestRealizations = getLatestRealizations(3);

  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          path: "/",
          name: "Stoły Loftowe na Wymiar Rzeszów | Stolmax",
        })}
      />
      <Hero />
      <AboutSection />
      <FeaturedProducts products={featured} />
      <RealizationsSection realizations={latestRealizations} />
    </>
  );
}
