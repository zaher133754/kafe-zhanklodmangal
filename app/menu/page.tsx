import type { Metadata } from "next";
import { MenuPageShell } from "@/components/menu/MenuPageShell";
import { fullMenuGroups } from "@/data/menu-pages";
import { menuItems } from "@/data/menu";
import { menuBreadcrumbsJsonLd, menuJsonLd } from "@/lib/menu-json-ld";

export const dynamic = "force-static";

const title = "Полное меню кафе с доставкой в Самаре";
const description =
  "Все 45 блюд «Жан Клод Мангал»: шашлык, люля-кебаб, шаурма, бургеры, горячие блюда, гарниры, салаты, супы, соусы и напитки.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "меню кафе Самара",
    "доставка еды Самара",
    "шашлык Самара",
    "заказать шашлык Самара"
  ],
  alternates: {
    canonical: "/menu"
  },
  openGraph: {
    type: "website",
    url: "/menu",
    title,
    description,
    images: [
      {
        url: menuItems[0].image.src,
        width: menuItems[0].image.width,
        height: menuItems[0].image.height,
        alt: menuItems[0].name
      }
    ]
  }
};

export default function MenuPage() {
  const path = "/menu";

  return (
    <MenuPageShell
      title={title}
      description={description}
      groups={fullMenuGroups}
      activeCategory="all"
      structuredData={[
        menuJsonLd({ name: title, path, groups: fullMenuGroups }),
        menuBreadcrumbsJsonLd({ name: "Меню", path })
      ]}
    />
  );
}
