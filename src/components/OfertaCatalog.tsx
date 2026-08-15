"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import type { LegFilter, Product } from "@/types/product";
import { filterProducts } from "@/types/product";

interface OfertaCatalogProps {
  products: Product[];
}

const filters: { value: LegFilter; label: string }[] = [
  { value: "all", label: "Wszystkie stoły" },
  { value: "metal", label: "Nogi metalowe" },
  { value: "wood", label: "Nogi drewniane" },
];

export function OfertaCatalog({ products }: OfertaCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<LegFilter>("all");

  const filteredProducts = useMemo(
    () => filterProducts(products, activeFilter),
    [products, activeFilter],
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              aria-pressed={isActive}
              className={`min-h-[44px] cursor-pointer px-5 text-sm uppercase tracking-[0.12em] transition-colors ${
                isActive
                  ? "wood-gradient text-charcoal"
                  : "border border-white/10 text-cream/80 hover:border-oak/40 hover:text-oak"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <p className="text-center text-muted">Brak stołów w wybranej kategorii.</p>
      )}
    </div>
  );
}
