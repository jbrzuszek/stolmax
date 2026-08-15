import type { Metadata } from "next";
import { AdminRealizationForm } from "@/components/AdminRealizationForm";

export const metadata: Metadata = {
  title: "Panel realizacji",
  robots: {
    index: false,
    follow: false,
  },
};

// Vercel: dłuższy czas na upload zdjęć + commit do GitHuba
export const maxDuration = 60;

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
            Po kliknięciu „Dodaj realizację” wpis trafia na GitHub, a Vercel publikuje go na
            stoly.rzeszow.pl w ciągu kilku minut.
          </p>

          <div className="mt-10">
            <AdminRealizationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
