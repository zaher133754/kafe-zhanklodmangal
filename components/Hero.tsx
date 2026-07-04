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
      className="relative min-h-[80svh] overflow-hidden bg-black pt-[var(--header-height)]"
    >
      <Image
        src={images.hero}
        alt="Шашлык на мангале"
        fill
        priority
        fetchPriority="high"
        quality={65}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10">
        <div className="container-tilda grid min-h-[calc(80svh-var(--header-height))] items-center gap-12 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-16">
          <div className="max-w-[690px]" data-reveal>
            <h1 className="text-[clamp(38px,5vw,64px)] font-extrabold leading-[1.16] tracking-[0] text-white">
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
            <p className="mt-8 max-w-[560px] text-[clamp(16px,1.8vw,26px)] font-bold leading-normal text-white/80">
              {site.description}
            </p>
            <a
              href={site.orderPhone.href}
              className="cta-pill focus-ring mt-10"
            >
              Заказать
            </a>
          </div>

          <div className="grid gap-10 justify-self-start md:justify-self-end">
            {heroBenefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <div
                  className="flex max-w-[370px] items-center gap-8"
                  data-reveal
                  style={{ transitionDelay: `${index * 120}ms` }}
                  key={benefit.lines.join("-")}
                >
                  <Icon
                    aria-hidden
                    className="h-[52px] w-[52px] shrink-0 text-white"
                    strokeWidth={1.8}
                  />
                  <p className="text-[15px] font-bold leading-relaxed text-white sm:text-[20px]">
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
