"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { addRealization } from "@/actions/realizations";

const CLIENT_TIMEOUT_MS = 90_000;

export function AdminRealizationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [slug, setSlug] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await Promise.race([
        addRealization(formData),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(
              new Error(
                "Przekroczono czas oczekiwania (90 s). Najczęściej zdjęcia są za duże albo GitHub nie odpowiada. Spróbuj 1–2 zdjęcia JPG poniżej 2,5 MB.",
              ),
            );
          }, CLIENT_TIMEOUT_MS);
        }),
      ]);

      if (!result.success) {
        setStatus("error");
        setMessage(result.error);
        return;
      }

      setStatus("success");
      setMessage(result.message);
      setSlug(result.slug);
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Nie udało się dodać realizacji. Odśwież stronę i spróbuj ponownie.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {status === "success" ? (
        <div className="border border-oak/30 bg-anthracite p-8 text-center">
          <p className="font-display text-2xl text-oak">Realizacja dodana</p>
          <p className="mt-3 text-cream/70">{message}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href={`/realizacje/${slug}`}
              className="inline-flex min-h-[48px] items-center border border-oak/40 px-6 text-sm uppercase tracking-[0.15em] text-cream transition-colors hover:border-oak hover:text-oak"
            >
              Podgląd
            </Link>
            <a
              href="https://stoly.rzeszow.pl/realizacje"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center border border-oak/40 px-6 text-sm uppercase tracking-[0.15em] text-cream transition-colors hover:border-oak hover:text-oak"
            >
              Sprawdź na stronie
            </a>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setMessage("");
                setSlug("");
              }}
              className="wood-gradient inline-flex min-h-[48px] cursor-pointer items-center px-6 text-sm font-medium uppercase tracking-[0.15em] text-charcoal transition-transform hover:scale-[1.02]"
            >
              Dodaj kolejną
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          <p className="text-sm text-muted">
            Wskazówka: najlepiej 1–3 zdjęcia JPG do 2,5 MB. Format .jfif też jest OK. Nie zamykaj
            karty podczas „Dodawanie...”.
          </p>

          <div>
            <label
              htmlFor="admin-title"
              className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
            >
              Nazwa realizacji *
            </label>
            <input
              id="admin-title"
              name="title"
              type="text"
              required
              placeholder="np. Stół loftowy dębowy – Rzeszów"
              className="w-full border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors placeholder:text-muted/50 focus:border-oak/50"
            />
          </div>

          <div>
            <label
              htmlFor="admin-description"
              className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
            >
              Opis *
            </label>
            <textarea
              id="admin-description"
              name="description"
              required
              rows={5}
              placeholder="Opisz wykonanie, materiały, wymiary, lokalizację klienta..."
              className="w-full resize-y border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors placeholder:text-muted/50 focus:border-oak/50"
            />
          </div>

          <div>
            <label
              htmlFor="admin-location"
              className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
            >
              Lokalizacja (opcjonalnie)
            </label>
            <input
              id="admin-location"
              name="location"
              type="text"
              placeholder="np. Rzeszów, Jasionka, Podkarpacie"
              className="w-full border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors placeholder:text-muted/50 focus:border-oak/50"
            />
          </div>

          <div>
            <label
              htmlFor="admin-images"
              className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
            >
              Zdjęcia * (JPG/JFIF/PNG/WEBP, max 8 szt., do 2,5 MB)
            </label>
            <input
              id="admin-images"
              name="images"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,.jfif,.jpeg,.jpg"
              multiple
              required
              className="w-full cursor-pointer border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream file:mr-4 file:border-0 file:bg-oak/20 file:px-3 file:py-1.5 file:text-oak"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
            >
              Hasło administratora *
            </label>
            <input
              id="admin-password"
              name="adminPassword"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors focus:border-oak/50"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-400" role="alert">
              {message}
            </p>
          )}

          {status === "loading" && (
            <p className="text-sm text-oak">
              Trwa wysyłanie... To zwykle 10–60 sekund. Nie zamykaj tej strony.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="wood-gradient inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center px-8 text-sm font-medium uppercase tracking-[0.15em] text-charcoal transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
          >
            {status === "loading" ? "Dodawanie..." : "Dodaj realizację"}
          </button>
        </form>
      )}
    </div>
  );
}
