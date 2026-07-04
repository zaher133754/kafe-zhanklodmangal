import { MenuSlider } from "@/components/MenuSlider";

export function MenuSection() {
  return (
    <section id="menu" className="cv-auto bg-espresso py-[120px] md:py-[135px]">
      <div className="container-tilda text-center">
        <div className="mx-auto max-w-[760px]">
          <h2
            className="text-[clamp(27px,3vw,34px)] font-extrabold leading-tight text-ember"
            data-reveal
          >
            Попробуйте всё разнообразие «Жан-Клод Мангал»!
          </h2>
          <p
            className="mx-auto mt-[70px] max-w-[610px] text-[16px] font-light leading-[1.55] text-white/86 md:text-[22px]"
            data-reveal
          >
            Наше меню — это коллекция ваших любимых блюд в безупречном
            исполнении. Хочется сочной свиной шеи? Пожалуйста. Предпочитаете
            легкий рыбный стейк или свежий салат? У нас есть всё.
            <br />
            Мы объединили традиции открытого огня и современную кухню, чтобы
            каждый ваш заказ стал событием.
          </p>
        </div>
        <MenuSlider />
      </div>
    </section>
  );
}
