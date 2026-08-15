"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-16 md:pt-20">
      <div className="absolute inset-0">
        <Image
          src="/oferta/pajak/img1.jpg"
          alt="Stół Pająk - stoły loftowe na wymiar Stolmax Rzeszów"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/30" />

      <div className="container-narrow relative z-10 section-padding">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-oak">
            Jasionka &middot; Rzeszów &middot; Podkarpacie
          </p>
          <h1 className="font-display text-balance text-4xl font-light leading-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl">
            Stoły Loftowe na Wymiar –{" "}
            <span className="text-oak">Rzeszów i Podkarpacie</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/70 md:text-lg">
            Polska produkcja stołów loftowych od 2008 roku. Tworzymy stoły na wymiar idealnie
            dopasowane do Twoich oczekiwań. Blaty powstają z wysokiej jakości płyty laminowanej
            lub forniru dębowego.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/oferta"
              className="wood-gradient inline-flex min-h-[52px] items-center justify-center px-8 text-sm font-medium uppercase tracking-[0.15em] text-charcoal transition-transform hover:scale-[1.02]"
            >
              Zobacz ofertę
            </Link>
            <Link
              href="/wycena"
              className="inline-flex min-h-[52px] items-center justify-center border border-oak/40 px-8 text-sm uppercase tracking-[0.15em] text-cream transition-colors hover:border-oak hover:text-oak"
            >
              Zapytaj o wycenę
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="h-10 w-px bg-oak/50"
        />
      </div>
    </section>
  );
}
