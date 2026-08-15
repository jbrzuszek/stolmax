import type { Metadata } from "next";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ContactForm } from "@/components/ContactForm";
import { GoogleMap } from "@/components/GoogleMap";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/data/site";
import {
  buildBreadcrumbSchema,
  buildPageMetadata,
  buildWebPageSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Kontakt – Stoły Loftowe Rzeszów, Jasionka",
  description:
    "Skontaktuj się ze Stolmax - producentem stołów loftowych na wymiar w Jasionce koło Rzeszowa. Telefon: 604 905 090, e-mail: j.brzuszek@vp.pl",
  path: "/kontakt",
  ogTitle: "Kontakt | Stolmax – Stoły Loftowe Jasionka",
});

export default function KontaktPage() {
  const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`;

  return (
    <div className="pt-16 md:pt-20">
      <JsonLd
        data={buildWebPageSchema({
          path: "/kontakt",
          name: "Kontakt – Stoły Loftowe Rzeszów, Jasionka",
          pageType: "ContactPage",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Strona główna", path: "/" },
          { name: "Kontakt", path: "/kontakt" },
        ])}
      />
      <section className="section-padding">
        <div className="container-narrow">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.3em] text-oak">Kontakt</p>
            <h1 className="mt-3 font-display text-4xl font-light text-cream md:text-6xl">
              Stoły loftowe na wymiar – skontaktuj się z nami
            </h1>
            <p className="mt-4 max-w-2xl text-cream/60">
              Szukasz wyjątkowego stołu loftowego do swojego domu lub mieszkania? Zapraszamy do
              kontaktu. Zrealizujemy Twój indywidualny projekt na wymiar z dbałością o każdy
              detal.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <AnimatedSection delay={0.1}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-xs uppercase tracking-[0.2em] text-oak">Dane firmy</h2>
                  <address className="mt-4 space-y-1 not-italic text-cream/80">
                    <p className="font-medium text-cream">{siteConfig.legalName}</p>
                    <p>{fullAddress}</p>
                    <p>
                      <a
                        href={`tel:${siteConfig.phoneHref}`}
                        className="transition-colors hover:text-oak"
                      >
                        {siteConfig.phone}
                      </a>
                    </p>
                    <p>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="transition-colors hover:text-oak"
                      >
                        {siteConfig.email}
                      </a>
                    </p>
                  </address>
                </div>

                <ContactForm />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-oak">Lokalizacja</h2>
              <GoogleMap />
              <p className="mt-4 text-sm text-muted">
                Jasionka 709a - w pobliżu Rzeszowa, województwo podkarpackie. Zapraszamy do
                naszej manufaktury stołów loftowych na wymiar.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
