"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { sendQuoteRequest } from "@/actions/quote";
import { quoteSources } from "@/data/site";
import { IMAGE_FOCUS_CLASS, type ImageFocus } from "@/types/product";

type QuoteSource = (typeof quoteSources)[number]["value"];

export interface QuoteProductOption {
  slug: string;
  title: string;
  cover: string;
  imageFocus: ImageFocus;
}

interface FormState {
  productSlug: string;
  size: string;
  extendable: "" | "tak" | "nie";
  extendLength: string;
  color: string;
  notes: string;
  phone: string;
  email: string;
  source: "" | QuoteSource;
}

interface QuoteFormProps {
  products: QuoteProductOption[];
  initialSlug?: string;
}

export function QuoteForm({ products, initialSlug = "" }: QuoteFormProps) {
  const validInitial =
    initialSlug && products.some((product) => product.slug === initialSlug)
      ? initialSlug
      : "";

  const [form, setForm] = useState<FormState>({
    productSlug: validInitial,
    size: "",
    extendable: "",
    extendLength: "",
    color: "",
    notes: "",
    phone: "",
    email: "",
    source: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [productError, setProductError] = useState(false);

  const selectedProduct = products.find((product) => product.slug === form.productSlug);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setProductError(false);

    if (!form.productSlug || !selectedProduct) {
      setProductError(true);
      return;
    }

    setStatus("loading");

    const result = await sendQuoteRequest({
      productSlug: selectedProduct.slug,
      productTitle: selectedProduct.title,
      size: form.size.trim() || undefined,
      extendable: form.extendable || undefined,
      extendLength:
        form.extendable === "tak" ? form.extendLength.trim() || undefined : undefined,
      color: form.color.trim() || undefined,
      notes: form.notes.trim() || undefined,
      phone: form.phone.trim(),
      email: form.email.trim(),
      source: form.source || undefined,
    });

    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }

    setStatus("success");
    setForm({
      productSlug: "",
      size: "",
      extendable: "",
      extendLength: "",
      color: "",
      notes: "",
      phone: "",
      email: "",
      source: "",
    });
  };

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value as FormState[typeof field] }));
    };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-oak/30 bg-anthracite px-6 py-12 text-center md:px-12 md:py-16"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-oak">Zapytanie wysłane</p>
        <p className="mt-4 font-display text-3xl font-light text-cream md:text-4xl">
          Dziękujemy za zainteresowanie
        </p>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-cream/70">
          Otrzymaliśmy Twoje zapytanie o wycenę. Postaramy się udzielić odpowiedzi jak
          najszybciej.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 inline-flex min-h-[52px] items-center border border-oak/40 px-8 text-sm uppercase tracking-[0.15em] text-cream transition-colors hover:border-oak hover:text-oak"
        >
          Wyślij kolejne zapytanie
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <fieldset>
        <legend className="text-xs uppercase tracking-[0.2em] text-oak">
          Wybierz model stołu *
        </legend>
        <p className="mt-2 text-sm text-muted">Wybierz dokładnie jeden model z naszej oferty.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const selected = form.productSlug === product.slug;

            return (
              <label
                key={product.slug}
                className={`group relative cursor-pointer overflow-hidden border transition-colors ${
                  selected
                    ? "border-oak bg-anthracite"
                    : "border-white/10 hover:border-oak/40"
                }`}
              >
                <input
                  type="radio"
                  name="productSlug"
                  value={product.slug}
                  checked={selected}
                  onChange={() => {
                    setProductError(false);
                    setForm((prev) => ({ ...prev, productSlug: product.slug }));
                  }}
                  className="sr-only"
                />
                <div className="relative aspect-[4/3] bg-graphite">
                  <Image
                    src={product.cover}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className={`object-cover ${IMAGE_FOCUS_CLASS[product.imageFocus]}`}
                  />
                  {selected && (
                    <div className="absolute inset-0 bg-charcoal/35" aria-hidden="true" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 px-3 py-3">
                  <span
                    className={`font-display text-base leading-tight md:text-lg ${
                      selected ? "text-oak" : "text-cream"
                    }`}
                  >
                    {product.title}
                  </span>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selected ? "border-oak bg-oak text-charcoal" : "border-white/20"
                    }`}
                    aria-hidden="true"
                  >
                    {selected ? "✓" : ""}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {productError && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            Wybierz model stołu, aby kontynuować.
          </p>
        )}
      </fieldset>

      <div className="space-y-5 border-t border-white/5 pt-10">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="quote-size"
              className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
            >
              Rozmiar stołu
            </label>
            <input
              id="quote-size"
              type="text"
              value={form.size}
              onChange={update("size")}
              placeholder="np. 160 x 90 cm"
              className="w-full border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors placeholder:text-muted/50 focus:border-oak/50"
            />
          </div>
          <div>
            <label
              htmlFor="quote-extendable"
              className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
            >
              Stół rozkładany?
            </label>
            <select
              id="quote-extendable"
              value={form.extendable}
              onChange={(e) => {
                const value = e.target.value as FormState["extendable"];
                setForm((prev) => ({
                  ...prev,
                  extendable: value,
                  extendLength: value === "tak" ? prev.extendLength : "",
                }));
              }}
              className="w-full appearance-none border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors focus:border-oak/50"
            >
              <option value="">Wybierz (opcjonalnie)</option>
              <option value="nie">Nie</option>
              <option value="tak">Tak</option>
            </select>
          </div>
        </div>

        {form.extendable === "tak" && (
          <div>
            <label
              htmlFor="quote-extend-length"
              className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
            >
              Długość po rozłożeniu
            </label>
            <input
              id="quote-extend-length"
              type="text"
              value={form.extendLength}
              onChange={update("extendLength")}
              placeholder="np. 220 cm"
              className="w-full border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors placeholder:text-muted/50 focus:border-oak/50 sm:max-w-md"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="quote-color"
            className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
          >
            Kolor blatu
          </label>
          <input
            id="quote-color"
            type="text"
            value={form.color}
            onChange={update("color")}
            placeholder="opcjonalnie"
            className="w-full border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors placeholder:text-muted/50 focus:border-oak/50 sm:max-w-md"
          />
        </div>

        <div>
          <label
            htmlFor="quote-notes"
            className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
          >
            Inne informacje
          </label>
          <textarea
            id="quote-notes"
            rows={4}
            value={form.notes}
            onChange={update("notes")}
            placeholder="Dodatkowe uwagi do wyceny (opcjonalnie)"
            className="w-full resize-y border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors placeholder:text-muted/50 focus:border-oak/50"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="quote-phone"
              className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
            >
              Numer telefonu *
            </label>
            <input
              id="quote-phone"
              type="tel"
              required
              value={form.phone}
              onChange={update("phone")}
              className="w-full border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors focus:border-oak/50"
            />
          </div>
          <div>
            <label
              htmlFor="quote-email"
              className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
            >
              Adres e-mail *
            </label>
            <input
              id="quote-email"
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              className="w-full border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors focus:border-oak/50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="quote-source"
            className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
          >
            Skąd o nas wiesz?
          </label>
          <select
            id="quote-source"
            value={form.source}
            onChange={update("source")}
            className="w-full appearance-none border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors focus:border-oak/50"
          >
            <option value="">Wybierz (opcjonalnie)</option>
            {quoteSources.map((source) => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="wood-gradient inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center px-8 text-sm font-medium uppercase tracking-[0.15em] text-charcoal transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
      >
        {status === "loading" ? "Wysyłanie..." : "Poproś o wycenę"}
      </button>
    </form>
  );
}
