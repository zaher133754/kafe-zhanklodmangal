import Image from "next/image";
import { preload } from "react-dom";
import {
  CalendarClock,
  Clock3,
  MapPin,
  ShoppingBag,
  Truck,
  UtensilsCrossed
} from "lucide-react";
import { site } from "@/lib/site";
import heroBackground1280 from "@/public/images/hero-bg-1280.avif";
import heroBackground1672 from "@/public/images/hero-bg-1672.avif";
import heroBackground640 from "@/public/images/hero-bg-640.avif";
import heroBackground768 from "@/public/images/hero-bg-768.avif";
import heroBackground960 from "@/public/images/hero-bg-960.avif";
import heroCard from "@/public/images/hero-card.avif";

const heroBackgroundSrcSet = [
  `${heroBackground640.src} 640w`,
  `${heroBackground768.src} 768w`,
  `${heroBackground960.src} 960w`,
  `${heroBackground1280.src} 1280w`,
  `${heroBackground1672.src} 1672w`
].join(", ");

const heroBackgroundBlur =
  "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoQAAkAA8BgJYgCdAD0bK3fgAD+9tenyxV6oxue0mzt39yBTsy/+u0gAAA=";

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
    label: "Доставка до 20 км от кафе"
  }
] as const;

export function Hero() {
  preload(heroBackground1672.src, {
    as: "image",
    type: "image/avif",
    fetchPriority: "high",
    imageSrcSet: heroBackgroundSrcSet,
    imageSizes: "100vw"
  });

  return (
    <section
      id="top"
      className="relative isolate min-h-svh overflow-hidden bg-charcoal pt-[var(--header-height)]"
    >
      <div
        className="absolute inset-0 -z-30 bg-cover bg-[62%_center] md:bg-center"
        style={{ backgroundImage: `url(${heroBackgroundBlur})` }}
        aria-hidden
      >
        {/* This pre-sized immutable asset avoids Layero's uncached image transformer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroBackground1672.src}
          srcSet={heroBackgroundSrcSet}
          sizes="100vw"
          alt="Фотография мангальной кухни Жан Клод Мангал"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={heroBackground1672.width}
          height={heroBackground1672.height}
          className="absolute inset-0 h-full w-full object-cover object-[62%_center] md:object-center"
        />
      </div>

      <div className="hero-overlay -z-20" />

      <div className="container-tilda relative z-10 py-9 sm:py-12 lg:py-16">
        <div className="grid min-h-[calc(100svh-var(--header-height))] items-center gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)] lg:gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(460px,1.08fr)] xl:gap-12">
          <div
            className="max-w-[760px] py-5 sm:py-8"
          >
            <a
              href={site.yandexOrgUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-gold/25 bg-charcoal/75 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-gold-soft shadow-[0_12px_40px_rgba(0,0,0,0.24)] transition-colors hover:border-gold/45 hover:text-cream sm:text-[13px]"
            >
              <MapPin className="h-4 w-4 text-ember-soft" aria-hidden />
              Самара · просп. Кирова, 393В
            </a>

            <h1
              className="mt-6 max-w-[760px] text-[clamp(42px,6.2vw,84px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-cream drop-shadow-[0_8px_34px_rgba(0,0,0,0.42)]"
            >
              Доставка еды из кафе
              <br />
              <span className="text-flame">Жан Клод Мангал</span>
            </h1>

            <p
              className="mt-6 max-w-[650px] text-[clamp(17px,1.55vw,23px)] font-medium leading-[1.5] text-cream/82 sm:mt-7"
            >
              Сочные шашлыки, вкуснейшая шаурма и бургеры с мангала — с
              доставкой по Самаре!
            </p>

            <div
              className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4"
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
                className="focus-ring inline-flex min-h-[60px] items-center justify-center gap-3 rounded-full border border-gold/30 bg-charcoal/75 px-9 text-[17px] font-bold text-cream shadow-[0_14px_38px_rgba(0,0,0,0.24)] transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-gold/55 hover:bg-coal/80 sm:min-h-[64px] sm:px-10 sm:text-[18px]"
              >
                <UtensilsCrossed className="h-[21px] w-[21px] text-gold-soft" aria-hidden />
                Посмотреть меню
              </a>
            </div>

          </div>

          <div
            className="relative mx-auto hidden w-full max-w-[680px] lg:mx-0 lg:block lg:justify-self-end"
          >
            <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-gold/25 via-ember/10 to-transparent blur-2xl" aria-hidden />
            <div className="relative aspect-[4/5] max-h-[780px] overflow-hidden rounded-[28px] border border-gold/25 bg-coal shadow-[0_28px_80px_rgba(0,0,0,0.48)] sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={heroCard}
                alt="Шашлык на мангале в кафе «Жан Клод Мангал»"
                fill
                unoptimized
                placeholder="blur"
                loading="lazy"
                fetchPriority="high"
                decoding="async"
                className="object-cover transition-transform duration-700 hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-gold/5" aria-hidden />
            </div>
          </div>

          <div
            id="delivery"
            className="grid w-full scroll-mt-[calc(var(--header-height)+16px)] overflow-hidden rounded-[24px] border border-gold/25 bg-charcoal/88 shadow-[0_22px_65px_rgba(0,0,0,0.34)] sm:grid-cols-3 lg:col-span-2"
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
          </div>
        </div>
      </div>
    </section>
  );
}
