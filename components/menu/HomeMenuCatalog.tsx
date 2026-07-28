"use client";

import { useState, type ReactNode } from "react";
import type { MenuCategorySlug } from "@/data/menu-pages";

const CATALOG_CONTENT_ID = "home-menu-catalog-content";

type HomeMenuCategory = {
  slug: MenuCategorySlug;
  label: string;
  count: number;
};

type ActiveCategory = MenuCategorySlug | "all" | null;

function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export function HomeMenuCatalog({
  categories,
  totalItems,
  children
}: {
  categories: readonly HomeMenuCategory[];
  totalItems: number;
  children: ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<ActiveCategory>(null);

  function scrollTo(targetId: string) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: getScrollBehavior(),
          block: "start"
        });
      });
    });
  }

  function selectCategory(category: MenuCategorySlug | "all") {
    setIsExpanded(true);
    setActiveCategory(category);
    scrollTo(category === "all" ? CATALOG_CONTENT_ID : category);
  }

  function toggleMenu() {
    if (isExpanded) {
      setIsExpanded(false);
      setActiveCategory(null);
      scrollTo("menu");
      return;
    }

    setIsExpanded(true);
    setActiveCategory("all");
  }

  return (
    <div
      className={`home-menu-catalog ${isExpanded ? "menu-catalog-expanded" : ""}`}
      data-expanded={isExpanded}
    >
      <div className="sticky top-[var(--header-height)] z-20 -mx-4 overflow-x-auto border-y border-gold/12 bg-espresso/96 px-4 py-2.5 backdrop-blur-md [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <nav
          className="flex min-w-max snap-x snap-mandatory gap-2"
          aria-label="Категории меню"
        >
          <button
            type="button"
            aria-pressed={activeCategory === "all"}
            aria-controls={CATALOG_CONTENT_ID}
            onClick={() => selectCategory("all")}
            className={
              activeCategory === "all"
                ? "focus-ring inline-flex min-h-11 snap-start items-center gap-2 whitespace-nowrap rounded-lg border border-ember bg-ember px-4 text-sm font-extrabold text-white transition-colors"
                : "focus-ring inline-flex min-h-11 snap-start items-center gap-2 whitespace-nowrap rounded-lg border border-gold/20 bg-charcoal/72 px-4 text-sm font-bold text-cream transition-colors hover:border-ember/55 hover:text-ember-soft"
            }
          >
            Все
            <span className="rounded bg-white/12 px-1.5 py-0.5 text-xs">
              {totalItems}
            </span>
          </button>

          {categories.map((category) => {
            const isActive = activeCategory === category.slug;

            return (
              <button
                type="button"
                aria-pressed={isActive}
                aria-controls={CATALOG_CONTENT_ID}
                onClick={() => selectCategory(category.slug)}
                className={
                  isActive
                    ? "focus-ring inline-flex min-h-11 snap-start items-center gap-2 whitespace-nowrap rounded-lg border border-ember bg-ember px-4 text-sm font-extrabold text-white transition-colors"
                    : "focus-ring inline-flex min-h-11 snap-start items-center gap-2 whitespace-nowrap rounded-lg border border-gold/20 bg-charcoal/72 px-4 text-sm font-bold text-cream transition-colors hover:border-ember/55 hover:text-ember-soft"
                }
                key={category.slug}
              >
                {category.label}
                <span className="rounded bg-white/12 px-1.5 py-0.5 text-xs">
                  {category.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div id={CATALOG_CONTENT_ID} className="pt-8 sm:pt-10">
        {children}
      </div>

      <div className="flex justify-center pb-24 pt-10 sm:pb-0 sm:pt-14">
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={CATALOG_CONTENT_ID}
          onClick={toggleMenu}
          className="focus-ring inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-ember/45 bg-ember px-6 text-base font-extrabold text-white transition-colors hover:bg-flame sm:w-auto sm:min-w-60"
        >
          {isExpanded ? "Свернуть меню" : "Показать всё меню"}
        </button>
      </div>
    </div>
  );
}
