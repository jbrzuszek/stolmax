"use server";

import { z } from "zod";
import { quoteSources } from "@/data/site";
import { escapeHtml, sendSiteEmail, type ActionResult } from "@/lib/email";

const sourceValues = quoteSources.map((source) => source.value) as [
  (typeof quoteSources)[number]["value"],
  ...(typeof quoteSources)[number]["value"][],
];

const contactSchema = z.object({
  name: z.string().trim().min(2, "Podaj imię i nazwisko."),
  email: z.string().trim().email("Podaj prawidłowy adres e-mail."),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(10, "Wiadomość musi mieć co najmniej 10 znaków."),
  source: z.enum(sourceValues).optional(),
});

export type ContactFormInput = z.infer<typeof contactSchema>;

export async function sendContactMessage(input: ContactFormInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane formularza.",
    };
  }

  const { name, email, phone, message, source } = parsed.data;
  const phoneValue = phone?.trim() || "Nie podano";
  const sourceLabel =
    quoteSources.find((item) => item.value === source)?.label ?? "Nie podano";

  return sendSiteEmail({
    subject: `[Stolmax] Wiadomość od ${name}`,
    replyTo: email,
    text: [
      "Nowa wiadomość ze strony stoly.rzeszow.pl",
      "",
      `Imię i nazwisko: ${name}`,
      `E-mail: ${email}`,
      `Telefon: ${phoneValue}`,
      `Skąd o nas wie: ${sourceLabel}`,
      "",
      "Wiadomość:",
      message,
    ].join("\n"),
    html: `
      <h2>Nowa wiadomość ze strony stoly.rzeszow.pl</h2>
      <p><strong>Imię i nazwisko:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-mail:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Telefon:</strong> ${escapeHtml(phoneValue)}</p>
      <p><strong>Skąd o nas wie:</strong> ${escapeHtml(sourceLabel)}</p>
      <hr />
      <p><strong>Wiadomość:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });
}
