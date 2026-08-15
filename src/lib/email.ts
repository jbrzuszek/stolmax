import { Resend } from "resend";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

const MAIL_FROM = "Stolmax <onboarding@resend.dev>";
const MAIL_TO = "j.brzuszek@vp.pl";

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

export async function sendSiteEmail({
  subject,
  replyTo,
  text,
  html,
}: {
  subject: string;
  replyTo: string;
  text: string;
  html: string;
}): Promise<ActionResult> {
  const resend = getResendClient();

  if (!resend) {
    console.error("Brak RESEND_API_KEY w zmiennych środowiskowych.");
    return {
      success: false,
      error:
        "Formularz nie jest jeszcze skonfigurowany. Prosimy o kontakt telefoniczny lub mailowy.",
    };
  }

  const { error } = await resend.emails.send({
    from: MAIL_FROM,
    to: MAIL_TO,
    replyTo,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    return {
      success: false,
      error: "Nie udało się wysłać wiadomości. Spróbuj ponownie później.",
    };
  }

  return { success: true };
}
