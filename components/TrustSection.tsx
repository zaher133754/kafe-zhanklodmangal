import Image from "next/image";
import { ExternalLink, MapPin, Navigation, Quote, Star } from "lucide-react";
import { yandexTrust } from "@/data/reviews";

function pluralizeRu(
  value: number,
  forms: readonly [string, string, string]
) {
  const lastTwo = value % 100;
  const last = value % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return forms[2];
  if (last === 1) return forms[0];
  if (last >= 2 && last <= 4) return forms[1];
  return forms[2];
}

function ReviewCard({
  author,
  excerpt
}: {
  author: string;
  excerpt: string;
}) {
  return (
    <article className="grid gap-5 rounded-2xl border border-ember/40 bg-charcoal/55 p-5 sm:grid-cols-[112px_1fr] sm:p-6">
      <div className="flex items-center gap-3 text-ember sm:flex-col sm:items-start sm:border-r sm:border-ember/35 sm:pr-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ember/55">
          <MapPin className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-sm font-bold leading-tight">Яндекс Карты</span>
      </div>

      <div>
        <Quote className="mb-3 h-5 w-5 text-ember" aria-hidden />
        <blockquote className="text-[1.0625rem] font-medium leading-[1.55] text-cream sm:text-lg">
          «{excerpt}»
        </blockquote>
        <p className="mt-4 text-base text-smoke">— {author}</p>
      </div>
    </article>
  );
}

function BrandDivider() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4" aria-hidden>
      <span className="h-px bg-ember/70" />
      <Image
        src="/apple-touch-icon.png"
        alt=""
        width={72}
        height={72}
        className="h-14 w-14 object-contain sm:h-[72px] sm:w-[72px]"
      />
      <span className="h-px bg-ember/70" />
    </div>
  );
}

export function TrustSection() {
  const [firstReview, secondReview, thirdReview] = yandexTrust.reviews;

  return (
    <section
      id="reviews"
      className="section-surface section-pad-xl cv-auto bg-pit"
      aria-labelledby="reviews-title"
    >
      <div className="container-tilda">
        <BrandDivider />

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-12">
          <div className="flex min-w-0 flex-col" data-reveal>
            <h2
              id="reviews-title"
              className="max-w-[720px] text-balance text-[clamp(2.25rem,4.6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-cream"
            >
              Отзывы и как нас найти
            </h2>

            <div className="mt-9 flex flex-wrap items-end gap-x-6 gap-y-3 sm:mt-11">
              <strong className="text-[clamp(4.75rem,10vw,7.5rem)] font-extrabold leading-[0.8] tracking-[-0.035em] text-ember">
                {yandexTrust.rating}
              </strong>
              <div className="pb-1 sm:pb-2">
                <div
                  className="flex gap-1 text-ember"
                  role="img"
                  aria-label={`Рейтинг ${yandexTrust.rating} из 5`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      className="h-7 w-7 fill-current sm:h-8 sm:w-8"
                      aria-hidden
                      key={index}
                    />
                  ))}
                </div>
                <p className="mt-2 text-base text-smoke sm:text-lg">
                  {yandexTrust.ratingCount}{" "}
                  {pluralizeRu(yandexTrust.ratingCount, [
                    "оценка",
                    "оценки",
                    "оценок"
                  ])}{" "}
                  · {yandexTrust.reviewCount}{" "}
                  {pluralizeRu(yandexTrust.reviewCount, [
                    "отзыв",
                    "отзыва",
                    "отзывов"
                  ])}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <ReviewCard {...firstReview} />
              <ReviewCard {...secondReview} />
            </div>

            <a
              href={yandexTrust.reviewsUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border border-ember bg-transparent px-5 text-center text-base font-bold text-cream transition-colors hover:bg-ember/10"
            >
              <ExternalLink className="h-5 w-5 text-ember" aria-hidden />
              Смотреть отзывы на Яндекс Картах
            </a>
          </div>

          <div
            className="flex min-w-0 flex-col gap-5"
            data-reveal
            data-reveal-delay="100"
          >
            <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-ember/45 bg-coal sm:min-h-[430px]">
              <iframe
                src={yandexTrust.mapEmbedUrl}
                title="Жан Клод Мангал на Яндекс Картах"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>

            <ReviewCard {...thirdReview} />

            <a
              href={yandexTrust.routeUrl}
              target="_blank"
              rel="noreferrer"
              className="cta-square focus-ring min-h-14 w-full gap-3 rounded-xl px-5 text-base"
            >
              <Navigation className="h-5 w-5" aria-hidden />
              Построить маршрут
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-sm leading-relaxed text-smoke">
          Данные и отзывы: Яндекс Карты. Проверено{" "}
          <time dateTime={yandexTrust.verifiedAt}>6 июля 2026 года</time>.
        </p>

        <div className="mt-10 sm:mt-12">
          <BrandDivider />
        </div>
      </div>
    </section>
  );
}
