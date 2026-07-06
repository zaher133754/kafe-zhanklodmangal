"use client";

import Image from "next/image";
import { ExternalLink, Menu, Minus, Phone, X } from "lucide-react";
import {
  type KeyboardEvent,
  useEffect,
  useRef,
  useState
} from "react";
import { images, navItems, site } from "@/lib/site";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.body.classList.add("modal-open");
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }

    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };

    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  function closeMenu() {
    setIsOpen(false);
  }

  function keepFocusInside(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"])'
      )
    ).filter((element) => element.offsetParent !== null);

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !focusable.includes(active as HTMLElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !focusable.includes(active as HTMLElement))) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gold/15 bg-charcoal/[0.96] shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div
        className="container-tilda flex h-[var(--header-height)] items-center justify-between gap-3"
        data-reveal="down"
      >
        <a
          href="#top"
          className="focus-ring relative h-[54px] w-[124px] shrink-0 transition-[opacity,transform] duration-300 hover:scale-[1.02] hover:opacity-95 sm:w-[150px]"
          aria-label="ЖанКлод Мангал — на главную"
          onClick={closeMenu}
        >
          <Image
            src={images.logo}
            alt="ЖанКлод Мангал"
            fill
            priority
            sizes="(max-width: 639px) 124px, 150px"
            className="object-contain"
          />
        </a>

        <nav className="hidden min-w-0 flex-1 items-center justify-center xl:flex" aria-label="Основная навигация">
          <ul className="flex items-center gap-5 text-[12px] font-bold uppercase tracking-[0.04em] 2xl:gap-7 2xl:text-[13px]">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  className="nav-link focus-ring inline-flex min-h-11 items-center px-1"
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-4 xl:flex 2xl:gap-6">
          <a
            href={site.orderPhone.href}
            className="focus-ring inline-flex min-h-11 items-center text-[14px] font-bold text-gold-soft transition-colors hover:text-ember-soft 2xl:text-[15px]"
          >
            {site.orderPhone.label}
          </a>
          <a href={site.orderPhone.href} className="cta-square focus-ring min-h-11">
            Сделать заказ
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          <a
            href={site.orderPhone.href}
            className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-ember/45 bg-ember px-3 text-sm font-bold text-white transition-colors hover:bg-flame sm:px-5"
            aria-label="Позвонить и заказать"
          >
            <Phone className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline">Заказать</span>
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold/25 bg-coal/70 text-ember transition-colors hover:border-ember/55 hover:text-cream"
            aria-label="Открыть меню"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className="m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 text-cream backdrop:bg-black/80 xl:hidden"
        aria-labelledby="mobile-navigation-title"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={() => {
          document.body.classList.remove("modal-open");
          setIsOpen(false);
          menuButtonRef.current?.focus();
        }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        onKeyDown={keepFocusInside}
      >
        <div className="ml-auto flex h-full w-full max-w-[430px] flex-col border-l border-ember/25 bg-charcoal shadow-[-12px_0_40px_rgba(0,0,0,0.32)]">
          <div className="flex h-[var(--header-height)] shrink-0 items-center justify-between border-b border-gold/15 px-[18px] sm:px-7">
            <a
              href="#top"
              className="focus-ring relative h-[52px] w-[124px]"
              aria-label="ЖанКлод Мангал — на главную"
              onClick={closeMenu}
            >
              <Image
                src={images.logo}
                alt=""
                fill
                sizes="124px"
                className="object-contain"
              />
            </a>
            <button
              ref={closeButtonRef}
              type="button"
              className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ember/45 text-ember transition-colors hover:bg-ember hover:text-white"
              aria-label="Закрыть меню"
              onClick={closeMenu}
            >
              <X className="h-6 w-6" aria-hidden />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[18px] py-6 sm:px-7 sm:py-8">
            <h2 id="mobile-navigation-title" className="sr-only">
              Навигация по сайту
            </h2>
            <nav aria-label="Мобильная навигация">
              <ul className="divide-y divide-gold/15">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      className="focus-ring flex min-h-14 items-center justify-between py-2 text-xl font-bold text-cream transition-colors hover:text-ember"
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      onClick={closeMenu}
                    >
                      {item.label}
                      {item.external ? (
                        <ExternalLink className="h-5 w-5 text-ember" aria-hidden />
                      ) : (
                        <Minus className="h-5 w-5 text-ember/65" aria-hidden />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto grid gap-3 pt-8">
              <a
                href={site.orderPhone.href}
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gold/25 text-base font-bold text-gold-soft"
                onClick={closeMenu}
              >
                <Phone className="h-5 w-5" aria-hidden />
                {site.orderPhone.label}
              </a>
              <a
                href={site.orderPhone.href}
                className="cta-square focus-ring min-h-12 w-full text-base"
                onClick={closeMenu}
              >
                Позвонить и заказать
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </header>
  );
}
