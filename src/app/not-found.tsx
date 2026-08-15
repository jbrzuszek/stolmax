import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Strona nie istnieje",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-oak">404</p>
      <h1 className="mt-3 font-display text-4xl text-cream">Strona nie istnieje</h1>
      <p className="mt-4 text-muted">Szukany model stołu lub strona nie została znaleziona.</p>
      <Link
        href="/oferta"
        className="mt-8 inline-flex min-h-[52px] items-center border border-oak/40 px-8 text-sm uppercase tracking-[0.15em] text-cream transition-colors hover:border-oak hover:text-oak"
      >
        Przejdź do oferty
      </Link>
    </div>
  );
}
