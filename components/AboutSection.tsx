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

        <div className="mt-16 grid justify-items-center gap-7 md:mt-24 md:grid-cols-3 md:gap-8">
          {images.about.map((image, index) => (
            <div
              className="media-card group relative aspect-square w-full max-w-[300px] overflow-hidden md:max-w-[360px]"
              data-reveal="scale"
              data-reveal-delay={index * 90}
              key={image.src}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 220px, (max-width: 1024px) 30vw, 360px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
