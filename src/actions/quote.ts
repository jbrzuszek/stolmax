"use server";

import { z } from "zod";
import { quoteSources } from "@/data/site";
import { escapeHtml, sendSiteEmail, type ActionResult } from "@/lib/email";
import { getProduct } from "@/lib/products";

const sourceValues = quoteSources.map((source) => source.value) as [
  (typeof quoteSources)[number]["value"],
  ...(typeof quoteSources)[number]["value"][],
];

const quoteSchema = z.object({
  productSlug: z.string().min(1, "Wybierz model stołu."),
  productTitle: z.string().min(1, "Wybierz model stołu."),
  size: z.string().optional(),
  extendable: z.enum(["tak", "nie"]).optional(),
  extendLength: z.string().optional(),
  color: z.string().optional(),
  notes: z.string().optional(),
  phone: z.string().trim().min(6, "Podaj numer telefonu."),
  email: z.string().trim().email("Podaj prawidłowy adres e-mail."),
  source: z.enum(sourceValues).optional(),
});

export type QuoteFormInput = z.infer<typeof quoteSchema>;

export async function sendQuoteRequest(input: QuoteFormInput): Promise<ActionResult> {
  const parsed = quoteSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane formularza.",
    };
  }

  const data = parsed.data;
  const product = getProduct(data.productSlug);

  if (!product) {
    return { success: false, error: "Wybrany model stołu nie istnieje." };
  }

  const sourceLabel =
    quoteSources.find((source) => source.value === data.source)?.label ?? "Nie podano";

  const size = data.size?.trim() || "Nie podano";
  const extendable =
    data.extendable === "tak" ? "Tak" : data.extendable === "nie" ? "Nie" : "Nie podano";
  const extendLength =
    data.extendable === "tak"
      ? data.extendLength?.trim() || "Nie podano"
      : data.extendable === "nie"
        ? "Nie dotyczy"
        : "Nie podano";
  const color = data.color?.trim() || "Nie podano";
  const notes = data.notes?.trim() || "Brak";

  return sendSiteEmail({
    subject: `[Stolmax] Zapytanie o wycenę – ${product.title}`,
    replyTo: data.email,
    text: [
      "Nowe zapytanie o wycenę ze strony stoly.rzeszow.pl",
      "",
      `Model: ${product.title}`,
      `Slug: ${product.slug}`,
      `Rozmiar: ${size}`,
      `Rozkładany: ${extendable}`,
      `Długość po rozłożeniu: ${extendLength}`,
      `Kolor blatu: ${color}`,
      `Inne informacje: ${notes}`,
      "",
      `Telefon: ${data.phone}`,
      `E-mail: ${data.email}`,
      `Skąd o nas wie: ${sourceLabel}`,
    ].join("\n"),
    html: `
      <h2>Nowe zapytanie o wycenę – stoly.rzeszow.pl</h2>
      <p><strong>Model:</strong> ${escapeHtml(product.title)}</p>
      <p><strong>Rozmiar:</strong> ${escapeHtml(size)}</p>
      <p><strong>Rozkładany:</strong> ${escapeHtml(extendable)}</p>
      <p><strong>Długość po rozłożeniu:</strong> ${escapeHtml(extendLength)}</p>
      <p><strong>Kolor blatu:</strong> ${escapeHtml(color)}</p>
      <p><strong>Inne informacje:</strong><br>${escapeHtml(notes).replace(/\n/g, "<br>")}</p>
      <hr />
      <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>E-mail:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
      <p><strong>Skąd o nas wie:</strong> ${escapeHtml(sourceLabel)}</p>
    `,
  });
}
