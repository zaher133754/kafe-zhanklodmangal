import Image from "next/image";
import { images, site } from "@/lib/site";

export function BanquetsSection() {
  return (
    <section id="ban" className="section-pad-xl cv-auto bg-coal">
      <div className="container-tilda grid items-center gap-14 md:grid-cols-2 md:gap-16">
        <div className="relative mx-auto w-full max-w-[560px]" data-reveal>
          <div className="flex">
            <div className="w-[60%] pr-2.5">
              <div className="relative aspect-[100/135] overflow-hidden rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                <Image
                  src={images.banquets[0].src}
                  alt={images.banquets[0].alt}
                  fill
                  sizes="(max-width: 768px) 55vw, 340px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-[40%] pl-2.5">
              <div className="relative mt-[40%] aspect-[100/120] overflow-hidden rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.2)] sm:mt-[30%] md:mt-[40%]">
                <Image
                  src={images.banquets[1].src}
                  alt={images.banquets[1].alt}
                  fill
                  sizes="(max-width: 768px) 36vw, 230px"
                  className="object-cover"
                />
              </div>
              <div className="relative mt-5 hidden aspect-square w-[160%] -translate-x-1/2 overflow-hidden rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.2)] sm:block">
                <Image
                  src={images.banquets[2].src}
                  alt={images.banquets[2].alt}
                  fill
                  sizes="(max-width: 768px) 58vw, 360px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.2)] sm:hidden">
            <Image
              src={images.banquets[2].src}
              alt={images.banquets[2].alt}
              fill
              sizes="86vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="text-left" data-reveal>
          <h2 className="text-[30px] font-extrabold uppercase leading-tight text-ember md:text-[38px]">
            Банкеты и торжества
          </h2>
          <p className="mt-[34px] text-[18px] font-light leading-[1.55] text-white/88 md:text-[24px]">
            Мы знаем, как сделать ваш праздник вкусным и уютным. Дни рождения,
            корпоративы или встречи с друзьями — в «ЖанКлод Мангал» вы
            получаете тёплую атмосферу, сочное мясо на углях и никакой суеты. Мы
            берём на себя готовку и сервис, чтобы вы могли наслаждаться
            общением. Приходите большой компанией — накроем стол, нажарим мяса
            и сделаем вечер незабываемым.
          </p>
          <a
            href={site.orderPhone.href}
            className="cta-pill focus-ring mt-10"
          >
            Оставить заявку
          </a>
        </div>
      </div>
    </section>
  );
}
