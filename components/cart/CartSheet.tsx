"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Minus,
  Plus,
  ShoppingBag,
  Trash2
} from "lucide-react";
import {
  CheckoutForm,
  type FulfillmentType
} from "@/components/cart/CheckoutForm";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

type CartStep = "cart" | "checkout" | "success";

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function CartSheet() {
  const {
    clearCart,
    closeCart,
    decrementItem,
    incrementItem,
    isOpen,
    lines,
    removeItem,
    setCartOpen,
    totalItems,
    totalPrice
  } = useCart();
  const [step, setStep] = useState<CartStep>("cart");
  const [orderNumber, setOrderNumber] = useState("");
  const [submittedFulfillmentType, setSubmittedFulfillmentType] =
    useState<FulfillmentType>("delivery");
  const [isOrderNumberCopied, setIsOrderNumberCopied] = useState(false);

  useEffect(() => {
    if (isOpen && lines.length > 0 && step === "success") {
      setStep("cart");
    }
  }, [isOpen, lines.length, step]);

  useEffect(() => {
    if (!isOpen) {
      const timer = window.setTimeout(() => {
        setStep("cart");
        setOrderNumber("");
        setSubmittedFulfillmentType("delivery");
        setIsOrderNumberCopied(false);
      }, 180);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const hasItems = lines.length > 0;

  async function copyOrderNumber() {
    if (!orderNumber) {
      return;
    }

    try {
      await navigator.clipboard.writeText(orderNumber);
      setIsOrderNumberCopied(true);
      window.setTimeout(() => setIsOrderNumberCopied(false), 1800);
    } catch {
      setIsOrderNumberCopied(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="w-full max-w-[480px] gap-0 border-gold/20 bg-espresso p-0 text-cream shadow-none sm:max-w-[480px]"
      >
        <SheetHeader className="border-b border-gold/16 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3 pr-10">
            {step !== "cart" && step !== "success" ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Вернуться в корзину"
                onClick={() => setStep("cart")}
                className="mt-0.5 min-h-11 min-w-11 rounded-xl text-gold-soft hover:bg-gold/10 hover:text-cream"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden />
              </Button>
            ) : (
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/22 bg-coal text-ember">
                <ShoppingBag className="h-5 w-5" aria-hidden />
              </span>
            )}
            <div>
              <SheetTitle className="text-2xl font-extrabold leading-tight text-cream">
                {step === "checkout"
                  ? "Оформление заказа"
                  : step === "success"
                    ? "Заказ принят"
                    : "Корзина"}
              </SheetTitle>
              <SheetDescription className="mt-1 text-sm leading-relaxed text-smoke">
                {step === "checkout"
                  ? "Выберите тип получения и оставьте контакты."
                  : step === "success"
                    ? submittedFulfillmentType === "cafe"
                      ? "Сотрудник кафе подтвердит заказ по телефону."
                      : "Спасибо. Мы скоро свяжемся с вами для подтверждения."
                    : hasItems
                      ? `${totalItems} позиций · ${formatPrice(totalPrice)} ₽`
                      : "Добавьте блюда из меню."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {step === "success" ? (
            <div className="grid min-h-[360px] place-items-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-coal text-ember">
                  <ShoppingBag className="h-7 w-7" aria-hidden />
                </div>
                <h3 className="mt-5 text-2xl font-extrabold text-cream">
                  {submittedFulfillmentType === "cafe"
                    ? "Заказ принят."
                    : "Заказ отправлен!"}
                </h3>
                {orderNumber ? (
                  <div className="mx-auto mt-5 max-w-[320px] rounded-2xl border border-gold/28 bg-coal px-5 py-4">
                    <p className="text-sm font-bold text-gold-soft">
                      Номер вашего заказа:
                    </p>
                    <p className="mt-2 text-4xl font-extrabold leading-none text-ember">
                      {orderNumber}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={copyOrderNumber}
                      className="mt-4 min-h-11 rounded-xl px-4 text-sm font-bold text-cream hover:bg-gold/10 hover:text-gold-soft"
                    >
                      {isOrderNumberCopied ? (
                        <Check className="h-4 w-4" aria-hidden />
                      ) : (
                        <Copy className="h-4 w-4" aria-hidden />
                      )}
                      {isOrderNumberCopied
                        ? "Номер скопирован"
                        : "Скопировать номер заказа"}
                    </Button>
                  </div>
                ) : null}
                <p className="mx-auto mt-5 max-w-[300px] text-sm leading-relaxed text-smoke">
                  {submittedFulfillmentType === "cafe"
                    ? "Сотрудник кафе подтвердит его."
                    : "Мы скоро свяжемся с вами для подтверждения."}
                </p>
                <Button
                  type="button"
                  onClick={closeCart}
                  className="mt-7 min-h-12 rounded-xl border border-ember/35 bg-ember px-5 text-base font-extrabold text-white hover:bg-flame"
                >
                  Закрыть
                </Button>
              </div>
            </div>
          ) : step === "checkout" ? (
            <CheckoutForm
              onSubmitted={({
                orderNumber: submittedOrderNumber,
                deliveryType
              }) => {
                setOrderNumber(submittedOrderNumber);
                setSubmittedFulfillmentType(deliveryType);
                setIsOrderNumberCopied(false);
                setStep("success");
              }}
            />
          ) : hasItems ? (
            <div className="grid gap-3">
              {lines.map((line) => (
                <article
                  className="rounded-2xl border border-gold/16 bg-charcoal p-4"
                  key={line.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold leading-tight text-cream">
                        {line.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-smoke">
                        {line.weight} · {formatPrice(line.price)} ₽ за 1 шт.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Удалить ${line.name}`}
                      onClick={() => removeItem(line.id)}
                      className="min-h-11 min-w-11 rounded-xl text-smoke hover:bg-ember/12 hover:text-ember-soft"
                    >
                      <Trash2 className="h-5 w-5" aria-hidden />
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-xl border border-gold/18 bg-coal">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Уменьшить количество ${line.name}`}
                        onClick={() => decrementItem(line.id)}
                        className="min-h-11 min-w-11 rounded-xl text-gold-soft hover:bg-gold/10 hover:text-cream"
                      >
                        <Minus className="h-5 w-5" aria-hidden />
                      </Button>
                      <span className="min-w-10 text-center text-base font-extrabold text-cream">
                        {line.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Увеличить количество ${line.name}`}
                        onClick={() => incrementItem(line.id)}
                        className="min-h-11 min-w-11 rounded-xl text-gold-soft hover:bg-gold/10 hover:text-cream"
                      >
                        <Plus className="h-5 w-5" aria-hidden />
                      </Button>
                    </div>
                    <strong className="text-lg font-extrabold text-ember">
                      {formatPrice(line.price * line.quantity)} ₽
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid min-h-[320px] place-items-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-coal text-ember">
                  <ShoppingBag className="h-7 w-7" aria-hidden />
                </div>
                <h3 className="mt-5 text-2xl font-extrabold text-cream">
                  Корзина пуста
                </h3>
                <p className="mx-auto mt-3 max-w-[280px] text-sm leading-relaxed text-smoke">
                  Выберите шашлык, гарнир или напиток в меню.
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    closeCart();
                    window.setTimeout(() => {
                      document
                        .getElementById("menu")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 120);
                  }}
                  className="mt-7 min-h-12 rounded-xl border border-ember/35 bg-ember px-5 text-base font-extrabold text-white hover:bg-flame"
                >
                  Перейти в меню
                </Button>
              </div>
            </div>
          )}
        </div>

        {step === "cart" && hasItems ? (
          <SheetFooter className="border-t border-gold/16 bg-coal px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-smoke">Сумма заказа</p>
                <p className="mt-1 text-2xl font-extrabold leading-none text-ember">
                  {formatPrice(totalPrice)} ₽
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={clearCart}
                className="min-h-11 rounded-xl px-3 text-sm font-bold text-smoke hover:bg-ember/12 hover:text-ember-soft"
              >
                Очистить
              </Button>
            </div>
            <Button
              type="button"
              onClick={() => setStep("checkout")}
              className="min-h-12 rounded-xl border border-ember/35 bg-ember px-5 text-base font-extrabold text-white hover:bg-flame"
            >
              К оформлению
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
