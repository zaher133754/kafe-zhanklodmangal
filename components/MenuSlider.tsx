"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { images } from "@/lib/site";

export function MenuSlider() {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const lightboxTriggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const active = images.menu[current];

  const move = useCallback((direction: -1 | 1) => {
    setCurrent((value) => (value + direction + images.menu.length) % images.menu.length);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const trigger = lightboxTriggerRef.current;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
      trigger?.focus();
    };
  }, [lightbox, move]);

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 48) return;
    move(distance > 0 ? -1 : 1);
  }

  return (
    <div className="mx-auto mt-[95px] max-w-[640px]" data-reveal>
      <div className="grid grid-cols-[44px_minmax(0,360px)_44px] items-center justify-center gap-4 sm:gap-8">
        <button
          type="button"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#555] transition hover:bg-ember hover:text-white"
          aria-label="Предыдущий слайд"
          onClick={() => move(-1)}
        >
          <ChevronLeft size={24} aria-hidden />
        </button>

        <button
          ref={lightboxTriggerRef}
          type="button"
          className="focus-ring relative aspect-[360/550] w-full overflow-hidden rounded-sm bg-[#6b4a3d]"
          onClick={() => setLightbox(true)}
          aria-label={`Открыть ${active.alt}`}
        >
          <Image
            src={active.src}
            alt={active.alt}
            fill
            sizes="(max-width: 640px) 62vw, 360px"
            className="object-cover"
          />
        </button>

        <button
          type="button"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#555] transition hover:bg-ember hover:text-white"
          aria-label="Следующий слайд"
          onClick={() => move(1)}
        >
          <ChevronRight size={24} aria-hidden />
        </button>
      </div>

      <div className="mt-7 flex justify-center" role="group" aria-label="Страницы меню">
        {images.menu.map((image, index) => (
          <button
            type="button"
            className="focus-ring inline-flex h-6 w-6 items-center justify-center rounded-full"
            aria-label={`Перейти к слайду ${index + 1}`}
            aria-current={current === index ? "true" : undefined}
            onClick={() => setCurrent(index)}
            key={image.src}
          >
            <span
              className={`h-[5px] w-[5px] rounded-full transition ${
                current === index ? "bg-white" : "bg-[#c7c7c7]/70"
              }`}
              aria-hidden
            />
          </button>
        ))}
      </div>

      {lightbox
        ? createPortal(
            <div
          className="fixed inset-0 z-[100] h-[100dvh] w-screen touch-pan-y overflow-hidden bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Меню ЖанКлод Мангал"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="absolute inset-3 sm:inset-8 md:inset-12">
            <Image
              key={active.src}
              src={active.src}
              alt={active.alt}
              fill
              priority
              draggable={false}
              sizes="100vw"
              className="select-none object-contain"
            />
          </div>

          <p
            className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-sm font-bold text-white sm:top-5"
            aria-live="polite"
          >
            {current + 1} / {images.menu.length}
          </p>

          <button
            ref={closeButtonRef}
            type="button"
            className="focus-ring absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition hover:bg-ember hover:text-white sm:right-5 sm:top-5"
            aria-label="Закрыть"
            onClick={() => setLightbox(false)}
          >
            <X size={24} aria-hidden />
          </button>
          <button
            type="button"
            className="focus-ring absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black transition hover:bg-ember hover:text-white sm:left-5"
            aria-label="Предыдущий слайд"
            onClick={() => move(-1)}
          >
            <ChevronLeft size={26} aria-hidden />
          </button>
          <button
            type="button"
            className="focus-ring absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black transition hover:bg-ember hover:text-white sm:right-5"
            aria-label="Следующий слайд"
            onClick={() => move(1)}
          >
            <ChevronRight size={26} aria-hidden />
          </button>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
