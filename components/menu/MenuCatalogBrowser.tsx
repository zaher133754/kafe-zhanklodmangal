"use client";

import Link from "next/link";
import {
  useRef,
  useState,
  type MouseEvent,
  type ReactNode
} from "react";
import { MenuCategoryScroller } from "@/components/menu/MenuCategoryScroller";
import type { MenuCategorySlug } from "@/data/menu-pages";

type ActiveCategory = MenuCategorySlug | "all";

type MenuBrowserCategory = {
  slug: MenuCategorySlug;
  label: string;
  count: number;
};

type MenuBrowserGroup = {
  slug: MenuCategorySlug;
  content: ReactNode;
};

const activeLinkClassName =
  "focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-ember bg-ember px-4 text-sm font-extrabold text-white";
const inactiveLinkClassName =
  "focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-gold/20 bg-charcoal/72 px-4 text-sm font-bold text-cream transition-colors hover:border-ember/55 hover:text-ember-soft";

function shouldUseRegularNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export function MenuCatalogBrowser({
  categories,
  groups,
  totalItems
}: {
  categories: readonly MenuBrowserCategory[];
  groups: readonly MenuBrowserGroup[];
  totalItems: number;
}) {
  const [activeCategory, setActiveCategory] =
    useState<ActiveCategory>("all");
  const catalogRef = useRef<HTMLDivElement>(null);

  const activeLabel =
    activeCategory === "all"
      ? "Все блюда"
      : categories.find((category) => category.slug === activeCategory)?.label;

  function selectCategory(
    event: MouseEvent<HTMLAnchorElement>,
    category: ActiveCategory
  ) {
    if (shouldUseRegularNavigation(event)) {
      return;
    }

    event.preventDefault();

    const catalog = catalogRef.current;
    const catalogTop = catalog?.getBoundingClientRect().top;
    const shouldRestoreCatalogPosition =
      catalogTop !== undefined &&
      (catalogTop < 0 || catalogTop > window.innerHeight * 0.68);

    setActiveCategory(category);

    if (shouldRestoreCatalogPosition) {
      window.requestAnimationFrame(() => {
        catalogRef.current?.scrollIntoView({
          behavior: "auto",
          block: "start"
        });
      });
    }
  }

  return (
    <>
      <div className="sticky top-[var(--header-height)] z-30 border-b border-gold/14 bg-espresso/96 shadow-[0_12px_34px_rgb(0_0_0/0.22)] backdrop-blur-md">
        <MenuCategoryScroller activeCategory={activeCategory}>
          <div className="flex min-w-max gap-2 lg:min-w-0 lg:flex-wrap">
            <Link
              href="/menu"
              prefetch={false}
              aria-current={activeCategory === "all" ? "true" : undefined}
              className={
                activeCategory === "all"
                  ? activeLinkClassName
                  : inactiveLinkClassName
              }
              onClick={(event) => selectCategory(event, "all")}
            >
              Все
              <span className="rounded bg-white/12 px-1.5 py-0.5 text-xs">
                {totalItems}
              </span>
            </Link>

            {categories.map((category) => {
              const isActive = activeCategory === category.slug;

              return (
                <Link
                  href={`/menu/${category.slug}`}
                  prefetch={false}
                  aria-current={isActive ? "true" : undefined}
                  className={
                    isActive ? activeLinkClassName : inactiveLinkClassName
                  }
                  key={category.slug}
                  onClick={(event) => selectCategory(event, category.slug)}
                >
                  {category.label}
                  <span className="rounded bg-white/12 px-1.5 py-0.5 text-xs">
                    {category.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </MenuCategoryScroller>
      </div>

      <div
        ref={catalogRef}
        className="container-tilda scroll-mt-[calc(var(--header-height)+84px)] pt-10 sm:pt-14"
      >
        <p className="sr-only" aria-live="polite">
          Показан раздел: {activeLabel}
        </p>
        <div className="grid gap-14 sm:gap-18">
          {groups.map((group) => (
            <div
              hidden={
                activeCategory !== "all" && activeCategory !== group.slug
              }
              key={group.slug}
            >
              {group.content}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
