"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { MenuCategorySlug } from "@/data/menu-pages";

export function MenuCategoryScroller({
  activeCategory,
  children
}: {
  activeCategory: MenuCategorySlug | "all";
  children: ReactNode;
}) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const activeLink = nav?.querySelector<HTMLElement>('[aria-current="page"]');

    if (!nav || !activeLink) {
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const activeRect = activeLink.getBoundingClientRect();
    const centeredOffset =
      activeRect.left -
      navRect.left -
      (navRect.width - activeRect.width) / 2;

    nav.scrollTo({
      left: Math.max(0, nav.scrollLeft + centeredOffset),
      behavior: "auto"
    });
  }, [activeCategory]);

  return (
    <nav
      ref={navRef}
      className="container-tilda overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Разделы меню"
    >
      {children}
    </nav>
  );
}
