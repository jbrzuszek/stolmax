"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { sendContactMessage } from "@/actions/contact";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const result = await sendContactMessage({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      message: form.message,
    });

    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }

    setStatus("success");
    setForm(initialState);
  };

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-oak/30 bg-anthracite p-8 text-center"
      >
        <p className="font-display text-2xl text-oak">Wiadomość wysłana!</p>
        <p className="mt-3 text-cream/70">
          Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm uppercase tracking-[0.15em] text-oak hover:opacity-80"
        >
          Wyślij kolejną wiadomość
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
            Imię i nazwisko *
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={update("name")}
            className="w-full border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors focus:border-oak/50"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
            Telefon
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            className="w-full border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors focus:border-oak/50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
          E-mail *
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={update("email")}
          className="w-full border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors focus:border-oak/50"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
          Wiadomość *
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          className="w-full resize-y border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors focus:border-oak/50"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="wood-gradient inline-flex min-h-[52px] w-full items-center justify-center px-8 text-sm font-medium uppercase tracking-[0.15em] text-charcoal transition-opacity disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Wysyłanie..." : "Wyślij wiadomość"}
      </button>
    </form>
  );
}
