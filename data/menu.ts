export type MenuItem = {
  id: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  weight: string;
  image?: string;
  popular?: boolean;
};

export const menuSource = {
  name: "Яндекс Карты / Яндекс Еда",
  url: "https://yandex.ru/maps/org/zhan_klod_mangal/222834997712/menu/",
  verifiedAt: "2026-07-07",
  note:
    "В карточке Яндекс.Карт указано: «Обновлено вчера. Источник: Яндекс Еда». На месте блюда и цены могут отличаться."
} as const;

export const menuCategories = [
  "Шашлык",
  "Горячие блюда",
  "Шаурма",
  "Бургеры",
  "Гарниры",
  "Салаты",
  "Супы",
  "Соусы",
  "Напитки"
] as const;

const rawMenuItems: MenuItem[] = [
  {
    id: "griby-na-uglyah",
    category: "Гарниры",
    name: "Грибы на углях",
    price: 229,
    weight: "150 г",
    image: "/menu/%D0%93%D1%80%D0%B8%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D1%83%D0%B3%D0%BB%D1%8F%D1%85.jfif"
  },
  {
    id: "kartofel-na-uglyah",
    category: "Гарниры",
    name: "Картофель на углях",
    price: 179,
    weight: "200 г",
    image: "/menu/%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B5%D0%BB%D1%8C%20%D0%BD%D0%B0%20%D1%83%D0%B3%D0%BB%D1%8F%D1%85.jfif",
    popular: true
  },
  {
    id: "kartofel-fri",
    category: "Гарниры",
    name: "Картофель фри",
    price: 169,
    weight: "200 г",
    image: "/menu/%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%84%D0%B5%D0%BB%D1%8C%20%D1%84%D1%80%D0%B8.jfif"
  },
  {
    id: "kartoshka-po-derevenski",
    category: "Гарниры",
    name: "Картошка по-деревенски",
    price: 179,
    weight: "200 г",
    image: "/menu/%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%88%D0%BA%D0%B0%20%D0%BF%D0%BE-%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%B5%D0%BD%D1%81%D0%BA%D0%B8.jfif"
  },
  {
    id: "lavash-tonkiy",
    category: "Гарниры",
    name: "Лаваш тонкий",
    price: 40,
    weight: "50 г",
    image: "/menu/%D0%9B%D0%B0%D0%B2%D0%B0%D1%88%20%D1%82%D0%BE%D0%BD%D0%BA%D0%B8%D0%B9.jfif"
  },
  {
    id: "ovoshchi-na-uglyah",
    category: "Гарниры",
    name: "Овощи на углях",
    price: 339,
    weight: "300 г",
    image: "/menu/%D0%9E%D0%B2%D0%BE%D1%89%D0%B8%20%D0%BD%D0%B0%20%D1%83%D0%B3%D0%BB%D1%8F%D1%85.jfif"
  },
  {
    id: "polovinka-lepeshki",
    category: "Гарниры",
    name: "Половинка лепешки",
    price: 51,
    weight: "50 г",
    image: "/menu/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B2%D0%B8%D0%BD%D0%BA%D0%B0%20%D0%BB%D0%B5%D0%BF%D0%B5%D1%88%D0%BA%D0%B8.jfif"
  },
  {
    id: "armeniya",
    category: "Салаты",
    name: "Армения",
    price: 339,
    weight: "180 г"
  },
  {
    id: "letniy",
    category: "Салаты",
    name: "Летний",
    price: 249,
    weight: "170 г"
  },
  {
    id: "salat-grecheskiy",
    category: "Салаты",
    name: "Салат Греческий",
    price: 339,
    weight: "180 г"
  },
  {
    id: "salat-cezar-s-krevetkami",
    category: "Салаты",
    name: "Салат Цезарь с креветками",
    price: 399,
    weight: "180 г"
  },
  {
    id: "salat-cezar-s-kuritsey",
    category: "Салаты",
    name: "Салат Цезарь с курицей",
    price: 399,
    weight: "180 г"
  },
  {
    id: "salat-firmennyy-zhan-klod-mangal",
    category: "Салаты",
    name: "Салат фирменный Жан Клод Мангал",
    price: 339,
    weight: "180 г"
  },
  {
    id: "kurinye-krylya-gril",
    category: "Шашлык",
    name: "Куриные крылья гриль в пикантном маринаде с хрустящей корочкой",
    price: 359,
    weight: "250 г"
  },
  {
    id: "kurinyy-lyulya-kebab",
    category: "Шашлык",
    name: "Куриный люля-кебаб с восточными специями",
    price: 399,
    weight: "200 г"
  },
  {
    id: "lyulya-kebab-iz-sochnoy-govyadiny",
    category: "Шашлык",
    name: "Люля-кебаб из сочной говядины",
    price: 429,
    weight: "200 г",
    popular: true
  },
  {
    id: "shashlyk-iz-kurinogo-file",
    category: "Шашлык",
    name: "Шашлык из куриного филе",
    price: 419,
    weight: "300 г"
  },
  {
    id: "shashlyk-iz-svinoy-koreyki",
    category: "Шашлык",
    name: "Шашлык из свиной корейки, томленный на углях",
    price: 499,
    weight: "300 г"
  },
  {
    id: "shashlyk-iz-svinoy-sheyki",
    category: "Шашлык",
    name: "Шашлык из свиной шейки",
    price: 539,
    weight: "300 г",
    popular: true
  },
  {
    id: "nezhnoe-pyure-s-aromatnym-lyulya",
    category: "Горячие блюда",
    name: "Нежное пюре с ароматным люля",
    price: 269,
    weight: "400 г"
  },
  {
    id: "pasta-s-bekonom",
    category: "Горячие блюда",
    name: "Паста с беконом",
    price: 359,
    weight: "250 г"
  },
  {
    id: "pasta-s-kuritsey-i-gribami",
    category: "Горячие блюда",
    name: "Паста с курицей и грибами",
    price: 299,
    weight: "300 г"
  },
  {
    id: "sochnaya-svinaya-sheya-s-hrustyashchimi-dolkami",
    category: "Горячие блюда",
    name: "Сочная свиная шея с хрустящими дольками",
    price: 339,
    weight: "250 г"
  },
  {
    id: "hachapuri-na-uglyah-v-lavashe",
    category: "Горячие блюда",
    name: "Хачапури на углях в лаваше",
    price: 299,
    weight: "200 г"
  },
  {
    id: "sochnyy-bbq-bifburger",
    category: "Бургеры",
    name: "Сочный BBQ Бифбургер",
    price: 419,
    weight: "250 г"
  },
  {
    id: "sochnyy-bbq-bifburger-s-bekonom",
    category: "Бургеры",
    name: "Сочный BBQ Бифбургер с беконом",
    price: 405,
    weight: "250 г"
  },
  {
    id: "firmennyy-chikenburger-ot-shefa",
    category: "Бургеры",
    name: "Фирменный Чикенбургер от шефа",
    price: 599,
    weight: "300 г"
  },
  {
    id: "hrustyashchiy-chikenburger-bbq-s-bekonom",
    category: "Бургеры",
    name: "Хрустящий Чикенбургер BBQ с беконом",
    price: 389,
    weight: "250 г"
  },
  {
    id: "sous-ostryy",
    category: "Соусы",
    name: "Соус Острый",
    price: 65,
    weight: "50 г"
  },
  {
    id: "sous-syrnyy",
    category: "Соусы",
    name: "Соус Сырный",
    price: 65,
    weight: "50 г"
  },
  {
    id: "sous-cekhton",
    category: "Соусы",
    name: "Соус Цехтон",
    price: 65,
    weight: "50 г"
  },
  {
    id: "sous-shashlychnyy",
    category: "Соусы",
    name: "Соус Шашлычный",
    price: 65,
    weight: "50 г"
  },
  {
    id: "borshch",
    category: "Супы",
    name: "Борщ",
    price: 279,
    weight: "500 г"
  },
  {
    id: "solyanka",
    category: "Супы",
    name: "Солянка",
    price: 359,
    weight: "500 г"
  },
  {
    id: "sup-kurinyy",
    category: "Супы",
    name: "Суп Куриный",
    price: 259,
    weight: "500 г"
  },
  {
    id: "harcho",
    category: "Супы",
    name: "Харчо",
    price: 299,
    weight: "500 г"
  },
  {
    id: "vegetarianskaya-shaurma",
    category: "Шаурма",
    name: "Вегетарианская шаурма со свежими помидорами, огурцами и соусом",
    price: 239,
    weight: "250 г"
  },
  {
    id: "shaurma-s-kurinym-file",
    category: "Шаурма",
    name: "Шаурма с нежным куриным филе, овощами и соусом",
    price: 339,
    weight: "300 г"
  },
  {
    id: "shaurma-s-govyadinoy",
    category: "Шаурма",
    name: "Шаурма с сочной говядиной, овощами и соусом",
    price: 429,
    weight: "250 г"
  },
  {
    id: "shaurma-so-svininoy",
    category: "Шаурма",
    name: "Шаурма со вкусной маринованной свининой",
    price: 349,
    weight: "300 г"
  },
  {
    id: "dobryy-kola-500",
    category: "Напитки",
    name: "Добрый Кола",
    price: 190,
    weight: "500 мл"
  },
  {
    id: "dobryy-kola-330",
    category: "Напитки",
    name: "Добрый Кола",
    price: 170,
    weight: "330 мл"
  },
  {
    id: "chernogolovka-limonad",
    category: "Напитки",
    name: "Черноголовка лимонад",
    price: 150,
    weight: "500 мл"
  },
  {
    id: "chernogolovka-limonad-tarhun",
    category: "Напитки",
    name: "Черноголовка лимонад Тархун",
    price: 150,
    weight: "500 мл",
    image: `/images/${encodeURIComponent("Черноголовка лимонад тархун-dark.png")}`
  },
  {
    id: "chernogolovka-limonad-baykal",
    category: "Напитки",
    name: "Черноголовка лимонад Байкал",
    price: 150,
    weight: "500 мл",
    image: `/images/${encodeURIComponent("Черноголовка лимонад байкал-dark.png")}`
  }
];

