import Image from "next/image";
import { Flame, LayoutGrid, UsersRound } from "lucide-react";
import { banquetBenefits } from "@/data/banquets";
import banquetFood from "@/public/images/banquet-food.webp";
import banquetHall from "@/public/images/banquet-hall.webp";
import banquetTable from "@/public/images/banquet-table.webp";

const heroImages = [
  {
    src: banquetTable,
    alt: "Банкетный стол с блюдами в кафе ЖанКлод Мангал"
  },
  {
    src: banquetHall,
    alt: "Зал кафе ЖанКлод Мангал для праздника"
  },
  {
    src: banquetFood,
    alt: "Горячие блюда для банкета в ЖанКлод Мангал"
  }
] as const;

const benefitIcons = [Flame, LayoutGrid, UsersRound] as const;

export function BanquetHero() {
  return (
    <section className="section-surface overflow-hidden bg-coal pt-[calc(var(--header-height)+32px)] sm:pt-[calc(var(--header-height)+40px)] lg:pt-[calc(var(--header-height)+32px)]">
      <div className="container-tilda">
        <div
          className="grid items-center gap-12 lg:min-h-[clamp(520px,46vw,620px)] lg:grid-cols-[minmax(0,0.88fr)_minmax(540px,1.12fr)] lg:gap-12 xl:gap-16"
          data-banquet-hero-layout
        >
          <div className="max-w-[650px] text-left">
            <h1 className="text-balance text-[clamp(42px,6.2vw,84px)] font-extrabold leading-[0.98] tracking-[-0.035em] text-cream">
              Банкеты, корпоративы и Дни рождения{" "}
              <span className="text-flame">в Самаре</span>
            </h1>

            <p className="mt-7 max-w-[60ch] text-[clamp(1rem,1.35vw,1.2rem)] font-bold leading-relaxed text-gold-soft">
              До 40 человек — Стоимость от 2500 ₽ на гостя — Можно со своим
              алкоголем
            </p>

            <p className="mt-6 max-w-[62ch] text-pretty text-[clamp(1rem,1.3vw,1.18rem)] font-medium leading-[1.58] text-cream/82">
              Мы знаем, как сделать ваш праздник вкусным и уютным. Дни рождения,
              корпоративы или встречи с друзьями — в «Жан Клод Мангал» вы получаете
              тёплую атмосферу, сочное мясо на углях и никакой суеты.
            </p>

            <button
              type="button"
              className="cta-pill focus-ring mt-8 min-w-[190px]"
              data-banquet-request-trigger
            >
              Оставить заявку
            </button>
          </div>

          <div
            className="relative mx-auto aspect-[1.04] w-full max-w-[760px]"
            data-banquet-collage
          >
            <div className="media-card group absolute inset-y-[2%] left-0 w-[59%] overflow-hidden">
              <Image
                src={heroImages[0].src}
                alt={heroImages[0].alt}
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 1023px) 54vw, 430px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
            </div>
            <div className="media-card group absolute right-0 top-[8%] h-[42%] w-[37%] overflow-hidden">
              <Image
                src={heroImages[1].src}
                alt={heroImages[1].alt}
                fill
                placeholder="blur"
                sizes="(max-width: 1023px) 34vw, 275px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
            </div>
            <div className="media-card group absolute bottom-[2%] right-0 h-[44%] w-[49%] overflow-hidden">
              <Image
                src={heroImages[2].src}
                alt={heroImages[2].alt}
                fill
                placeholder="blur"
                sizes="(max-width: 1023px) 45vw, 365px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
            </div>
          </div>
        </div>

        <div
          className="mt-20 border-t border-gold/20 py-6 lg:mt-32"
          data-banquet-benefits
        >
          <div className="grid md:grid-cols-3">
            {banquetBenefits.map((benefit, index) => {
              const Icon = benefitIcons[index];

              return (
                <article
                  key={benefit.title}
                  className="grid grid-cols-[32px_1fr] gap-x-3 border-b border-gold/18 py-5 first:pt-0 last:border-b-0 last:pb-0 md:border-b-0 md:border-l md:border-gold/18 md:px-5 md:py-0 md:first:border-l-0 md:first:pl-0 md:last:pr-0 xl:px-7"
                >
                  <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-gold/25 text-gold-soft">
                    <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-balance text-[17px] font-extrabold leading-[1.22] text-cream xl:text-[18px]">
                      {benefit.title}
                    </h2>
                    <p className="mt-2 text-pretty text-[14px] font-medium leading-[1.5] text-cream/78">
                      {benefit.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
