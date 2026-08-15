import fs from "fs";
import path from "path";
import realizationsData from "@/data/realizations.json";

export interface Realization {
  slug: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
  location?: string;
}

function readRealizations(): Realization[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "realizations.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as Realization[];
  } catch {
    return realizationsData as Realization[];
  }
}

export function getAllRealizations(): Realization[] {
  return [...readRealizations()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getRealization(slug: string): Realization | null {
  return getAllRealizations().find((item) => item.slug === slug) ?? null;
}

export function getRealizationSlugs(): string[] {
  return getAllRealizations().map((item) => item.slug);
}

export function getLatestRealizations(limit = 3): Realization[] {
  return getAllRealizations().slice(0, limit);
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź|ż/g, "z")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniqueRealizationSlug(title: string, existing: string[]): string {
  const base = slugifyTitle(title) || `realizacja-${Date.now()}`;
  if (!existing.includes(base)) return base;

  let index = 2;
  while (existing.includes(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}
