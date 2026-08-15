import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { siteConfig } from "@/data/site";

export function AboutSection() {
  return (
    <section className="section-padding bg-anthracite">
      <div className="container-narrow">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-[0.3em] text-oak">O nas</p>
          <h2 className="mt-3 font-display text-3xl font-light text-cream md:text-5xl">
            Rzemiosło i polska produkcja stołów loftowych
          </h2>
        </AnimatedSection>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <AnimatedSection delay={0.1}>
            <div className="space-y-5 text-base leading-relaxed text-cream/70">
              {siteConfig.aboutText.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { value: "2008", label: "Rok założenia" },
                { value: "22+", label: "Modeli stołów" },
                { value: "100%", label: "Produkcja w Polsce" },
                { value: "Na wymiar", label: "Dla domu i biznesu" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border border-white/5 bg-charcoal/50 p-6 transition-colors hover:border-oak/30"
                >
                  <p className="font-display text-3xl text-oak">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.3} className="mt-12">
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-oak transition-opacity hover:opacity-80"
          >
            Porozmawiajmy o Twoim projekcie
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
