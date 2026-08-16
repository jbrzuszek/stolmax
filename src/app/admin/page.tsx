import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";
import { listAdminRealizations } from "@/actions/realizations";

export const metadata: Metadata = {
  title: "Panel realizacji",
  robots: {
    index: false,
    follow: false,
  },
};

export const maxDuration = 60;

export default async function AdminPage() {
  const realizations = await listAdminRealizations();

  return (
    <div className="pt-16 md:pt-20">
      <section className="section-padding">
        <div className="container-narrow">
          <p className="text-xs uppercase tracking-[0.3em] text-oak">Panel</p>
          <h1 className="mt-3 font-display text-4xl font-light text-cream md:text-5xl">
            Zarządzaj realizacjami
          </h1>
          <p className="mt-4 max-w-2xl text-cream/60">
            Dodawaj nowe realizacje albo edytuj istniejące. Po zapisaniu zmiany trafiają na GitHub i
            po 1–3 minutach pojawiają się na stoly.rzeszow.pl.
          </p>

          <div className="mt-10">
            <AdminPanel realizations={realizations} />
          </div>
        </div>
      </section>
    </div>
  );
}
