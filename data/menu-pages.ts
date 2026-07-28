import { menuItems, type MenuItemWithImage } from "@/data/menu";

export const menuCategorySlugs = [
  "shashlyk",
  "shaurma",
  "burgery",
  "goryachie-blyuda",
  "garniry",
  "salaty",
  "supy",
  "sousy",
  "napitki"
] as const;

export type MenuCategorySlug = (typeof menuCategorySlugs)[number];

type MenuCategoryPage = {
  slug: MenuCategorySlug;
  label: string;
  heading: string;
  shortDescription: string;
  metaDescription: string;
  keywords: string[];
};

export const menuCategoryPages: readonly MenuCategoryPage[] = [
  {
    slug: "shashlyk",
    label: "Шашлык",
    heading: "Шашлык с доставкой по Самаре",
    shortDescription:
      "Шашлык, куриные крылья и люля-кебаб с мангала: фотографии, актуальный вес и цены.",
    metaDescription:
      "Заказать шашлык и люля-кебаб с доставкой по Самаре. Свинина, курица, говядина и куриные крылья с мангала — фото, вес и цены.",
    keywords: [
      "шашлык Самара",
      "доставка шашлыка Самара",
      "заказать шашлык Самара",
      "люля кебаб Самара",
      "доставка люля кебаб Самара"
    ]
  },
  {
    slug: "shaurma",
    label: "Шаурма",
    heading: "Шаурма с доставкой по Самаре",
    shortDescription:
      "Шаурма с курицей, говядиной, свининой и овощами — фотографии, вес и цены.",
    metaDescription:
      "Заказать шаурму с доставкой по Самаре: с курицей, говядиной, свининой или овощами. Фотографии, вес и актуальные цены.",
    keywords: ["шаурма Самара", "доставка шаурмы Самара", "заказать шаурму"]
  },
  {
    slug: "burgery",
    label: "Бургеры",
    heading: "Бургеры с доставкой по Самаре",
    shortDescription:
      "Бифбургеры и чикенбургеры от «Жан Клод Мангал» — фотографии, вес и цены.",
    metaDescription:
      "Заказать бургеры с доставкой по Самаре. Бифбургеры и чикенбургеры от кафе «Жан Клод Мангал» — фотографии, вес и актуальные цены.",
    keywords: ["бургеры Самара", "доставка бургеров Самара", "заказать бургер"]
  },
  {
    slug: "goryachie-blyuda",
    label: "Горячие блюда",
    heading: "Горячие блюда с доставкой по Самаре",
    shortDescription:
      "Паста, мясные блюда и хачапури на углях — фотографии, вес и актуальные цены.",
    metaDescription:
      "Горячие блюда с доставкой по Самаре от кафе «Жан Клод Мангал»: паста, свиная шея, пюре с люля и хачапури на углях. Фото, вес и цены.",
    keywords: [
      "горячие блюда Самара",
      "доставка горячих блюд Самара",
      "заказать горячую еду"
    ]
  },
  {
    slug: "garniry",
    label: "Гарниры",
    heading: "Гарниры с доставкой по Самаре",
    shortDescription:
      "Картофель, овощи и грибы на углях, лаваш и лепёшка к основным блюдам.",
    metaDescription:
      "Гарниры с доставкой по Самаре: картофель, овощи и грибы на углях, картофель фри, лаваш и лепёшка. Фотографии, вес и цены.",
    keywords: ["гарниры Самара", "гарниры на мангале", "овощи на углях Самара"]
  },
  {
    slug: "salaty",
    label: "Салаты",
    heading: "Салаты с доставкой по Самаре",
    shortDescription:
      "Свежие и сытные салаты к блюдам на мангале — фотографии, вес и цены.",
    metaDescription:
      "Заказать салаты с доставкой по Самаре: Цезарь, Греческий, Летний и фирменные салаты кафе «Жан Клод Мангал». Фото, вес и цены.",
    keywords: ["салаты Самара", "доставка салатов Самара", "заказать салат"]
  },
  {
    slug: "supy",
    label: "Супы",
    heading: "Супы с доставкой по Самаре",
    shortDescription:
      "Борщ, солянка, харчо и куриный суп — фотографии, объём порции и цены.",
    metaDescription:
      "Заказать супы с доставкой по Самаре: борщ, солянка, харчо и куриный суп. Фотографии, объём порции и актуальные цены.",
    keywords: ["супы Самара", "доставка супов Самара", "заказать суп"]
  },
  {
    slug: "sousy",
    label: "Соусы",
    heading: "Соусы к шашлыку и блюдам на мангале",
    shortDescription:
      "Острый, сырный, шашлычный соус и цехтон к вашему заказу.",
    metaDescription:
      "Соусы к шашлыку и блюдам на мангале: острый, сырный, шашлычный и цехтон. Объём порции и актуальные цены.",
    keywords: ["соус к шашлыку", "шашлычный соус Самара", "соусы доставка"]
  },
  {
    slug: "napitki",
    label: "Напитки",
    heading: "Напитки с доставкой по Самаре",
    shortDescription:
      "Газированные напитки к шашлыку, шаурме и бургерам — объём и цены.",
    metaDescription:
      "Напитки с доставкой по Самаре к вашему заказу: Добрый Кола и лимонады Черноголовка. Фотографии, объём и цены.",
    keywords: ["напитки доставка Самара", "лимонад Самара", "напитки к шашлыку"]
  }
] as const;

export function isMenuCategorySlug(value: string): value is MenuCategorySlug {
  return menuCategorySlugs.includes(value as MenuCategorySlug);
}

export function getMenuCategoryPage(slug: MenuCategorySlug) {
  return menuCategoryPages.find((category) => category.slug === slug)!;
}

export function getMenuCategoryItems(
  slug: MenuCategorySlug
): MenuItemWithImage[] {
  switch (slug) {
    case "shashlyk":
      return menuItems.filter((item) => item.category === "Шашлык");
    case "goryachie-blyuda":
      return menuItems.filter((item) => item.category === "Горячие блюда");
    case "shaurma":
      return menuItems.filter((item) => item.category === "Шаурма");
    case "burgery":
      return menuItems.filter((item) => item.category === "Бургеры");
    case "garniry":
      return menuItems.filter((item) => item.category === "Гарниры");
    case "salaty":
      return menuItems.filter((item) => item.category === "Салаты");
    case "supy":
      return menuItems.filter((item) => item.category === "Супы");
    case "sousy":
      return menuItems.filter((item) => item.category === "Соусы");
    case "napitki":
      return menuItems.filter((item) => item.category === "Напитки");
  }
}

export type MenuGroup = {
  id: string;
  title: string;
  items: MenuItemWithImage[];
};

export const fullMenuGroups: MenuGroup[] = menuCategorySlugs.map((slug) => ({
  id: slug,
  title: getMenuCategoryPage(slug).label,
  items: getMenuCategoryItems(slug)
}));

export const featuredMenuGroups: MenuGroup[] = fullMenuGroups.slice(0, 4);
