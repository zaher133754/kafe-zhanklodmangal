import Link from "next/link";
import { CartOverlay } from "@/components/cart/CartOverlay";
import { CartProvider } from "@/components/cart/CartProvider";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton";
import { Header } from "@/components/Header";
import { MenuCatalogBrowser } from "@/components/menu/MenuCatalogBrowser";
import { DishDetailsDialog } from "@/components/menu/DishDetailsDialog";
import { MenuCategoryScroller } from "@/components/menu/MenuCategoryScroller";
import {
  ServerMenuCatalog,
  ServerMenuGroup
} from "@/components/menu/ServerMenuCatalog";
import {
  getMenuCategoryItems,
  menuCategoryPages,
  type MenuCategorySlug,
  type MenuGroup
} from "@/data/menu-pages";
import { menuItems } from "@/data/menu";
import { site } from "@/lib/site";

type MenuPageShellProps = {
  title: string;
  description?: string;
  groups: MenuGroup[];
  activeCategory: MenuCategorySlug | "all";
  structuredData: object[];
};

export function MenuPageShell({
  title,
  description,
  groups,
  activeCategory,
  structuredData
}: MenuPageShellProps) {
  return (
    <CartProvider>
      <Header />
      <main id="top" className="min-h-screen bg-espresso pt-[var(--header-height)]">
        <section className="section-surface border-b border-gold/12 bg-charcoal py-10 sm:py-14 lg:py-18">
          <div className="container-tilda">
            <nav aria-label="Хлебные крошки">
              <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold text-smoke">
                <li>
                  <Link
                    className="focus-ring orange-link"
                    href="/"
                    prefetch={false}
                  >
                    Главная
                  </Link>
                </li>
                <li aria-hidden className="text-gold/55">
                  /
                </li>
                <li aria-current="page" className="text-cream">
                  {activeCategory === "all"
                    ? "Меню"
                    : menuCategoryPages.find(
                        (category) => category.slug === activeCategory
                      )?.label}
                </li>
              </ol>
            </nav>

            <div className="mt-8 max-w-[900px] sm:mt-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-gold-soft sm:text-sm">
                Кафе «Жан Клод Мангал» · Самара
              </p>
              <h1
                className={
                  activeCategory === "all"
                    ? "mt-3 max-w-[840px] text-balance text-[clamp(32px,4.6vw,56px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-flame"
                    : "mt-3 text-balance text-[clamp(36px,6vw,72px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-flame"
                }
              >
                {title}
              </h1>
              {description ? (
                <p className="mt-4 max-w-[60ch] text-pretty text-lg font-bold leading-snug tracking-[-0.01em] text-cream/86 sm:text-2xl">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section id="menu" className="section-surface pb-24 sm:pb-28">
          {activeCategory === "all" ? (
            <MenuCatalogBrowser
              totalItems={menuItems.length}
              categories={menuCategoryPages.map((category) => ({
                slug: category.slug,
                label: category.label,
                count: getMenuCategoryItems(category.slug).length
              }))}
              groups={groups.map((group, groupIndex) => ({
                slug: group.id,
                content: (
                  <ServerMenuGroup
                    group={group}
                    groupIndex={groupIndex}
                    eagerFirstItems
                  />
                )
              }))}
            />
          ) : (
            <>
              <div className="sticky top-[var(--header-height)] z-30 border-b border-gold/14 bg-espresso/96 shadow-[0_12px_34px_rgb(0_0_0/0.22)] backdrop-blur-md">
                <MenuCategoryScroller activeCategory={activeCategory}>
                  <div className="flex min-w-max gap-2 lg:min-w-0 lg:flex-wrap">
                    <Link
                      href="/menu"
                      prefetch
                      scroll={false}
                      className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-gold/20 bg-charcoal/72 px-4 text-sm font-bold text-cream transition-colors hover:border-ember/55 hover:text-ember-soft"
                    >
                      Все
                      <span className="rounded bg-white/12 px-1.5 py-0.5 text-xs">
                        {menuItems.length}
                      </span>
                    </Link>
                    {menuCategoryPages.map((category) => {
                      const isActive = activeCategory === category.slug;

                      return (
                        <Link
                          href={`/menu/${category.slug}`}
                          prefetch
                          scroll={false}
                          aria-current={isActive ? "page" : undefined}
                          className={
                            isActive
                              ? "focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-ember bg-ember px-4 text-sm font-extrabold text-white"
                              : "focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-gold/20 bg-charcoal/72 px-4 text-sm font-bold text-cream transition-colors hover:border-ember/55 hover:text-ember-soft"
                          }
                          key={category.slug}
                        >
                          {category.label}
                          <span className="rounded bg-white/12 px-1.5 py-0.5 text-xs">
                            {getMenuCategoryItems(category.slug).length}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </MenuCategoryScroller>
              </div>

              <div className="container-tilda pt-10 sm:pt-14">
                <ServerMenuCatalog groups={groups} />
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="border-t border-gold/15 bg-charcoal py-10">
        <div className="container-tilda flex flex-col gap-5 text-sm text-smoke sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-extrabold text-cream">Жан Клод Мангал</p>
            <p className="mt-1">{site.address}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              className="focus-ring orange-link font-bold"
              href="/"
              prefetch={false}
            >
              На главную
            </Link>
            <a
              className="focus-ring font-bold text-gold-soft transition-colors hover:text-ember-soft"
              href={site.orderPhone.href}
            >
              {site.orderPhone.label}
            </a>
          </div>
        </div>
      </footer>

      <DishDetailsDialog />
      <FloatingCartButton />
      <CartOverlay />
      {structuredData.map((data, index) => (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data).replace(/</g, "\\u003c")
          }}
          key={index}
        />
      ))}
    </CartProvider>
  );
}
