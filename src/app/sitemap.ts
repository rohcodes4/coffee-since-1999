import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://coffeesince1999.in";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/menu`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];
}
