"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const cover = product.images[0];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={`/oferta/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
          <Image
            src={cover}
            alt={`${product.title} - stoły loftowe Stolmax`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
        </div>
        <div className="mt-4 border-b border-transparent pb-4 transition-colors group-hover:border-oak/30">
          <h3 className="font-display text-xl text-cream transition-colors group-hover:text-oak md:text-2xl">
            {product.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted">{product.description}</p>
        </div>
      </Link>
    </motion.article>
  );
}
