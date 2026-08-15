import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedSection } from "@/components/AnimatedSection";
import { JsonLd } from "@/components/JsonLd";
import { getRealization, getRealizationSlugs } from "@/lib/realizations";
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  buildPageMetadata,
  buildWebPageSchema,
  SEO_IDS,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getRealizationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const realization = getRealization(slug);
  if (!realization) return {};

  const locationSuffix = realization.location ? ` – ${realization.location}` : "";

  return buildPageMetadata({
    title: `${realization.title}${locationSuffix} | Realizacje Stolmax`,
    description: `${realization.description} Stoły loftowe na wymiar Rzeszów, Jasionka, Podkarpacie.`,
    path: `/realizacje/${slug}`,
    ogTitle: `${realization.title} | Stolmax Realizacje`,
    ogImage: realization.images[0],
  });
}

export default async function RealizationPage({ params }: PageProps) {
  const { slug } = await params;
  const realization = getRealization(slug);

  if (!realization) notFound();

  return (
    <div className="pt-16 md:pt-20">
      <JsonLd
        data={buildWebPageSchema({
          path: `/realizacje/${slug}`,
          name: realization.title,
          pageType: "ItemPage",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Strona główna", path: "/" },
          { name: "Realizacje", path: "/realizacje" },
          { name: realization.title, path: `/realizacje/${slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "@id": absoluteUrl(`/realizacje/${slug}#work`),
          name: realization.title,
          description: realization.description,
          image: realization.images.map((image) => absoluteUrl(image)),
          dateCreated: realization.createdAt,
          creator: { "@id": SEO_IDS.organization },
          ...(realization.location
            ? {
                contentLocation: {
                  "@type": "Place",
                  name: realization.location,
                },
              }
            : {}),
        }}
      />

      <section className="section-padding">
        <div className="container-narrow">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-oak">
                  Strona główna
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/realizacje" className="transition-colors hover:text-oak">
                  Realizacje
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-cream">{realization.title}</li>
            </ol>
          </nav>

          <div className="grid min-w-0 gap-12 lg:grid-cols-2 lg:gap-16">
            <AnimatedSection className="min-w-0 space-y-4">
              {realization.images.map((image, index) => (
                <div
                  key={image}
                  className="relative aspect-[4/3] overflow-hidden bg-graphite"
                >
                  <Image
                    src={image}
                    alt={`${realization.title} – zdjęcie ${index + 1}, stol loftowy Stolmax`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={index === 0}
                    className="object-cover"
                  />
                </div>
              ))}
            </AnimatedSection>

            <AnimatedSection delay={0.1} className="min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] text-oak">Realizacja</p>
              <h1 className="mt-3 font-display text-3xl font-light text-cream md:text-5xl">
                {realization.title}
              </h1>
              {realization.location ? (
                <p className="mt-3 text-sm uppercase tracking-[0.15em] text-oak/80">
                  {realization.location}
                </p>
              ) : null}
              <p className="mt-6 text-base leading-relaxed break-words text-cream/70">
                {realization.description}
              </p>
              <p className="mt-4 text-sm text-muted">
                Data realizacji: {realization.createdAt}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link
                  href="/wycena"
                  className="wood-gradient inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center px-6 text-sm font-medium uppercase tracking-[0.12em] text-charcoal transition-transform hover:scale-[1.02] sm:w-auto sm:px-8"
                >
                  Zapytaj o podobny stół
                </Link>
                <Link
                  href="/realizacje"
                  className="inline-flex min-h-[52px] w-full items-center justify-center border border-oak/40 px-6 text-sm uppercase tracking-[0.12em] text-cream transition-colors hover:border-oak hover:text-oak sm:w-auto sm:px-8"
                >
                  Wróć do realizacji
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
