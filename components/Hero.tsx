"use client";

import Image from "next/image";
import {
  CalendarClock,
  Clock3,
  MapPin,
  ShoppingBag,
  Truck,
  UtensilsCrossed
} from "lucide-react";
import { motion, type Variants, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

const contentVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.28,
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(8px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.82,
      ease: EASE_PREMIUM
    }
  }
};

const serviceFacts = [
  {
    icon: CalendarClock,
    label: "Время работы:\n11:00–00:00 (Пт - Сб)\n11:00–23:00 (Вс - Чт)"
  },
  {
    icon: Clock3,
    label: "Доставляем за 45–60 минут"
  },
  {
    icon: Truck,
    label: "Бесплатно от 3 000 рублей"
  }
] as const;

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const initialState = prefersReducedMotion ? false : "hidden";

  return (
    <section
      id="top"
      className="relative isolate min-h-svh overflow-hidden bg-charcoal pt-[var(--header-height)]"
    >
      <motion.div
        className="absolute inset-0 -z-30"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.35, ease: EASE_PREMIUM }}
        aria-hidden
      >
        <Image
          src="/images/herofoto.avif"
          alt="Фотография мангальной кухни Жан Клод Мангал"
          fill
          priority
          fetchPriority="high"
          quality={82}
          sizes="100vw"
          className="object-cover object-[62%_center] md:object-center"
        />
      </motion.div>

      <div className="hero-overlay -z-20" />
      <div className="hero-grain -z-10" aria-hidden />

      <motion.div
        className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-ember/12 blur-[100px] sm:h-96 sm:w-96"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.55, ease: EASE_PREMIUM }}
        aria-hidden
      />

      <div className="container-tilda relative z-10 py-9 sm:py-12 lg:py-16">
        <div className="grid min-h-[calc(100svh-var(--header-height))] items-center gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)] lg:gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(460px,1.08fr)] xl:gap-12">
          <motion.div
            className="max-w-[760px] py-5 sm:py-8"
            variants={contentVariants}
            initial={initialState}
            animate="visible"
          >
            <motion.a
              href={site.yandexOrgUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-gold/25 bg-charcoal/55 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-gold-soft shadow-[0_12px_40px_rgba(0,0,0,0.24)] backdrop-blur-md transition-colors hover:border-gold/45 hover:text-cream sm:text-[13px]"
              variants={itemVariants}
            >
              <MapPin className="h-4 w-4 text-ember-soft" aria-hidden />
              Самара · просп. Кирова, 393В
            </motion.a>

            <motion.h1
              className="mt-6 max-w-[760px] text-[clamp(42px,6.2vw,84px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-cream drop-shadow-[0_8px_34px_rgba(0,0,0,0.42)]"
              variants={itemVariants}
            >
              Доставка еды из кафе
              <br />
              <span className="text-flame">Жан Клод Мангал</span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-[650px] text-[clamp(17px,1.55vw,23px)] font-medium leading-[1.5] text-cream/82 sm:mt-7"
              variants={itemVariants}
            >
              Сочные шашлыки, вкуснейшая шаурма и бургеры с мангала — с
              доставкой по Самаре!
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4"
              variants={itemVariants}
            >
              <a
                href={site.orderPhone.href}
                className="cta-pill focus-ring min-h-[60px] gap-3 px-9 text-[17px] sm:min-h-[64px] sm:px-10 sm:text-[18px]"
              >
                <ShoppingBag className="h-[21px] w-[21px]" aria-hidden />
                Заказать доставку
              </a>
              <a
                href="#menu"
                className="focus-ring inline-flex min-h-[60px] items-center justify-center gap-3 rounded-full border border-gold/30 bg-charcoal/55 px-9 text-[17px] font-bold text-cream shadow-[0_14px_38px_rgba(0,0,0,0.24)] backdrop-blur-md transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-gold/55 hover:bg-coal/80 sm:min-h-[64px] sm:px-10 sm:text-[18px]"
              >
                <UtensilsCrossed className="h-[21px] w-[21px] text-gold-soft" aria-hidden />
                Посмотреть меню
              </a>
            </motion.div>

          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-[680px] lg:mx-0 lg:justify-self-end"
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, x: 36, scale: 0.96 }
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.42, ease: EASE_PREMIUM }}
          >
            <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-gold/25 via-ember/10 to-transparent blur-2xl" aria-hidden />
            <div className="relative aspect-[4/5] max-h-[780px] overflow-hidden rounded-[28px] border border-gold/25 bg-coal shadow-[0_28px_80px_rgba(0,0,0,0.48)] sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="/images/about-kebab.webp"
                alt="Шашлык на мангале в кафе «Жан Клод Мангал»"
                fill
                quality={88}
                sizes="(max-width: 1023px) 90vw, (max-width: 1279px) 44vw, 640px"
                className="object-cover transition-transform duration-700 hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-gold/5" aria-hidden />
            </div>
          </motion.div>

          <motion.div
            id="delivery"
            className="grid w-full scroll-mt-[calc(var(--header-height)+16px)] overflow-hidden rounded-[24px] border border-gold/25 bg-charcoal/70 shadow-[0_22px_65px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:grid-cols-3 lg:col-span-2"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, delay: 0.78, ease: EASE_PREMIUM }}
            aria-label="Преимущества доставки"
          >
            {serviceFacts.map((fact) => {
              const Icon = fact.icon;

              return (
                <div
                  className="flex min-h-[88px] items-center gap-4 border-gold/15 px-5 py-5 text-left max-sm:border-t max-sm:first:border-t-0 sm:min-h-[104px] sm:border-l sm:px-7 sm:first:border-l-0 lg:min-h-[116px] lg:gap-5 lg:px-9"
                  key={fact.label}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/12 text-gold-soft lg:h-14 lg:w-14">
                    <Icon className="h-6 w-6 lg:h-7 lg:w-7" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="whitespace-pre-line text-[16px] font-semibold leading-[1.35] text-cream/90 sm:text-[17px] lg:text-[19px]">
                    {fact.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
