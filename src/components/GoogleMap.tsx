import { siteConfig } from "@/data/site";

export function GoogleMap() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/5 bg-charcoal lg:aspect-auto lg:min-h-[420px]">
      <div className="absolute inset-0 origin-center scale-[1.02] [filter:invert(92%)_hue-rotate(180deg)_saturate(0.82)_brightness(0.92)_contrast(0.96)]">
        <iframe
          title="Mapa - Stolmax Jasionka"
          src={siteConfig.maps.embedUrl}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-charcoal/20"
        aria-hidden="true"
      />
      <a
        href={siteConfig.maps.placeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 z-20 border border-white/10 bg-charcoal/90 px-3 py-2 text-xs uppercase tracking-[0.12em] text-cream/80 transition-colors hover:border-oak/40 hover:text-oak"
      >
        Otwórz wizytówkę
      </a>
    </div>
  );
}
