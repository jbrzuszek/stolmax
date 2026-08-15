import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import type { Product } from "@/types/product";

export const SEO_IDS = {
  organization: `${siteConfig.url}/#organization`,
  localBusiness: `${siteConfig.url}/#localbusiness`,
  website: `${siteConfig.url}/#website`,
} as const;

export const DEFAULT_OG_IMAGE = "/oferta/pajak/img1.jpg";

export function absoluteUrl(path = ""): string {
  return new URL(path, siteConfig.url).toString();
}

function postalAddress() {
  return {
    "@type": "PostalAddress" as const,
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    postalCode: siteConfig.address.postalCode,
    addressRegion: siteConfig.address.region,
    addressCountry: siteConfig.address.country,
  };
}

export function buildGlobalSchemaGraph() {
  const organization = {
    "@type": "Organization",
    "@id": SEO_IDS.organization,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl("/favicon.png"),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    email: siteConfig.email,
    telephone: siteConfig.phoneHref,
    foundingDate: String(siteConfig.founded),
    description: siteConfig.description,
    address: postalAddress(),
    sameAs: [siteConfig.maps.placeUrl],
    knowsAbout: [
      "stoły loftowe",
      "stoły na wymiar",
      "meble industrialne",
      "stoły rozkładane",
    ],
  };

  const localBusiness = {
    "@type": ["LocalBusiness", "FurnitureStore"],
    "@id": SEO_IDS.localBusiness,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phoneHref,
    email: siteConfig.email,
    foundingDate: String(siteConfig.founded),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    logo: absoluteUrl("/favicon.png"),
    address: postalAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    hasMap: siteConfig.maps.placeUrl,
    parentOrganization: { "@id": SEO_IDS.organization },
    areaServed: [
      { "@type": "City", name: "Rzeszów" },
      { "@type": "AdministrativeArea", name: "Podkarpacie" },
      { "@type": "Place", name: "Jasionka" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phoneHref,
        email: siteConfig.email,
        contactType: "customer service",
        areaServed: "PL",
        availableLanguage: ["Polish"],
      },
    ],
    priceRange: "$$",
    knowsAbout: organization.knowsAbout,
    sameAs: [siteConfig.maps.placeUrl],
  };

  const website = {
    "@type": "WebSite",
    "@id": SEO_IDS.website,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "pl-PL",
    publisher: { "@id": SEO_IDS.organization },
    about: { "@id": SEO_IDS.localBusiness },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, localBusiness, website],
  };
}

export function buildWebPageSchema({
  path,
  name,
  pageType = "WebPage",
}: {
  path: string;
  name: string;
  pageType?: "WebPage" | "ContactPage" | "CollectionPage" | "ItemPage";
}) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": `${url}#webpage`,
    url,
    name,
    inLanguage: "pl-PL",
    isPartOf: { "@id": SEO_IDS.website },
    about: { "@id": SEO_IDS.localBusiness },
    publisher: { "@id": SEO_IDS.organization },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildItemListSchema(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/oferta#itemlist"),
    name: "Oferta stołów loftowych Stolmax",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.title,
      url: absoluteUrl(`/oferta/${product.slug}`),
    })),
  };
}

export function buildProductSchema(product: Product) {
  const url = absoluteUrl(`/oferta/${product.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.title,
    description: product.description,
    url,
    image: product.images.map((image) => absoluteUrl(image)),
    category: "Stoły loftowe",
    brand: { "@id": SEO_IDS.organization },
    manufacturer: { "@id": SEO_IDS.organization },
    offers: {
      "@type": "Offer",
      url: absoluteUrl("/wycena"),
      availability: "https://schema.org/InStock",
      priceCurrency: "PLN",
      seller: { "@id": SEO_IDS.organization },
    },
    ...(product.specs.length > 0
      ? {
          additionalProperty: product.specs.map((spec) => ({
            "@type": "PropertyValue",
            name: "Specyfikacja",
            value: spec,
          })),
        }
      : {}),
  };
}

export function buildPageMetadata({
  title,
  description,
  path,
  ogImage,
  ogTitle,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogTitle?: string;
}): Metadata {
  const canonical = absoluteUrl(path);
  const image = absoluteUrl(ogImage ?? DEFAULT_OG_IMAGE);
  const openGraphTitle = ogTitle ?? title;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url: canonical,
      siteName: siteConfig.name,
      title: openGraphTitle,
      description,
      images: [{ url: image, alt: `${siteConfig.name} – ${openGraphTitle}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description,
      images: [image],
    },
  };
}
