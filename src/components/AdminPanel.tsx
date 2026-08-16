"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addRealization, updateRealization } from "@/actions/realizations";
import type { Realization } from "@/lib/realizations";

const CLIENT_TIMEOUT_MS = 90_000;

type Tab = "add" | "edit";
type FormStatus = "idle" | "loading" | "success" | "error";

interface AdminPanelProps {
  realizations: Realization[];
}

async function runWithTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            "Przekroczono czas oczekiwania (90 s). Spróbuj z mniejszymi zdjęciami JPG (do 2,5 MB).",
          ),
        );
      }, CLIENT_TIMEOUT_MS);
    }),
  ]);
}

export function AdminPanel({ realizations }: AdminPanelProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("add");
  const [items, setItems] = useState(realizations);

  const [addStatus, setAddStatus] = useState<FormStatus>("idle");
  const [addMessage, setAddMessage] = useState("");
  const [addSlug, setAddSlug] = useState("");

  const [selectedSlug, setSelectedSlug] = useState(realizations[0]?.slug ?? "");
  const selected = useMemo(
    () => items.find((item) => item.slug === selectedSlug) ?? null,
    [items, selectedSlug],
  );

  const [editTitle, setEditTitle] = useState(selected?.title ?? "");
  const [editDescription, setEditDescription] = useState(selected?.description ?? "");
  const [editLocation, setEditLocation] = useState(selected?.location ?? "");
  const [editStatus, setEditStatus] = useState<FormStatus>("idle");
  const [editMessage, setEditMessage] = useState("");

  const selectRealization = (slug: string, list: Realization[] = items) => {
    const item = list.find((entry) => entry.slug === slug);
    setSelectedSlug(slug);
    setEditTitle(item?.title ?? "");
    setEditDescription(item?.description ?? "");
    setEditLocation(item?.location ?? "");
    setEditStatus("idle");
    setEditMessage("");
  };

  useEffect(() => {
    setItems(realizations);
    if (realizations.length === 0) {
      setSelectedSlug("");
      setEditTitle("");
      setEditDescription("");
      setEditLocation("");
      return;
    }

    const stillExists = realizations.some((item) => item.slug === selectedSlug);
    if (!stillExists) {
      selectRealization(realizations[0].slug, realizations);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realizations]);

  const handleAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddStatus("loading");
    setAddMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await runWithTimeout(addRealization(formData));
      if (!result.success) {
        setAddStatus("error");
        setAddMessage(result.error);
        return;
      }

      setAddStatus("success");
      setAddMessage(result.message);
      setAddSlug(result.slug);
      form.reset();
      router.refresh();
    } catch (error) {
      setAddStatus("error");
      setAddMessage(
        error instanceof Error ? error.message : "Nie udało się dodać realizacji.",
      );
    }
  };

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;

    setEditStatus("loading");
    setEditMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("slug", selected.slug);
    formData.set("title", editTitle);
    formData.set("description", editDescription);
    formData.set("location", editLocation);

    try {
      const result = await runWithTimeout(updateRealization(formData));
      if (!result.success) {
        setEditStatus("error");
        setEditMessage(result.error);
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.slug === selected.slug
            ? {
                ...item,
                title: editTitle.trim(),
                description: editDescription.trim(),
                location: editLocation.trim() || undefined,
              }
            : item,
        ),
      );

      setEditStatus("success");
      setEditMessage(result.message);
      form.querySelector<HTMLInputElement>('input[type="file"]')?.form?.reset();
      // re-set text fields after possible file input reset of whole form - we use controlled inputs so OK
      router.refresh();
    } catch (error) {
      setEditStatus("error");
      setEditMessage(
        error instanceof Error ? error.message : "Nie udało się zaktualizować realizacji.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setTab("add")}
          className={`cursor-pointer px-4 py-2 text-sm uppercase tracking-[0.15em] transition-colors ${
            tab === "add"
              ? "wood-gradient text-charcoal"
              : "border border-white/10 text-cream/80 hover:border-oak/40 hover:text-oak"
          }`}
        >
          Dodaj
        </button>
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={`cursor-pointer px-4 py-2 text-sm uppercase tracking-[0.15em] transition-colors ${
            tab === "edit"
              ? "wood-gradient text-charcoal"
              : "border border-white/10 text-cream/80 hover:border-oak/40 hover:text-oak"
          }`}
        >
          Edytuj
        </button>
      </div>

      {tab === "add" ? (
        addStatus === "success" ? (
          <div className="border border-oak/30 bg-anthracite p-8 text-center">
            <p className="font-display text-2xl text-oak">Realizacja dodana</p>
            <p className="mt-3 text-cream/70">{addMessage}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href={`/realizacje/${addSlug}`}
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
                  setAddStatus("idle");
                  setAddMessage("");
                  setAddSlug("");
                }}
                className="wood-gradient inline-flex min-h-[48px] cursor-pointer items-center px-6 text-sm font-medium uppercase tracking-[0.15em] text-charcoal transition-transform hover:scale-[1.02]"
              >
                Dodaj kolejną
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAdd} className="space-y-5" encType="multipart/form-data">
            <p className="text-sm text-muted">
              Najlepiej 1–3 zdjęcia JPG/JFIF do 2,5 MB. Nie zamykaj karty podczas wysyłania.
            </p>
            <Field label="Nazwa realizacji *" htmlFor="add-title">
              <input
                id="add-title"
                name="title"
                type="text"
                required
                className={inputClass}
                placeholder="np. Stół loftowy dębowy – Rzeszów"
              />
            </Field>
            <Field label="Opis *" htmlFor="add-description">
              <textarea
                id="add-description"
                name="description"
                required
                rows={5}
                className={inputClass}
                placeholder="Opisz wykonanie, materiały, wymiary..."
              />
            </Field>
            <Field label="Lokalizacja (opcjonalnie)" htmlFor="add-location">
              <input
                id="add-location"
                name="location"
                type="text"
                className={inputClass}
                placeholder="np. Rzeszów, Jasionka"
              />
            </Field>
            <Field label="Zdjęcia * (JPG/JFIF/PNG/WEBP, max 8, do 2,5 MB)" htmlFor="add-images">
              <input
                id="add-images"
                name="images"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,.jfif,.jpeg,.jpg"
                multiple
                required
                className={fileClass}
              />
            </Field>
            <Field label="Hasło administratora *" htmlFor="add-password">
              <input
                id="add-password"
                name="adminPassword"
                type="password"
                required
                autoComplete="current-password"
                className={inputClass}
              />
            </Field>

            {addStatus === "error" && (
              <p className="text-sm text-red-400" role="alert">
                {addMessage}
              </p>
            )}
            {addStatus === "loading" && (
              <p className="text-sm text-oak">Trwa wysyłanie... zwykle 10–60 sekund.</p>
            )}

            <button
              type="submit"
              disabled={addStatus === "loading"}
              className={submitClass}
            >
              {addStatus === "loading" ? "Dodawanie..." : "Dodaj realizację"}
            </button>
          </form>
        )
      ) : items.length === 0 ? (
        <p className="text-cream/60">Brak realizacji do edycji. Najpierw dodaj pierwszą.</p>
      ) : editStatus === "success" ? (
        <div className="border border-oak/30 bg-anthracite p-8 text-center">
          <p className="font-display text-2xl text-oak">Zmiany zapisane</p>
          <p className="mt-3 text-cream/70">{editMessage}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href={`/realizacje/${selectedSlug}`}
              className="inline-flex min-h-[48px] items-center border border-oak/40 px-6 text-sm uppercase tracking-[0.15em] text-cream transition-colors hover:border-oak hover:text-oak"
            >
              Podgląd
            </Link>
            <button
              type="button"
              onClick={() => {
                setEditStatus("idle");
                setEditMessage("");
              }}
              className="wood-gradient inline-flex min-h-[48px] cursor-pointer items-center px-6 text-sm font-medium uppercase tracking-[0.15em] text-charcoal transition-transform hover:scale-[1.02]"
            >
              Edytuj dalej
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleEdit} className="space-y-5" encType="multipart/form-data">
          <Field label="Wybierz realizację *" htmlFor="edit-slug">
            <select
              id="edit-slug"
              value={selectedSlug}
              onChange={(e) => selectRealization(e.target.value)}
              className={`${inputClass} appearance-none`}
            >
              {items.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
          </Field>

          {selected?.images[0] ? (
            <div className="relative aspect-[16/9] max-w-md overflow-hidden bg-graphite">
              <Image
                src={selected.images[0]}
                alt={selected.title}
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
          ) : null}

          <Field label="Nazwa realizacji *" htmlFor="edit-title">
            <input
              id="edit-title"
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Opis *" htmlFor="edit-description">
            <textarea
              id="edit-description"
              required
              rows={5}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Lokalizacja (opcjonalnie)" htmlFor="edit-location">
            <input
              id="edit-location"
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field
            label="Nowe zdjęcia (opcjonalnie – jeśli wybierzesz, zastąpią obecne)"
            htmlFor="edit-images"
          >
            <input
              id="edit-images"
              name="images"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,.jfif,.jpeg,.jpg"
              multiple
              className={fileClass}
            />
          </Field>
          <Field label="Hasło administratora *" htmlFor="edit-password">
            <input
              id="edit-password"
              name="adminPassword"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </Field>

          {editStatus === "error" && (
            <p className="text-sm text-red-400" role="alert">
              {editMessage}
            </p>
          )}
          {editStatus === "loading" && (
            <p className="text-sm text-oak">Zapisywanie zmian... nie zamykaj strony.</p>
          )}

          <button type="submit" disabled={editStatus === "loading"} className={submitClass}>
            {editStatus === "loading" ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full border border-white/10 bg-charcoal px-4 py-3 text-cream outline-none transition-colors placeholder:text-muted/50 focus:border-oak/50";

const fileClass =
  "w-full cursor-pointer border border-white/10 bg-charcoal px-4 py-3 text-sm text-cream file:mr-4 file:border-0 file:bg-oak/20 file:px-3 file:py-1.5 file:text-oak";

const submitClass =
  "wood-gradient inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center px-8 text-sm font-medium uppercase tracking-[0.15em] text-charcoal transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-auto";
