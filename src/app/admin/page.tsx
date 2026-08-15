import type { Metadata } from "next";
import { AdminRealizationForm } from "@/components/AdminRealizationForm";

export const metadata: Metadata = {
  title: "Panel realizacji",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="section-padding">
        <div className="container-narrow">
          <p className="text-xs uppercase tracking-[0.3em] text-oak">Panel</p>
          <h1 className="mt-3 font-display text-4xl font-light text-cream md:text-5xl">
            Dodaj realizację
          </h1>
          <p className="mt-4 max-w-2xl text-cream/60">
            Formularz lokalny / administracyjny. Po kliknięciu „Dodaj realizację” wpis trafia do
            GitHuba, a Vercel w ciągu kilku minut publikuje go na stoly.rzeszow.pl.
          </p>

          <div className="mt-10">
            <AdminRealizationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
