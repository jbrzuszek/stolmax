"use client";

import Image from "next/image";
import Link from "next/link";
import type { Realization } from "@/lib/realizations";

interface RealizationCardProps {
  realization: Realization;
  priority?: boolean;
}

export function RealizationCard({ realization, priority = false }: RealizationCardProps) {
  const cover = realization.images[0];

  return (
    <article className="group">
      <Link href={`/realizacje/${realization.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-graphite">
          {cover ? (
            <Image
              src={cover}
              alt={`${realization.title} – realizacja stołu loftowego Stolmax`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
        <div className="mt-4 border-b border-transparent pb-4 transition-colors group-hover:border-oak/30">
          <h3 className="font-display text-xl text-cream transition-colors group-hover:text-oak md:text-2xl">
            {realization.title}
          </h3>
          {realization.location ? (
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-oak/80">
              {realization.location}
            </p>
          ) : null}
          <p className="mt-2 line-clamp-2 text-sm text-muted">{realization.description}</p>
        </div>
      </Link>
    </article>
  );
}
