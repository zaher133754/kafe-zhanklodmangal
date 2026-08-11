import { MenuCatalog } from "@/components/MenuCatalog";
import { CartOverlay } from "@/components/cart/CartOverlay";
import { CartProvider } from "@/components/cart/CartProvider";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton";
import { DishDetailsDialog } from "@/components/menu/DishDetailsDialog";

export function MenuSection() {
  return (
    <CartProvider>
      <section id="menu" className="section-surface bg-espresso py-16 sm:py-[88px] md:py-[132px]">
        <div className="container-tilda">
          <div className="mx-auto max-w-[820px]">
            <h2
              className="section-title"
            >
              Попробуйте всё разнообразие «Жан-Клод Мангал»!
            </h2>
            <p
              className="section-copy mt-6 max-w-[720px] sm:mt-10"
            >
              Наше меню — это коллекция ваших любимых блюд в безупречном
              исполнении. Хочется сочной свиной шеи? Пожалуйста. Предпочитаете
              легкий рыбный стейк или свежий салат? У нас есть всё.
              <br />
              Мы объединили традиции открытого огня и современную кухню, чтобы
              каждый ваш заказ стал событием.
            </p>
          </div>
          <MenuCatalog />
        </div>
      </section>
      <DishDetailsDialog />
      <FloatingCartButton />
      <CartOverlay />
    </CartProvider>
  );
}
