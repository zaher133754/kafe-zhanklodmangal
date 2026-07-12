"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import {
  menuCategories,
  menuItems,
  type MenuItem
} from "@/data/menu";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const FEATURED_CATEGORY = "Шашлык" as const;
const ALL_CATEGORIES = "Все" as const;
const CATALOG_CONTENT_ID = "menu-catalog-content";

type Category = (typeof menuCategories)[number];
type CategoryFilter = Category | typeof ALL_CATEGORIES;

const categoryCounts = new Map(
  menuCategories.map((category) => [
    category,
    menuItems.filter((item) => item.category === category).length
  ])
);

const categoryAnchors = new Map<Category, string>([
  ["Шашлык", "shashlyk"],
  ["Горячие блюда", "goryachie-blyuda"],
  ["Шаурма", "shaurma"],
  ["Бургеры", "burgery"],
  ["Гарниры", "garniry"],
  ["Салаты", "salaty"],
  ["Супы", "supy"],
  ["Соусы", "sousy"],
  ["Напитки", "napitki"]
]);

function getCategoryAnchor(category: Category) {
  return categoryAnchors.get(category) ?? category;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

function MenuCard({ item }: { item: MenuItem }) {
  const { addItem, decrementItem, getQuantity, incrementItem } = useCart();
  const quantity = getQuantity(item.id);

  return (
    <article className="h-full min-w-0">
      <Card className="h-full min-w-0 gap-0 overflow-hidden rounded-lg border border-gold/18 bg-charcoal/80 py-0 text-cream ring-0 transition-colors hover:border-gold/36">
        {item.image ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-gold/14 bg-coal/80">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 767px) calc((100vw - 46px) / 2), (max-width: 1023px) 31vw, (max-width: 1279px) 30vw, 290px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] w-full border-b border-gold/14 bg-coal/80" aria-hidden />
        )}

        <CardHeader className="gap-1.5 px-2.5 pt-2.5 pb-0 sm:gap-2 sm:px-4 sm:pt-4">
          <CardTitle className="line-clamp-2 min-h-[2.5rem] min-w-0 text-[14px] font-extrabold leading-5 text-cream sm:min-h-[2.75rem] sm:text-base sm:leading-[1.35]">
            {item.name}
          </CardTitle>
          <p className="text-[12px] font-semibold leading-4 text-gold-soft sm:text-[13px]">
            {item.weight}
          </p>
        </CardHeader>

        {item.description ? (
          <CardContent className="hidden px-4 pt-2 sm:block">
            <p className="line-clamp-2 text-sm leading-5 text-smoke">
              {item.description}
            </p>
          </CardContent>
        ) : null}

        <CardFooter className="mt-auto grid min-w-0 gap-2 border-t border-gold/14 bg-transparent px-2.5 py-2.5 sm:gap-3 sm:px-4 sm:py-4">
          <p className="text-[18px] font-extrabold leading-none text-ember sm:text-xl">
            {formatPrice(item.price)} ₽
          </p>

          {quantity > 0 ? (
            <div className="grid h-11 min-w-0 grid-cols-[44px_minmax(0,1fr)_44px] items-center overflow-hidden rounded-lg border border-gold/24 bg-coal">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Уменьшить количество ${item.name}`}
                onClick={() => decrementItem(item.id)}
                className="focus-ring size-11 rounded-none text-gold-soft hover:bg-gold/10 hover:text-cream"
              >
                <Minus className="size-4" aria-hidden />
              </Button>
              <span
                className="min-w-0 text-center text-base font-extrabold text-cream"
                aria-live="polite"
                aria-label={`Количество: ${quantity}`}
              >
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Увеличить количество ${item.name}`}
                onClick={() => incrementItem(item.id)}
                className="focus-ring size-11 rounded-none text-gold-soft hover:bg-gold/10 hover:text-cream"
              >
                <Plus className="size-4" aria-hidden />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              aria-label={`Добавить в корзину: ${item.name}`}
              onClick={() => addItem(item)}
              className="focus-ring min-h-11 w-full min-w-0 rounded-lg border border-ember/35 bg-ember px-2 text-[13px] font-bold text-white hover:bg-flame sm:px-4 sm:text-sm"
            >
              <ShoppingCart className="size-4" aria-hidden />
              В корзину
            </Button>
          )}
        </CardFooter>
      </Card>
    </article>
  );
}

