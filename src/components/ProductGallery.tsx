"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxOpen, activeIndex, goTo]);

  if (images.length === 0) return null;

  const activeImage = images[activeIndex];

  return (
    <>
      <div className="w-full min-w-0 max-w-full space-y-4">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative block aspect-[4/3] w-full max-w-full cursor-zoom-in overflow-hidden bg-graphite"
          aria-label="Powiększ zdjęcie"
        >
          <Image
            src={activeImage}
            alt={`${title} - zdjęcie ${activeIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        </button>

        {images.length > 1 && (
          <div className="flex w-full min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden border-2 sm:w-24 ${
                  index === activeIndex ? "border-oak" : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`Miniatura ${index + 1}`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 p-4 md:p-8"
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Galeria zdjęć"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center text-2xl text-cream/80 transition-colors hover:text-oak md:right-8 md:top-8"
              aria-label="Zamknij"
            >
              &times;
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIndex - 1);
                  }}
                  className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-3xl text-cream/80 transition-colors hover:text-oak md:left-6"
                  aria-label="Poprzednie zdjęcie"
                >
                  &#10094;
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIndex + 1);
                  }}
                  className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-3xl text-cream/80 transition-colors hover:text-oak md:right-6"
                  aria-label="Następne zdjęcie"
                >
                  &#10095;
                </button>
              </>
            )}

            <motion.div
              key={activeImage}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-[70vh] w-full max-w-6xl cursor-zoom-out"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeImage}
                alt={`${title} - powiększenie`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>

            <p className="absolute bottom-4 text-sm text-muted">
              {activeIndex + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
