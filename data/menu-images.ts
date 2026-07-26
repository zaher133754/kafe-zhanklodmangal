import type { StaticImageData } from "next/image";
import image01 from "@/public/menu-optimized/chicken-wings-grill.avif";
import image02 from "@/public/menu-optimized/veg-shaurma.avif";
import image03 from "@/public/menu-optimized/Армения.avif";
import image04 from "@/public/menu-optimized/Борщ.avif";
import image05 from "@/public/menu-optimized/Грибы на углях.avif";
import image06 from "@/public/menu-optimized/Добрый Кола в банке.avif";
import image07 from "@/public/menu-optimized/Добрый Кола.avif";
import image08 from "@/public/menu-optimized/Картофель на углях.avif";
import image09 from "@/public/menu-optimized/Картофель фри.avif";
import image10 from "@/public/menu-optimized/Картошка по-деревенски.avif";
import image11 from "@/public/menu-optimized/Куриный люля-кебаб с восточными специями.avif";
import image12 from "@/public/menu-optimized/Лаваш тонкий.avif";
import image13 from "@/public/menu-optimized/Летний.avif";
import image14 from "@/public/menu-optimized/Люля-кебаб из сочной говядины.avif";
import image15 from "@/public/menu-optimized/Нежное пюре с ароматным люля.avif";
import image16 from "@/public/menu-optimized/Овощи на углях.avif";
import image17 from "@/public/menu-optimized/Паста с беконом.avif";
import image18 from "@/public/menu-optimized/Паста с курицей и грибами.avif";
import image19 from "@/public/menu-optimized/Половинка лепешки.avif";
import image20 from "@/public/menu-optimized/Салат Греческий.avif";
import image21 from "@/public/menu-optimized/Салат фирменный Жан Клод Мангал.avif";
import image22 from "@/public/menu-optimized/Салат Цезарь с креветками.avif";
import image23 from "@/public/menu-optimized/Салат Цезарь с курицей.avif";
import image24 from "@/public/menu-optimized/Солянка.avif";
import image25 from "@/public/menu-optimized/Соус Острый.avif";
import image26 from "@/public/menu-optimized/Соус Сырный.avif";
import image27 from "@/public/menu-optimized/Соус Цехтон.avif";
import image28 from "@/public/menu-optimized/Соус Шашлычный.avif";
import image29 from "@/public/menu-optimized/Сочная свиная шея с хрустящими дольками.avif";
import image30 from "@/public/menu-optimized/Сочный BBQ Бифбургер с беконом.avif";
import image31 from "@/public/menu-optimized/Сочный BBQ Бифбургер.avif";
import image32 from "@/public/menu-optimized/Суп Куриный.avif";
import image33 from "@/public/menu-optimized/Фирменный Чикенбургер от шефа.avif";
import image34 from "@/public/menu-optimized/Харчо.avif";
import image35 from "@/public/menu-optimized/Хачапури на углях в лаваше.avif";
import image36 from "@/public/menu-optimized/Хрустящий Чикенбургер BBQ с беконом.avif";
import image37 from "@/public/menu-optimized/Черноголовка лимонад.avif";
import image38 from "@/public/menu-optimized/chicken-shawarma.avif";
import image39 from "@/public/menu-optimized/beef-shawarma.avif";
import image40 from "@/public/menu-optimized/Шаурма со вкусной маринованной свининой.avif";
import image41 from "@/public/menu-optimized/Шашлык из куриного филе.avif";
import image42 from "@/public/menu-optimized/pork-loin-kebab.avif";
import image43 from "@/public/menu-optimized/Шашлык из свиной шейки.avif";
import image44 from "@/public/menu-optimized/Черноголовка лимонад тархун-dark.avif";
import image45 from "@/public/menu-optimized/Черноголовка лимонад байкал-dark.avif";

const optimizedMenuImages = {
  "chicken-wings-grill.jfif": image01,
  "veg-shaurma.jfif": image02,
  "Армения.jfif": image03,
  "Борщ.jfif": image04,
  "Грибы на углях.jfif": image05,
  "Добрый Кола в банке.webp": image06,
  "Добрый Кола.png": image07,
  "Картофель на углях.jfif": image08,
  "Картофель фри.jfif": image09,
  "Картошка по-деревенски.jfif": image10,
  "Куриный люля-кебаб с восточными специями.jfif": image11,
  "Лаваш тонкий.jfif": image12,
  "Летний.jfif": image13,
  "Люля-кебаб из сочной говядины.jfif": image14,
  "Нежное пюре с ароматным люля.jfif": image15,
  "Овощи на углях.jfif": image16,
  "Паста с беконом.jfif": image17,
  "Паста с курицей и грибами.jfif": image18,
  "Половинка лепешки.jfif": image19,
  "Салат Греческий.jfif": image20,
  "Салат фирменный Жан Клод Мангал.jfif": image21,
  "Салат Цезарь с креветками.jfif": image22,
  "Салат Цезарь с курицей.jfif": image23,
  "Солянка.jfif": image24,
  "Соус Острый.jfif": image25,
  "Соус Сырный.jfif": image26,
  "Соус Цехтон.jfif": image27,
  "Соус Шашлычный.jfif": image28,
  "Сочная свиная шея с хрустящими дольками.jfif": image29,
  "Сочный BBQ Бифбургер с беконом.jfif": image30,
  "Сочный BBQ Бифбургер.jfif": image31,
  "Суп Куриный.jfif": image32,
  "Фирменный Чикенбургер от шефа.jfif": image33,
  "Харчо.jfif": image34,
  "Хачапури на углях в лаваше.jfif": image35,
  "Хрустящий Чикенбургер BBQ с беконом.jfif": image36,
  "Черноголовка лимонад.png": image37,
  "Шаурма с нежным куриным филе, овощами и соусом.jfif": image38,
  "Шаурма с сочной говядиной, овощами и соусом.jfif": image39,
  "Шаурма со вкусной маринованной свининой.jfif": image40,
  "Шашлык из куриного филе.jfif": image41,
  "Шашлык из свиной корейки, томленный на углях.jfif": image42,
  "Шашлык из свиной шейки.jfif": image43,
  "Черноголовка лимонад тархун-dark.png": image44,
  "Черноголовка лимонад байкал-dark.png": image45
} satisfies Record<string, StaticImageData>;

export function getOptimizedMenuImage(fileName: string): StaticImageData {
  const image = optimizedMenuImages[fileName as keyof typeof optimizedMenuImages];

  if (!image) {
    throw new Error(`Optimized menu image is missing: ${fileName}`);
  }

  return image;
}
