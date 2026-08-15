import fs from "fs";
import path from "path";
import { productMeta } from "@/data/products";
import { featuredSlugs, metalLegSlugs, offerPrioritySlugs } from "@/data/site";
import type { LegType, Product } from "@/types/product";

export type { LegFilter, LegType, Product, ProductMeta } from "@/types/product";
export { filterProducts } from "@/types/product";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const EXCLUDED_DIRS = new Set(["img"]);

function getOfertaDir() {
  return path.join(process.cwd(), "public", "oferta");
}

export function getProductSlugs(): string[] {
  const dir = getOfertaDir();
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !EXCLUDED_DIRS.has(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "pl"));
}

export function getProductImages(slug: string): string[] {
  const productDir = path.join(getOfertaDir(), slug);
  if (!fs.existsSync(productDir)) return [];

  return fs
    .readdirSync(productDir)
    .filter((file) => IMAGE_EXT.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => `/oferta/${slug}/${file}`);
}

function slugToTitle(slug: string): string {
  return slug
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getProduct(slug: string): Product | null {
  const images = getProductImages(slug);
  if (images.length === 0) return null;

  const meta = productMeta[slug];
  const legType: LegType =
    meta?.legType ??
    (metalLegSlugs.includes(slug as (typeof metalLegSlugs)[number]) ? "metal" : "wood");

  return {
    slug,
    title: meta?.title ?? slugToTitle(slug),
    description: meta?.description ?? "",
    specs: meta?.specs ?? [],
    images,
    featured: meta?.featured ?? featuredSlugs.includes(slug as (typeof featuredSlugs)[number]),
    legType,
  };
}

function sortProducts(products: Product[]): Product[] {
  const priority = new Map(offerPrioritySlugs.map((slug, index) => [slug, index]));

  return [...products].sort((a, b) => {
    const aPriority = priority.get(a.slug as (typeof offerPrioritySlugs)[number]);
    const bPriority = priority.get(b.slug as (typeof offerPrioritySlugs)[number]);

    if (aPriority !== undefined && bPriority !== undefined) return aPriority - bPriority;
    if (aPriority !== undefined) return -1;
    if (bPriority !== undefined) return 1;

    return a.title.localeCompare(b.title, "pl");
  });
}

export function getAllProducts(): Product[] {
  const products = getProductSlugs()
    .map((slug) => getProduct(slug))
    .filter((product): product is Product => product !== null);

  return sortProducts(products);
}

export function getFeaturedProducts(): Product[] {
  return featuredSlugs
    .map((slug) => getProduct(slug))
    .filter((product): product is Product => product !== null);
}
