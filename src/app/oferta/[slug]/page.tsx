import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedSection } from "@/components/AnimatedSection";
import { JsonLd } from "@/components/JsonLd";
import { ProductGallery } from "@/components/ProductGallery";
import { siteConfig } from "@/data/site";
import { getProduct, getProductSlugs } from "@/lib/products";
import {
  buildBreadcrumbSchema,
  buildPageMetadata,
  buildProductSchema,
  buildWebPageSchema,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return buildPageMetadata({
    title: `${product.title} – Stoły Loftowe Rzeszów`,
    description: `${product.description} Stoły loftowe na wymiar Jasionka, Podkarpacie - Stolmax.`,
    path: `/oferta/${slug}`,
    ogTitle: `${product.title} | Stolmax`,
    ogImage: product.images[0],
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  return (
    <div className="pt-16 md:pt-20">
      <JsonLd
        data={buildWebPageSchema({
          path: `/oferta/${slug}`,
          name: product.title,
          pageType: "ItemPage",
        })}
      />
      <JsonLd data={buildProductSchema(product)} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Strona główna", path: "/" },
          { name: "Oferta", path: "/oferta" },
          { name: product.title, path: `/oferta/${slug}` },
        ])}
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
                <Link href="/oferta" className="transition-colors hover:text-oak">
                  Oferta
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-cream">{product.title}</li>
            </ol>
          </nav>

          <div className="grid min-w-0 gap-12 lg:grid-cols-2 lg:gap-16">
            <AnimatedSection className="min-w-0">
              <ProductGallery
                images={product.images}
                title={product.title}
                imageFocus={product.imageFocus}
                imageFocusByPath={product.imageFocusByPath}
              />
            </AnimatedSection>

            <AnimatedSection delay={0.1} className="min-w-0">
              <h1 className="font-display text-3xl font-light text-cream md:text-5xl">
                {product.title}
              </h1>
              <p className="mt-6 text-base leading-relaxed break-words text-cream/70">
                {product.description}
              </p>

              {product.specs.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xs uppercase tracking-[0.2em] text-oak">Specyfikacja</h2>
                  <ul className="mt-4 space-y-2">
                    {product.specs.map((spec) => (
                      <li
                        key={spec}
                        className="flex items-start gap-3 text-sm text-cream/80 before:mt-1.5 before:block before:h-1 before:w-1 before:shrink-0 before:bg-oak"
                      >
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link
                  href={`/wycena?model=${product.slug}`}
                  className="wood-gradient inline-flex min-h-[52px] w-full items-center justify-center px-6 text-sm font-medium uppercase tracking-[0.12em] text-charcoal transition-transform hover:scale-[1.02] sm:w-auto sm:px-8 sm:tracking-[0.15em]"
                >
                  Zapytaj o wycenę
                </Link>
                <a
                  href={siteConfig.colorsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[52px] w-full items-center justify-center border border-oak/40 px-6 text-sm uppercase tracking-[0.12em] text-cream transition-colors hover:border-oak hover:text-oak sm:w-auto sm:px-8 sm:tracking-[0.15em]"
                >
                  Sprawdź kolorystykę
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
