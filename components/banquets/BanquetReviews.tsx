"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { banquetReviews } from "@/data/banquets";
import { yandexTrust } from "@/data/reviews";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

type BanquetReview = (typeof banquetReviews)[number];

function ReviewCard({ review }: { review: BanquetReview }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gold/18 bg-coal p-6 shadow-[0_18px_45px_rgba(0,0,0,0.22)] sm:p-7">
      <div className="flex gap-1 text-gold-soft" aria-label="Оценка 5 из 5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className="h-4 w-4 fill-current"
            strokeWidth={1.5}
            aria-hidden
          />
        ))}
      </div>
      <blockquote className="mt-5 flex-1 text-[16px] leading-[1.7] text-cream/78">
        «{review.text}»
      </blockquote>
      <footer className="mt-6 border-t border-gold/15 pt-5">
        <p className="font-extrabold text-cream">{review.author}</p>
        <p className="mt-1 text-sm text-smoke">{review.date}</p>
      </footer>
    </article>
  );
}

export function BanquetReviews() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => setCurrent(api.selectedScrollSnap() + 1);
    updateCurrent();
    api.on("select", updateCurrent);
    api.on("reInit", updateCurrent);

    return () => {
      api.off("select", updateCurrent);
      api.off("reInit", updateCurrent);
    };
  }, [api]);

  return (
    <section className="section-surface bg-pit py-20 sm:py-24 lg:py-28">
      <div className="container-tilda">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title text-cream">Отзывы наших клиентов</h2>
          <p className="mt-4 text-base leading-relaxed text-cream/65 sm:text-lg">
            Гости отмечают вкус блюд, уютную атмосферу и внимательное отношение.
          </p>
        </div>

        <div
          className="mt-12 hidden grid-cols-3 items-stretch gap-5 md:grid lg:gap-7"
          data-banquet-review-grid
        >
          {banquetReviews.map((review) => (
            <ReviewCard key={review.author} review={review} />
          ))}
        </div>

        <Carousel
          className="mt-10 md:hidden"
          opts={{ align: "start", loop: false }}
          setApi={setApi}
          data-banquet-review-carousel
          aria-label="Отзывы наших клиентов"
        >
          <CarouselContent>
            {banquetReviews.map((review) => (
              <CarouselItem key={review.author}>
                <ReviewCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-6 flex items-center justify-between">
            <CarouselPrevious
              className="static h-11 w-11 border-gold/30 bg-coal text-cream hover:bg-ember"
              aria-label="Предыдущий отзыв"
            />
            <span className="text-sm font-bold text-gold-soft" aria-live="polite">
              {current} из {banquetReviews.length}
            </span>
            <CarouselNext
              className="static h-11 w-11 border-gold/30 bg-coal text-cream hover:bg-ember"
              aria-label="Следующий отзыв"
            />
          </div>
        </Carousel>

        <div className="mt-9 text-center">
          <a
            href={yandexTrust.reviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex min-h-11 items-center font-bold text-gold-soft underline decoration-gold/45 underline-offset-4 transition-colors hover:text-flame"
          >
            Больше отзывов на Яндекс Картах
          </a>
        </div>
      </div>
    </section>
  );
}
