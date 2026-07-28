import Image from "next/image";
import { DishCartControls } from "@/components/menu/DishCartControls";
import type { MenuGroup } from "@/data/menu-pages";
import type { MenuItemWithImage } from "@/data/menu";

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatItemCount(value: number) {
  const mod10 = value % 10;
  const mod100 = value % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${value} позиция`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${value} позиции`;
  }

  return `${value} позиций`;
}

function DishCard({
  item,
  eager,
  categoryLabel
}: {
  item: MenuItemWithImage;
  eager: boolean;
  categoryLabel: string;
}) {
  return (
    <article
      id={`dish-${item.id}`}
      className="h-full min-w-0"
      itemScope
      itemType="https://schema.org/MenuItem"
    >
      <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-gold/18 bg-charcoal/80 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-gold/38 hover:shadow-[0_22px_52px_rgb(0_0_0/0.3)]">
        <button
          type="button"
          data-dish-dialog-trigger
          data-dish-id={item.id}
          data-dish-category-label={categoryLabel}
          aria-haspopup="dialog"
          aria-label={`Открыть карточку блюда: ${item.name}`}
          className="focus-ring group relative aspect-[4/3] w-full overflow-hidden border-b border-gold/14 bg-coal text-left"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            unoptimized
            placeholder="blur"
            priority={eager}
            loading={eager ? "eager" : "lazy"}
            sizes="(max-width: 639px) calc((100vw - 46px) / 2), (max-width: 1023px) 30vw, 285px"
            className={
              item.category === "Напитки"
                ? "object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02] sm:p-3"
                : "object-cover transition-transform duration-500 group-hover:scale-[1.035]"
            }
            itemProp="image"
          />
          <span className="absolute bottom-2 right-2 rounded-md border border-white/15 bg-black/68 px-2 py-1 text-[11px] font-extrabold text-white backdrop-blur-sm sm:bottom-3 sm:right-3 sm:text-xs">
            Подробнее
          </span>
        </button>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
          <button
            type="button"
            data-dish-dialog-trigger
            data-dish-id={item.id}
            data-dish-category-label={categoryLabel}
            aria-haspopup="dialog"
            className="focus-ring min-h-[2.75rem] text-left text-[14px] font-extrabold leading-5 text-cream transition-colors hover:text-ember-soft sm:text-base sm:leading-[1.35]"
          >
            <span itemProp="name">{item.name}</span>
          </button>
          <p className="mt-2 text-xs font-semibold text-gold-soft sm:text-[13px]">
            {item.weight}
          </p>
          <div
            className="mt-auto pt-4"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <meta itemProp="priceCurrency" content="RUB" />
            <meta itemProp="price" content={String(item.price)} />
            <p className="mb-3 text-xl font-extrabold leading-none text-ember">
              {formatPrice(item.price)} ₽
            </p>
            <DishCartControls itemId={item.id} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function ServerMenuCatalog({
  groups,
  eagerFirstItems = true
}: {
  groups: MenuGroup[];
  eagerFirstItems?: boolean;
}) {
  return (
    <div className="grid gap-14 sm:gap-18">
      {groups.map((group, groupIndex) => (
        <section
          id={group.id}
          data-menu-group-index={groupIndex}
          className="scroll-mt-40"
          style={{ scrollMarginTop: "calc(var(--header-height) + 84px)" }}
          aria-labelledby={`menu-group-${group.id}`}
          key={group.id}
        >
          <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
            <div>
              <h2
                id={`menu-group-${group.id}`}
                className="text-2xl font-extrabold leading-tight text-cream sm:text-3xl lg:text-[38px]"
              >
                {group.title}
              </h2>
              <p className="mt-1.5 text-sm font-medium text-smoke">
                {formatItemCount(group.items.length)}
              </p>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {group.items.map((item, itemIndex) => (
              <DishCard
                item={item}
                eager={eagerFirstItems && groupIndex === 0 && itemIndex < 4}
                categoryLabel={group.title}
                key={item.id}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
