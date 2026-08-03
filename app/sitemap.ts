import type { MetadataRoute } from "next";
import {
  menuCategorySlugs,
  type MenuCategorySlug
} from "@/data/menu-pages";
import { site } from "@/lib/site";

const homeLastModified = new Date("2026-07-31T22:02:47+04:00");
const menuLastModified = new Date("2026-07-31T22:02:47+04:00");

const categoryLastModified: Record<MenuCategorySlug, Date> = {
  shashlyk: new Date("2026-07-31T15:35:40+04:00"),
  "lyulya-kebab": new Date("2026-07-31T15:35:40+04:00"),
  shaurma: new Date("2026-07-31T15:35:40+04:00"),
  burgery: new Date("2026-07-31T15:35:40+04:00"),
  "goryachie-blyuda": new Date("2026-07-31T15:35:40+04:00"),
  garniry: new Date("2026-07-31T15:35:40+04:00"),
  salaty: new Date("2026-07-31T22:02:47+04:00"),
  supy: new Date("2026-07-31T15:35:40+04:00"),
  sousy: new Date("2026-07-31T15:35:40+04:00"),
  napitki: new Date("2026-07-31T15:35:40+04:00")
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: homeLastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${site.url}/menu`,
      lastModified: menuLastModified,
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...menuCategorySlugs.map((category) => ({
      url: `${site.url}/menu/${category}`,
      lastModified: categoryLastModified[category],
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
