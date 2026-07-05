"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { images, navItems, site } from "@/lib/site";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("modal-open", isOpen);
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gold/15 bg-charcoal/[0.92] shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div
        className="container-tilda flex h-[var(--header-height)] items-center justify-between gap-5"
        data-reveal="down"
      >
        <a
          href="#top"
          className="focus-ring relative h-[54px] w-[124px] shrink-0 transition-[opacity,transform] duration-300 hover:scale-[1.02] hover:opacity-95 sm:w-[150px]"
          aria-label="ЖанКлод Мангал"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src={images.logo}
            alt="ЖанКлод Мангал"
            fill
            priority
            sizes="(max-width: 640px) 124px, 150px"
            className="object-contain"
          />
        </a>

        <nav className="hidden flex-1 items-center justify-start md:flex">
          <ul className="flex items-center gap-9 text-[13px] font-bold uppercase tracking-[0.04em]">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  className="nav-link focus-ring"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <a
            href={site.orderPhone.href}
            className="focus-ring text-[15px] font-bold text-gold-soft transition-colors hover:text-ember-soft"
          >
            {site.orderPhone.label}
          </a>
          <a
            href={site.orderPhone.href}
            className="cta-square focus-ring"
          >
            Сделать Заказ
          </a>
        </div>

        <button
          type="button"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-coal/60 text-ember shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-colors hover:border-gold/40 hover:text-gold-soft md:hidden"
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={25} strokeWidth={2.5} /> : <Menu size={25} />}
        </button>
      </div>

      <div
        className={`md:hidden ${
          isOpen
            ? "visible max-h-[calc(100svh-var(--header-height))] opacity-100"
            : "invisible max-h-0 pointer-events-none opacity-0"
        } overflow-hidden border-t border-gold/10 bg-charcoal/[0.98] shadow-[0_24px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-[max-height,opacity,visibility] duration-300`}
      >
        <nav className="container-tilda py-8">
          <ul className="flex flex-col items-center gap-5 text-[15px] font-bold uppercase tracking-[0.05em]">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  className="nav-link focus-ring inline-flex py-2"
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col items-center gap-4">
            <a
              href={site.orderPhone.href}
              className="focus-ring text-base font-bold text-gold-soft transition-colors hover:text-ember-soft"
            >
              {site.orderPhone.label}
            </a>
            <a
              href={site.orderPhone.href}
              className="cta-square focus-ring"
              onClick={() => setIsOpen(false)}
            >
              Сделать Заказ
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
