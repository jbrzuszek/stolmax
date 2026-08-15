import Link from "next/link";
import { siteConfig } from "@/data/site";

export function Footer() {
  const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`;

  return (
    <footer className="border-t border-white/5 bg-anthracite">
      <div className="container-narrow section-padding grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-2">
          <p className="font-display text-3xl font-semibold text-cream">Stolmax</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            {siteConfig.footerDescription}
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-oak">Nawigacja</h2>
          <ul className="space-y-2 text-sm text-cream/80">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-oak">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={siteConfig.colorsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-oak"
              >
                Kolorystyka
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-oak">Kontakt</h2>
          <address className="space-y-2 text-sm not-italic text-cream/80">
            <p>{siteConfig.legalName}</p>
            <p>{fullAddress}</p>
            <p>
              <a href={`tel:${siteConfig.phoneHref}`} className="transition-colors hover:text-oak">
                {siteConfig.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors hover:text-oak"
              >
                {siteConfig.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center text-xs text-muted">
        <p>
          &copy; {new Date().getFullYear()} Stolmax. Wszelkie prawa zastrzeżone. Stoły loftowe
          Rzeszów &middot; Jasionka &middot; Podkarpacie
        </p>
      </div>
    </footer>
  );
}
