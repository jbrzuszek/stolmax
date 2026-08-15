import { siteConfig } from "@/data/site";
import { absoluteUrl } from "@/lib/seo";
import { getAllProducts } from "@/lib/products";

export const runtime = "nodejs";

export function GET() {
  const products = getAllProducts();
  const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`;

  const body = `# ${siteConfig.name}

> ${siteConfig.tagline}

${siteConfig.description}

## Strony

- [Strona główna](${absoluteUrl("/")}): ${siteConfig.tagline}
- [Oferta](${absoluteUrl("/oferta")}): katalog stołów loftowych na wymiar
- [Poproś o wycenę](${absoluteUrl("/wycena")}): formularz wyceny z wyborem modelu
- [Kontakt](${absoluteUrl("/kontakt")}): formularz kontaktowy i dane firmy

## Firma

- Nazwa: ${siteConfig.name}
- Nazwa prawna: ${siteConfig.legalName}
- Adres: ${fullAddress}
- Telefon: ${siteConfig.phone}
- E-mail: ${siteConfig.email}
- Google Maps: ${siteConfig.maps.placeUrl}
- Działalność od: ${siteConfig.founded}

## Produkty

${products.map((product) => `- [${product.title}](${absoluteUrl(`/oferta/${product.slug}`)}): ${product.description}`).join("\n")}

## Pliki maszynowe

- Sitemap: ${absoluteUrl("/sitemap.xml")}
- Robots: ${absoluteUrl("/robots.txt")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
