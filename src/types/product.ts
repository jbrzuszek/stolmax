export type LegType = "metal" | "wood";
export type LegFilter = "all" | LegType;

export interface ProductMeta {
  title: string;
  description: string;
  specs?: string[];
  featured?: boolean;
  legType?: LegType;
}

export interface Product {
  slug: string;
  title: string;
  description: string;
  specs: string[];
  images: string[];
  featured: boolean;
  legType: LegType;
}

export function filterProducts(products: Product[], filter: LegFilter): Product[] {
  if (filter === "all") return products;
  return products.filter((product) => product.legType === filter);
}
