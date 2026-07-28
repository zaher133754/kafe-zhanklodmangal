import type { MenuGroup } from "@/data/menu-pages";
import { site } from "@/lib/site";

function imageUrl(path: string) {
  return new URL(path, `${site.url}/`).href;
}

function menuItemJsonLd(item: MenuGroup["items"][number]) {
  return {
    "@type": "MenuItem",
    name: item.name,
    image: imageUrl(item.image.src),
    ...(item.composition ? { description: item.composition } : {}),
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock"
    }
  };
}

export function menuJsonLd({
  name,
  path,
  groups
}: {
  name: string;
  path: string;
  groups: MenuGroup[];
}) {
  const url = `${site.url}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${url}#menu`,
    name,
    url,
    inLanguage: "ru-RU",
    hasMenuSection: groups.map((group) => ({
      "@type": "MenuSection",
      name: group.title,
      hasMenuItem: group.items.map(menuItemJsonLd)
    }))
  };
}

export function menuBreadcrumbsJsonLd({
  name,
  path
}: {
  name: string;
  path: string;
}) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Главная",
      item: `${site.url}/`
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Меню",
      item: `${site.url}/menu`
    }
  ];

  if (path !== "/menu") {
    items.push({
      "@type": "ListItem",
      position: 3,
      name,
      item: `${site.url}${path}`
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
  };
}
