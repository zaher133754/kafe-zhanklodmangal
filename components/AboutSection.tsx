import Image from "next/image";
import { images } from "@/lib/site";

export function AboutSection() {
  return (
    <section id="onas" className="section-surface section-pad-lg cv-auto bg-coal">
      <div className="container-tilda text-center">
        <div className="mx-auto max-w-[860px]">
          <h2 className="section-title" data-reveal>
            Вкус, который вы искали.
            <br />
            Здесь мясо готовят так, как вы ещё не пробовали.
          </h2>
          <p
            className="section-copy mx-auto mt-10 max-w-[940px] md:mt-12"
            data-reveal
            data-reveal-delay="90"
          >
            Мы готовим по традиционным армянским рецептам, передавая настоящий
            вкус мяса на углях — сочного, ароматного, с идеальной прожаркой.
            <br />
            В основе каждого блюда — только свежие продукты и отборное мясо,
            чтобы сохранить настоящий вкус блюд на углях.
            <br />
            Попробовав один раз, вы понимаете разницу — такого насыщенного вкуса
            вы ещё не ощущали.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 justify-items-center gap-3 sm:gap-5 md:mt-24 md:grid-cols-6 md:gap-8 xl:relative xl:left-1/2 xl:w-[min(calc(100vw-40px),1854px)] xl:-translate-x-1/2 xl:grid-cols-5 xl:gap-4">
          {images.about.map((image, index) => (
              <div
                className="media-card group relative aspect-square w-full max-w-[300px] overflow-hidden max-md:last:col-span-2 md:col-span-2 md:max-w-[360px] md:[&:nth-child(4)]:col-start-2 xl:col-span-1 xl:max-w-[358px] xl:[&:nth-child(4)]:col-start-auto"
                data-reveal
                data-reveal-delay={Math.min(index * 55, 160)}
                key={image.src}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  quality={60}
                  sizes="(max-width: 767px) 45vw, (max-width: 1279px) 30vw, (max-width: 1910px) calc((100vw - 104px) / 5), 358px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                />
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
