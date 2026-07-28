"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/data/menu";

const menuItemById = new Map(menuItems.map((item) => [item.id, item]));

export function DishCartControls({ itemId }: { itemId: string }) {
  const item = menuItemById.get(itemId);
  const { addItem, decrementItem, getQuantity, incrementItem } = useCart();

  if (!item) {
    return null;
  }

  const quantity = getQuantity(item.id);

  if (quantity === 0) {
    return (
      <Button
        type="button"
        aria-label={`Добавить в корзину: ${item.name}`}
        onClick={() => addItem(item)}
        className="focus-ring min-h-11 w-full rounded-lg border border-ember/35 bg-ember px-3 text-sm font-extrabold text-white hover:bg-flame"
      >
        <ShoppingCart className="size-4" aria-hidden />
        В корзину
      </Button>
    );
  }

  return (
    <div className="grid h-11 w-full grid-cols-[44px_minmax(0,1fr)_44px] items-center overflow-hidden rounded-lg border border-gold/24 bg-coal">
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
        className="text-center text-base font-extrabold text-cream"
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
  );
}
