"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatDishCount(value: number) {
  const mod10 = value % 10;
  const mod100 = value % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${value} блюдо`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${value} блюда`;
  }

  return `${value} блюд`;
}

export function FloatingCartButton() {
  const { lastAddedAt, openCart, totalItems, totalPrice } = useCart();
  const prefersReducedMotion = useReducedMotion();
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (lastAddedAt > 0) {
      setPulseKey((value) => value + 1);
    }
  }, [lastAddedAt]);

  if (totalItems === 0) {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-[88px] right-8 z-40 sm:bottom-24 sm:right-12 lg:right-16"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        key={pulseKey}
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [1, 1.045, 1], y: [0, -2, 0] }
        }
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Button
          type="button"
          aria-label={`Открыть корзину: ${formatDishCount(totalItems)}, ${formatPrice(totalPrice)} ₽`}
          onClick={openCart}
          className="min-h-16 rounded-2xl border border-gold/35 bg-ember px-5 text-white shadow-[0_10px_24px_rgb(0_0_0/0.28)] hover:bg-flame sm:min-h-[72px] sm:px-6"
        >
          <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-charcoal/22 sm:h-12 sm:w-12">
            <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
            <span className="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-extrabold leading-none text-charcoal">
              {totalItems}
            </span>
          </span>
          <span className="grid text-left leading-tight">
            <span className="text-[13px] font-extrabold sm:text-sm">
              {formatDishCount(totalItems)}
            </span>
            <span className="text-sm font-extrabold text-cream sm:text-base">
              {formatPrice(totalPrice)} ₽
            </span>
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );
}
