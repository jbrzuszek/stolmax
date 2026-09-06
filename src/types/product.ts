export type LegType = "metal" | "wood";
export type LegFilter = "all" | LegType;
/** CSS object-position Y */
export type ImageFocus = "center" | "slight" | "mid" | "soft" | "bottom";

export const IMAGE_FOCUS_CLASS: Record<ImageFocus, string> = {
  center: "object-center",
  slight: "object-[center_68%]",
  mid: "object-[center_62%]",
  soft: "object-[center_78%]",
  bottom: "object-bottom",
};

export interface ProductMeta {
  title: string;
  description: string;
  specs?: string[];
  featured?: boolean;
  legType?: LegType;
  imageFocus?: ImageFocus;
}

export interface Product {
  slug: string;
  title: string;
  description: string;
  specs: string[];
  images: string[];
  featured: boolean;
  legType: LegType;
  imageFocus: ImageFocus;
  /** Nadpisanie kadru dla konkretnych ścieżek zdjęć */
  imageFocusByPath: Record<string, ImageFocus>;
}

export function filterProducts(products: Product[], filter: LegFilter): Product[] {
  if (filter === "all") return products;
  return products.filter((product) => product.legType === filter);
}
