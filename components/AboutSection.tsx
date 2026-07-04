import Image from "next/image";
import { images } from "@/lib/site";

export function AboutSection() {
  return (
    <section id="onas" className="section-pad-lg cv-auto bg-coal">
      <div className="container-tilda text-center">
        <div className="mx-auto max-w-[860px]">
          <h2 className="section-title" data-reveal>
            Вкус, который вы искали.
            <br />
            Здесь мясо готовят так, как вы ещё не пробовали.
          </h2>
          <p className="section-copy mx-auto mt-[60px] max-w-[940px]" data-reveal>
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

        <div className="mt-28 grid justify-items-center gap-10 md:grid-cols-3 md:gap-9">
          {images.about.map((image, index) => (
            <div
              className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.2)] md:max-w-[360px]"
              data-reveal
              style={{ transitionDelay: `${index * 120}ms` }}
              key={image.src}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 220px, (max-width: 1024px) 30vw, 360px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
