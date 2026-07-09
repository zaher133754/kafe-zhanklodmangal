export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://zhanklodmangal.ru";

export const site = {
  name: "ЖанКлод Мангал",
  legalName: "Жан Клод Мангал",
  title: "Шашлык с доставкой в Самаре — Жан Клод Мангал",
  description:
    "Кафе «Жан Клод Мангал» — шашлык, люля-кебаб, шаурма, бургеры и блюда на мангале с доставкой по Самаре. Закажите онлайн или приходите к нам.",
  keywords: ["Шашлык", "Шаурма", "Бургер", "Доставка", "Самара"],
  url: siteUrl,
  address: "Самара, просп. Кирова, 393В",
  yandexMapsUrl:
    "https://yandex.com/maps/51/samara/house/prospekt_kirova_393v/YUkYdAVkQUUPQFtpfX50cXRrYA==/",
  yandexOrgUrl: "https://yandex.ru/maps/org/zhan_klod_mangal/222834997712/",
  promotionsUrl:
    "https://yandex.ru/maps/org/zhan_klod_mangal/222834997712/?tab=posts",
  phones: [
    { label: "+7 (927) 010-47-25", href: "tel:+79270104725" },
    { label: "+7 (903) 308-62-89", href: "tel:+79033086289" }
  ],
  orderPhone: { label: "+7 (903) 308-62-89", href: "tel:+79033086289" },
  telegram: "http://t.me/mangaljanklod",
  instagram: "https://www.instagram.com/mangalzhanklod/",
  openingHours: [
    "11:00–00:00 (Пт - Сб)",
    "11:00–23:00 (Вс - Чт)"
  ]
} as const;

export const navItems = [
  { label: "О нас", href: "#onas", external: false },
  { label: "Меню", href: "#menu", external: false },
  { label: "Банкеты", href: "#ban", external: false },
  { label: "Отзывы", href: "#reviews", external: false },
  { label: "Контакты", href: "#contacts", external: false }
] as const;

export const images = {
  logo: "/images/logo.webp",
  hero: "/images/hero-shashlik.webp",
  og: "/images/og-zhanklod.webp",
  social: {
    telegram: "/images/social-telegram.webp",
    instagram: "/images/social-instagram.webp"
  },
  about: [
    {
      src: "/images/about-kebab.webp",
      alt: "Шашлык и мясо на шампурах в ЖанКлод Мангал"
    },
    {
      src: "/images/about-grill.webp",
      alt: "Блюда с мангала, овощи и лаваш"
    },
    {
      src: "/images/about-dessert.webp",
      alt: "Десерт и напиток в кафе ЖанКлод Мангал"
    }
  ],
  menu: [
    {
      src: "/images/menu-page-01.webp",
      alt: "Страница меню ЖанКлод Мангал 1"
    },
    {
      src: "/images/menu-page-02.webp",
      alt: "Страница меню ЖанКлод Мангал 2"
    },
    {
      src: "/images/menu-page-03.webp",
      alt: "Страница меню ЖанКлод Мангал 3"
    },
    {
      src: "/images/menu-page-04.webp",
      alt: "Страница меню ЖанКлод Мангал 4"
    },
    {
      src: "/images/menu-page-05.webp",
      alt: "Страница меню ЖанКлод Мангал 5"
    },
    {
      src: "/images/menu-page-06.webp",
      alt: "Страница меню ЖанКлод Мангал 6"
    },
    {
      src: "/images/menu-page-07.webp",
      alt: "Страница меню ЖанКлод Мангал 7"
    },
    {
      src: "/images/menu-page-08.webp",
      alt: "Страница меню ЖанКлод Мангал 8"
    },
    {
      src: "/images/menu-page-09.webp",
      alt: "Страница меню ЖанКлод Мангал 9"
    },
    {
      src: "/images/menu-page-10.webp",
      alt: "Страница меню ЖанКлод Мангал 10"
    }
  ],
  banquets: [
    {
      src: "/images/banquet-table.webp",
      alt: "Банкетный стол с блюдами ЖанКлод Мангал"
    },
    {
      src: "/images/banquet-hall.webp",
      alt: "Тёплая атмосфера для торжества"
    },
    {
      src: "/images/banquet-food.webp",
      alt: "Блюда для банкетов и встреч"
    }
  ]
} as const;