function CategorySection({ category }: { category: Category }) {
  const items = menuItems.filter((item) => item.category === category);
  const headingId = `menu-heading-${getCategoryAnchor(category)}`;

  return (
    <section
      id={`menu-${getCategoryAnchor(category)}`}
      className="min-w-0 scroll-mt-[calc(var(--header-height)+80px)]"
      aria-labelledby={headingId}
    >
      <div className="mb-3 sm:mb-5">
        <h3
          id={headingId}
          className="text-2xl font-extrabold leading-tight text-cream sm:text-3xl lg:text-[38px]"
        >
          {category}
        </h3>
        <p className="mt-1.5 text-xs font-medium text-smoke sm:mt-2 sm:text-sm">
          {items.length} позиций
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <MenuCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}

export function MenuCatalog() {
  const prefersReducedMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<CategoryFilter>(FEATURED_CATEGORY);
  const [lastSelectedCategory, setLastSelectedCategory] =
    useState<Category>(FEATURED_CATEGORY);

  const visibleCategories = isExpanded
    ? menuCategories
    : [lastSelectedCategory];

  function scrollToCategory(category: Category) {
    requestAnimationFrame(() => {
      document
        .getElementById(`menu-${getCategoryAnchor(category)}`)
        ?.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
    });
  }

  function selectCategory(category: CategoryFilter) {
    if (category === ALL_CATEGORIES) {
      setActiveCategory(ALL_CATEGORIES);
      setIsExpanded(true);
      scrollToCategory(FEATURED_CATEGORY);
      return;
    }

    setLastSelectedCategory(category);
    setActiveCategory(category);

    if (isExpanded) {
      scrollToCategory(category);
      return;
    }

    setIsExpanded(false);
  }

  function toggleMenu() {
    if (isExpanded) {
      setIsExpanded(false);
      setActiveCategory(lastSelectedCategory);

      const menuSection = document.getElementById("menu");
      if (
        menuSection &&
        Math.abs(menuSection.getBoundingClientRect().top) > window.innerHeight * 0.75
      ) {
        menuSection.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }
      return;
    }

    setIsExpanded(true);
    setActiveCategory(ALL_CATEGORIES);
  }

  return (
    <div className="mt-9 min-w-0 text-left sm:mt-14">
      <div className="sticky top-[var(--header-height)] z-20 -mx-4 overflow-x-auto border-y border-gold/12 bg-espresso/96 px-4 py-2.5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <nav
          className="flex min-w-max snap-x snap-mandatory gap-2"
          aria-label="Категории меню"
        >
          {[ALL_CATEGORIES, ...menuCategories].map((category) => {
            const isActive = activeCategory === category;
            const count =
              category === ALL_CATEGORIES
                ? menuItems.length
                : categoryCounts.get(category);

            return (
              <button
                type="button"
                aria-pressed={isActive}
                aria-controls={CATALOG_CONTENT_ID}
                onClick={() => selectCategory(category)}
                className={
                  isActive
                    ? "focus-ring inline-flex min-h-11 snap-start items-center gap-2 whitespace-nowrap rounded-lg border border-ember bg-ember px-4 text-sm font-extrabold text-white transition-colors"
                    : "focus-ring inline-flex min-h-11 snap-start items-center gap-2 whitespace-nowrap rounded-lg border border-gold/20 bg-charcoal/72 px-4 text-sm font-bold text-cream transition-colors hover:border-ember/55 hover:text-ember-soft"
                }
                key={category}
              >
                {category}
                <span
                  className={
                    isActive
                      ? "rounded bg-white/16 px-1.5 py-0.5 text-xs text-white"
                      : "rounded bg-gold/12 px-1.5 py-0.5 text-xs text-gold-soft"
                  }
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <motion.div
        key={isExpanded ? "expanded" : "collapsed"}
        id={CATALOG_CONTENT_ID}
        initial={
          isExpanded && !prefersReducedMotion ? { opacity: 0, y: 8 } : false
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.22,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="mt-5 grid min-w-0 gap-9 pb-6 sm:mt-7 sm:gap-12 sm:pb-8"
      >
        {visibleCategories.map((category) => (
          <CategorySection category={category} key={category} />
        ))}
      </motion.div>

      <div className="flex justify-center pb-24 pt-2 sm:pb-0 sm:pt-4">
        <Button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={CATALOG_CONTENT_ID}
          onClick={toggleMenu}
          className="focus-ring min-h-12 w-full rounded-lg border border-ember/45 bg-ember px-5 text-base font-extrabold text-white hover:bg-flame sm:w-auto sm:min-w-56"
        >
          {isExpanded ? "Свернуть меню" : "Показать всё меню"}
        </Button>
      </div>
    </div>
  );
}
