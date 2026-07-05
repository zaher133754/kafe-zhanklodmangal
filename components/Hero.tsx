import Image from "next/image";
import { Clock3, ShoppingBag, Truck } from "lucide-react";
import { images, site } from "@/lib/site";

const heroBenefits = [
  {
    icon: Truck,
    lines: ["Бесплатная доставка", "от 2500 рублей"]
  },
  {
    icon: ShoppingBag,
    lines: ["Доставляем блюда горячими за 45–60 минут"]
  },
  {
    icon: Clock3,
    lines: ["Время работы:", ...site.openingHours]
  }
] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[82svh] overflow-hidden bg-charcoal pt-[var(--header-height)]"
    >
      <Image
        src={images.hero}
        alt="Шашлык на мангале"
        fill
        priority
        fetchPriority="high"
        quality={65}
        sizes="100vw"
        className="scale-[1.015] object-cover object-center"
      />
      <div className="hero-overlay" />
      <div className="relative z-10">
        <div className="container-tilda grid min-h-[calc(82svh-var(--header-height))] items-center gap-10 py-14 md:grid-cols-[1.08fr_0.92fr] md:py-18 lg:gap-20">
          <div className="max-w-[690px]" data-reveal data-reveal-delay="60">
            <h1 className="text-[clamp(38px,5.2vw,68px)] font-extrabold leading-[1.07] tracking-[-0.035em] text-cream drop-shadow-[0_5px_26px_rgba(0,0,0,0.36)]">
              Доставка еды
              <br />
              из кафе{" "}
              <a
                href={site.yandexOrgUrl}
                className="orange-link focus-ring inline"
                target="_blank"
                rel="noreferrer"
              >
                Жан Клод
                <br className="hidden sm:block" /> Мангал
              </a>
            </h1>
            <p className="mt-7 max-w-[570px] text-[clamp(17px,1.7vw,25px)] font-semibold leading-[1.45] text-cream/82">
              {site.description}
            </p>
            <a
              href={site.orderPhone.href}
              className="cta-pill focus-ring mt-10"
            >
              Заказать
            </a>
          </div>

          <div className="grid w-full max-w-[420px] gap-3 justify-self-start md:justify-self-end">
            {heroBenefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <div
                  className="benefit-card flex w-full items-center gap-5 p-5 sm:p-6"
                  data-reveal
                  data-reveal-delay={160 + index * 90}
                  key={benefit.lines.join("-")}
                >
                  <Icon
                    aria-hidden
                    className="h-11 w-11 shrink-0 text-gold-soft"
                    strokeWidth={1.8}
                  />
                  <p className="text-[15px] font-semibold leading-[1.45] text-cream sm:text-[18px]">
                    {benefit.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
