import type { MetadataRoute } from "next";
import { getProductSlugs } from "@/lib/products";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const productEntries = getProductSlugs().map((slug) => ({
    url: absoluteUrl(`/oferta/${slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/oferta"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/kontakt"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/wycena"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...productEntries,
  ];
}
