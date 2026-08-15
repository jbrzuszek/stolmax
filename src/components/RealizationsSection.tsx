import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { RealizationCard } from "@/components/RealizationCard";
import type { Realization } from "@/lib/realizations";

interface RealizationsSectionProps {
  realizations: Realization[];
}

export function RealizationsSection({ realizations }: RealizationsSectionProps) {
  if (realizations.length === 0) return null;

  return (
    <section className="section-padding border-t border-white/5">
      <div className="container-narrow">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-[0.3em] text-oak">Realizacje</p>
          <h2 className="mt-3 font-display text-3xl font-light text-cream md:text-5xl">
            Stoły loftowe wykonane na wymiar
          </h2>
          <p className="mt-4 max-w-2xl text-cream/60">
            Wybrane realizacje z Jasionki, Rzeszowa i Podkarpacia - każdy stół powstaje
            indywidualnie pod zamówienie.
          </p>
        </AnimatedSection>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {realizations.map((realization, index) => (
            <AnimatedSection key={realization.slug} delay={index * 0.05}>
              <RealizationCard realization={realization} priority={index < 2} />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.15} className="mt-10">
          <Link
            href="/realizacje"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-oak transition-opacity hover:opacity-80"
          >
            Zobacz wszystkie realizacje
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