function menuImage(fileName: string) {
  return `/menu/${encodeURIComponent(fileName)}`;
}

function versionedMenuImage(fileName: string, version: string) {
  return `${menuImage(fileName)}?v=${version}`;
}

const menuImageById: Partial<Record<MenuItem["id"], string>> = {
  armeniya: menuImage("Армения.jfif"),
  letniy: menuImage("Летний.jfif"),
  "salat-grecheskiy": menuImage("Салат Греческий.jfif"),
  "salat-cezar-s-krevetkami": menuImage("Салат Цезарь с креветками.jfif"),
  "salat-cezar-s-kuritsey": menuImage("Салат Цезарь с курицей.jfif"),
  "salat-firmennyy-zhan-klod-mangal": menuImage(
    "Салат фирменный Жан Клод Мангал.jfif"
  ),
  "kurinye-krylya-gril": menuImage(
    "Куриные крылья гриль в пикантном маринаде с хрустящей корочкой.jfif"
  ),
  "kurinyy-lyulya-kebab": menuImage(
    "Куриный люля-кебаб с восточными специями.jfif"
  ),
  "lyulya-kebab-iz-sochnoy-govyadiny": menuImage(
    "Люля-кебаб из сочной говядины.jfif"
  ),
  "shashlyk-iz-kurinogo-file": menuImage("Шашлык из куриного филе.jfif"),
  "shashlyk-iz-svinoy-koreyki": menuImage(
    "Шашлык из свиной корейки, томленный на углях.jfif"
  ),
  "shashlyk-iz-svinoy-sheyki": menuImage("Шашлык из свиной шейки.jfif"),
  "nezhnoe-pyure-s-aromatnym-lyulya": menuImage(
    "Нежное пюре с ароматным люля.jfif"
  ),
  "pasta-s-bekonom": menuImage("Паста с беконом.jfif"),
  "pasta-s-kuritsey-i-gribami": menuImage("Паста с курицей и грибами.jfif"),
  "sochnaya-svinaya-sheya-s-hrustyashchimi-dolkami": menuImage(
    "Сочная свиная шея с хрустящими дольками.jfif"
  ),
  "hachapuri-na-uglyah-v-lavashe": menuImage(
    "Хачапури на углях в лаваше.jfif"
  ),
  "sochnyy-bbq-bifburger": menuImage("Сочный BBQ Бифбургер.jfif"),
  "sochnyy-bbq-bifburger-s-bekonom": menuImage(
    "Сочный BBQ Бифбургер с беконом.jfif"
  ),
  "firmennyy-chikenburger-ot-shefa": menuImage(
    "Фирменный Чикенбургер от шефа.jfif"
  ),
  "hrustyashchiy-chikenburger-bbq-s-bekonom": menuImage(
    "Хрустящий Чикенбургер BBQ с беконом.jfif"
  ),
  "sous-ostryy": menuImage("Соус Острый.jfif"),
  "sous-syrnyy": menuImage("Соус Сырный.jfif"),
  "sous-cekhton": menuImage("Соус Цехтон.jfif"),
  "sous-shashlychnyy": menuImage("Соус Шашлычный.jfif"),
  borshch: menuImage("Борщ.jfif"),
  solyanka: menuImage("Солянка.jfif"),
  "sup-kurinyy": menuImage("Суп Куриный.jfif"),
  harcho: menuImage("Харчо.jfif"),
  "vegetarianskaya-shaurma": menuImage(
    "Вегетарианская шаурма со свежими помидорами, огурцами и соусом.jfif"
  ),
  "shaurma-s-kurinym-file": menuImage(
    "Шаурма с нежным куриным филе, овощами и соусом.jfif"
  ),
  "shaurma-s-govyadinoy": menuImage(
    "Шаурма с сочной говядиной, овощами и соусом.jfif"
  ),
  "shaurma-so-svininoy": menuImage(
    "Шаурма со вкусной маринованной свининой.jfif"
  ),
  "dobryy-kola-500": versionedMenuImage("Добрый Кола.png", "20260708-030526"),
  "dobryy-kola-330": menuImage("Добрый Кола в банке.webp"),
  "chernogolovka-limonad": versionedMenuImage(
    "Черноголовка лимонад.png",
    "20260708-030534"
  )
};

export const menuItems: MenuItem[] = rawMenuItems.map((item) => ({
  ...item,
  image: item.image ?? menuImageById[item.id]
}));
