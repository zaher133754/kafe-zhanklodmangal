import { MenuSlider } from "@/components/MenuSlider";

export function MenuSection() {
  return (
    <section id="menu" className="section-surface cv-auto bg-espresso py-[88px] md:py-[132px]">
      <div className="container-tilda text-center">
        <div className="mx-auto max-w-[820px]">
          <h2
            className="section-title"
            data-reveal
          >
            Попробуйте всё разнообразие «Жан-Клод Мангал»!
          </h2>
          <p
            className="section-copy mx-auto mt-10 max-w-[720px]"
            data-reveal
            data-reveal-delay="90"
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
