"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { DishCartControls } from "@/components/menu/DishCartControls";
import { menuItems } from "@/data/menu";

const menuItemById = new Map(menuItems.map((item) => [item.id, item]));

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function DishDetailsDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedItem = selectedId ? menuItemById.get(selectedId) : undefined;

  useEffect(() => {
    function openDishDetails(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const trigger = target.closest<HTMLElement>("[data-dish-dialog-trigger]");
      const itemId = trigger?.dataset.dishId;

      if (!itemId || !menuItemById.has(itemId)) {
        return;
      }

      setSelectedId(itemId);
    }

    document.addEventListener("click", openDishDetails);
    return () => document.removeEventListener("click", openDishDetails);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!selectedItem || !dialog || dialog.open) {
      return;
    }

    dialog.showModal();
    document.body.classList.add("modal-open");
  }, [selectedItem]);

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="m-auto max-h-[calc(100dvh-24px)] w-[min(920px,calc(100%-24px))] overflow-y-auto rounded-2xl border border-gold/28 bg-espresso p-0 text-cream shadow-[0_32px_100px_rgb(0_0_0/0.65)] backdrop:bg-black/82 sm:max-h-[calc(100dvh-48px)] sm:w-[min(920px,calc(100%-48px))] sm:rounded-3xl"
      aria-labelledby="dish-dialog-title"
      aria-describedby={
        selectedItem?.composition ? "dish-dialog-composition" : undefined
      }
      onCancel={() => document.body.classList.remove("modal-open")}
      onClose={() => {
        document.body.classList.remove("modal-open");
        setSelectedId(null);
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeDialog();
        }
      }}
    >
      {selectedItem ? (
        <article className="relative grid md:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <button
            type="button"
            aria-label="Закрыть карточку блюда"
            onClick={closeDialog}
            className="focus-ring absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full border border-gold/25 bg-charcoal/92 text-cream shadow-lg transition-colors hover:border-ember/60 hover:bg-ember sm:right-4 sm:top-4"
          >
            <X className="size-5" aria-hidden />
          </button>

          <div className="relative aspect-[4/3] min-h-0 overflow-hidden bg-coal md:aspect-auto md:min-h-[520px]">
            <Image
              src={selectedItem.image}
              alt={selectedItem.name}
              fill
              unoptimized
              placeholder="blur"
              sizes="(max-width: 767px) calc(100vw - 24px), 500px"
              className={
                selectedItem.category === "Напитки"
                  ? "object-contain p-5 sm:p-8"
                  : "object-cover"
              }
            />
          </div>

          <div className="flex min-w-0 flex-col p-5 sm:p-7 md:p-9">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gold-soft">
              {selectedItem.category}
            </p>
            <h2
              id="dish-dialog-title"
              className="mt-3 text-[clamp(26px,4vw,40px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-cream"
            >
              {selectedItem.name}
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-gold/16 py-4">
              <strong className="text-2xl font-extrabold text-ember">
                {formatPrice(selectedItem.price)} ₽
              </strong>
              <span className="text-base font-bold text-gold-soft">
                {selectedItem.weight}
              </span>
            </div>

            {selectedItem.composition ? (
              <div
                id="dish-dialog-composition"
                className="mt-6 text-[15px] leading-relaxed text-smoke"
              >
                <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-cream">
                  Состав
                </h3>
                <p className="mt-2">{selectedItem.composition}</p>
              </div>
            ) : null}

            <div className="mt-7 md:mt-auto md:pt-8">
              <DishCartControls itemId={selectedItem.id} />
            </div>
          </div>
        </article>
      ) : null}
    </dialog>
  );
}
