"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Flame, Minus, Plus, ShoppingCart } from "lucide-react";
import {
  menuCategories,
  menuItems,
  type MenuItem
} from "@/data/menu";
import { useCart } from "@/components/cart/CartProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const categoryCounts = menuCategories.map((category) => ({
  category,
  count: menuItems.filter((item) => item.category === category).length
}));

const categoryAnchors = new Map([
  ["Гарниры", "garniry"],
  ["Салаты", "salaty"],
  ["Шашлык", "shashlyk"],
  ["Горячие блюда", "goryachie-blyuda"],
  ["Бургеры", "burgery"],
  ["Соусы", "sousy"],
  ["Супы", "supy"],
  ["Шаурма", "shaurma"],
  ["Напитки", "napitki"]
]);

function getCategoryAnchor(category: string) {
  return categoryAnchors.get(category) ?? category;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const { addItem, decrementItem, getQuantity, incrementItem } = useCart();
  const quantity = getQuantity(item.id);
  const cartLabel = `Добавить в корзину: ${item.name}`;

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0.92, y: 12 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.32,
        delay: Math.min(index, 5) * 0.035,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <Card className="rounded-2xl border border-gold/18 bg-charcoal/80 py-0 text-cream ring-0 transition-colors hover:border-gold/36">
        {item.image ? (
          <div className="relative mx-4 mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-gold/16 bg-coal/80">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 767px) 90vw, (max-width: 1279px) 45vw, 300px"
              className="object-contain p-2"
            />
          </div>
        ) : null}

        <CardHeader className={item.image ? "grid grid-cols-[1fr_auto] items-start gap-3 px-4 py-2.5" : "gap-3 px-5 pt-5"}>
          <CardTitle className={item.image ? "min-w-0 text-[15px] font-extrabold leading-tight tracking-[-0.01em] text-cream" : "text-[20px] font-extrabold leading-[1.16] tracking-[-0.01em] text-cream"}>
            {item.name}
          </CardTitle>

          <div className={item.image ? "flex items-center justify-end" : "flex min-h-7 items-start justify-between gap-3"}>
            {!item.image && item.popular ? (
              <Badge className="h-7 rounded-full border border-ember/35 bg-ember/16 px-3 text-[12px] font-bold text-ember-soft">
                <Flame className="h-3.5 w-3.5" aria-hidden />
                Хит
              </Badge>
            ) : (
              <span className={item.image ? "hidden" : "h-7"} aria-hidden />
            )}
            <span className={item.image ? "shrink-0 rounded-full border border-gold/20 px-3 py-1 text-sm font-bold text-gold-soft" : "rounded-full border border-gold/20 px-3 py-1 text-sm font-bold text-gold-soft"}>
              {item.weight}
            </span>
          </div>
        </CardHeader>

        {item.description ? (
          <CardContent className="flex flex-1 flex-col px-5">
            <p className="text-[15px] leading-[1.55] text-smoke">
              {item.description}
            </p>
          </CardContent>
        ) : item.image ? null : (
          <CardContent className="flex flex-1 flex-col px-5">
            <div className="min-h-6" aria-hidden />
          </CardContent>
        )}

        <CardFooter className={`${item.image && !item.description ? "mt-0" : "mt-5"} flex items-center justify-between gap-3 border-t border-gold/14 px-5 py-4`}>
          <div>
            <p className="text-xs font-bold text-gold-soft">Цена</p>
            <p className="mt-1 text-2xl font-extrabold leading-none text-ember">
              {formatPrice(item.price)} ₽
            </p>
          </div>
          {quantity > 0 ? (
            <div className="flex min-h-11 items-center rounded-xl border border-gold/20 bg-coal">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Уменьшить количество ${item.name}`}
                onClick={() => decrementItem(item.id)}
                className="min-h-11 min-w-11 rounded-xl text-gold-soft hover:bg-gold/10 hover:text-cream"
              >
                <Minus className="h-5 w-5" aria-hidden />
              </Button>
              <span className="min-w-9 text-center text-base font-extrabold text-cream">
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Увеличить количество ${item.name}`}
                onClick={() => incrementItem(item.id)}
                className="min-h-11 min-w-11 rounded-xl text-gold-soft hover:bg-gold/10 hover:text-cream"
              >
                <Plus className="h-5 w-5" aria-hidden />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              aria-label={cartLabel}
              onClick={() => addItem(item)}
              className="min-h-11 rounded-xl border border-ember/35 bg-ember px-4 text-sm font-bold text-white hover:bg-flame"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden />
              В корзину
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.article>
  );
}

export function MenuCatalog() {
  return (
    <div className="mt-12 text-left sm:mt-14">
      <div className="-mx-5 overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0">
        <nav
          className="flex min-w-max gap-2"
          aria-label="Категории меню"
        >
          {categoryCounts.map(({ category, count }) => (
            <a
              href={`#menu-${getCategoryAnchor(category)}`}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/20 bg-charcoal/72 px-4 text-sm font-bold text-cream transition-colors hover:border-ember/55 hover:text-ember-soft"
              key={category}
            >
              {category}
              <span className="rounded-full bg-gold/12 px-2 py-0.5 text-xs text-gold-soft">
                {count}
              </span>
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-10 grid gap-12">
        {menuCategories.map((category) => {
          const items = menuItems.filter((item) => item.category === category);

          return (
            <section
              id={`menu-${getCategoryAnchor(category)}`}
              className="scroll-mt-[calc(var(--header-height)+24px)]"
              aria-labelledby={`menu-heading-${category}`}
              key={category}
            >
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3
                    id={`menu-heading-${category}`}
                    className="text-[clamp(26px,3vw,38px)] font-extrabold leading-tight tracking-[-0.02em] text-cream"
                  >
                    {category}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-smoke">
                    {items.length} позиций
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item, index) => (
                  <MenuCard item={item} index={index} key={item.id} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
