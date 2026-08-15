"use server";

import { z } from "zod";
import { escapeHtml, sendSiteEmail, type ActionResult } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Podaj imię i nazwisko."),
  email: z.string().trim().email("Podaj prawidłowy adres e-mail."),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(10, "Wiadomość musi mieć co najmniej 10 znaków."),
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

  const { name, email, phone, message } = parsed.data;
  const phoneValue = phone?.trim() || "Nie podano";

  return sendSiteEmail({
    subject: `[Stolmax] Wiadomość od ${name}`,
    replyTo: email,
    text: [
      "Nowa wiadomość ze strony stoly.rzeszow.pl",
      "",
      `Imię i nazwisko: ${name}`,
      `E-mail: ${email}`,
      `Telefon: ${phoneValue}`,
      "",
      "Wiadomość:",
      message,
    ].join("\n"),
    html: `
      <h2>Nowa wiadomość ze strony stoly.rzeszow.pl</h2>
      <p><strong>Imię i nazwisko:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-mail:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Telefon:</strong> ${escapeHtml(phoneValue)}</p>
      <hr />
      <p><strong>Wiadomość:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });
}
