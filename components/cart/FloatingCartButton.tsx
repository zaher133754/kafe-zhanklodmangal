"use client";

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

  if (totalItems === 0) {
    return null;
  }

  return (
    <div
      className="cart-float-enter fixed bottom-4 right-4 z-40 max-w-[calc(100vw-32px)] pb-[env(safe-area-inset-bottom)] sm:bottom-8 sm:right-8 sm:pb-0 lg:right-16"
    >
      <div className="cart-float-pulse" key={lastAddedAt}>
        <Button
          type="button"
          aria-label={`Открыть корзину: ${formatDishCount(totalItems)}, ${formatPrice(totalPrice)} ₽`}
          onClick={openCart}
          className="min-h-14 rounded-2xl border border-gold/35 bg-ember px-3 text-white shadow-[0_10px_24px_rgb(0_0_0/0.28)] hover:bg-flame sm:min-h-[72px] sm:px-6"
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal/22 sm:h-12 sm:w-12">
            <ShoppingCart className="h-5 w-5 sm:h-7 sm:w-7" aria-hidden />
            <span className="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-extrabold leading-none text-charcoal">
              {totalItems}
            </span>
          </span>
          <span className="grid text-left leading-tight">
            <span className="text-[12px] font-extrabold sm:text-sm">
              {formatDishCount(totalItems)}
            </span>
            <span className="text-[13px] font-extrabold text-cream sm:text-base">
              {formatPrice(totalPrice)} ₽
            </span>
          </span>
        </Button>
      </div>
    </div>
  );
}
