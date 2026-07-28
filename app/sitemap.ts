import type { MetadataRoute } from "next";
import { menuCategorySlugs } from "@/data/menu-pages";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-28");

  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${site.url}/menu`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...menuCategorySlugs.map((category) => ({
      url: `${site.url}/menu/${category}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
