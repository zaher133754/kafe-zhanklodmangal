"use client";

import dynamic from "next/dynamic";
import { useCart } from "@/components/cart/CartProvider";

const CartSheet = dynamic(
  () => import("@/components/cart/CartSheet").then((module) => module.CartSheet),
  { ssr: false }
);

export function CartOverlay() {
  const { isOpen, totalItems } = useCart();

  if (!isOpen && totalItems === 0) {
    return null;
  }

  return <CartSheet />;
}
