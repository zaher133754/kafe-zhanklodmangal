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
    <header className="fixed inset-x-0 top-0 z-50 bg-black shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <div className="container-tilda flex h-[var(--header-height)] items-center justify-between gap-5">
        <a
          href="#top"
          className="focus-ring relative h-[54px] w-[124px] shrink-0 sm:w-[150px]"
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
          <ul className="flex items-center gap-8 text-[13px] font-bold uppercase tracking-[0]">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  className="focus-ring transition-colors hover:text-ember-soft"
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
            className="focus-ring text-[15px] font-bold text-ember"
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
          className="focus-ring inline-flex h-10 w-10 items-center justify-center text-ember md:hidden"
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
            ? "max-h-[calc(100svh-var(--header-height))] opacity-100"
            : "max-h-0 opacity-0"
        } overflow-hidden bg-black transition-[max-height,opacity] duration-300`}
      >
        <nav className="container-tilda py-6">
          <ul className="flex flex-col items-center gap-4 text-sm font-bold uppercase">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  className="focus-ring inline-flex py-1 transition-colors hover:text-ember-soft"
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
              className="focus-ring text-base font-bold text-ember"
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
