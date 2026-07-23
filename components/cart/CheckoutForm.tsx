"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import {
  CAFE_CLOSE_TIME,
  CAFE_OPEN_TIME,
  getTodayInSamara,
  isCafeVisitTime,
  isFutureSamaraVisit
} from "@/lib/cafe-visit";
import {
  calculateDeliveryCost,
  DELIVERY_COST,
  FREE_DELIVERY_THRESHOLD
} from "@/lib/delivery";

type CheckoutFormProps = {
  onSubmitted: (order: {
    orderNumber: string;
    deliveryType: FulfillmentType;
  }) => void;
};

export type FulfillmentType = "delivery" | "pickup" | "cafe";

const ORDER_RETRY_DELAYS_MS = [1_500, 2_500, 4_000];

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function submitOrder(body: string) {
  for (let attempt = 0; attempt <= ORDER_RETRY_DELAYS_MS.length; attempt += 1) {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });

    if (response.status !== 503 || attempt === ORDER_RETRY_DELAYS_MS.length) {
      return response;
    }

    await wait(ORDER_RETRY_DELAYS_MS[attempt]);
  }

  throw new Error("Не удалось дождаться запуска сервера.");
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function isPhoneLike(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10;
}

function formatVisitDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Samara"
  }).format(new Date(`${value}T12:00:00+04:00`));
}

function fulfillmentOptionClass(selected: boolean) {
  return selected
    ? "focus-within:ring-ring/50 flex min-h-12 items-center gap-3 rounded-xl border border-ember/70 bg-ember/12 px-4 text-sm font-bold text-cream transition-colors focus-within:ring-3"
    : "focus-within:ring-ring/50 flex min-h-12 items-center gap-3 rounded-xl border border-gold/18 bg-charcoal px-4 text-sm font-bold text-cream transition-colors hover:border-gold/38 focus-within:ring-3";
}

export function CheckoutForm({ onSubmitted }: CheckoutFormProps) {
  const { clearCart, lines, totalPrice } = useCart();
  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("delivery");
  const [todayInSamara] = useState(getTodayInSamara);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const deliveryCost = calculateDeliveryCost(fulfillmentType, totalPrice);
  const grandTotal = totalPrice + deliveryCost;
  const fulfillmentLabel =
    fulfillmentType === "delivery"
      ? "Доставка"
      : fulfillmentType === "pickup"
        ? "Самовывоз"
        : "В кафе ко времени";

  const orderItems = useMemo(
    () =>
      lines.map((line) => ({
        name: line.name,
        price: line.price,
        quantity: line.quantity
      })),
    [lines]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const customerName = String(formData.get("customerName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const visitDate = getTodayInSamara();
    const visitTime = String(formData.get("visitTime") ?? "").trim();
    const guestCount = Number(formData.get("guestCount"));
    const comment = String(formData.get("comment") ?? "").trim();

    if (fulfillmentType === "delivery" && !address) {
      setStatus("error");
      setMessage("Укажите адрес доставки.");
      return;
    }

    if (fulfillmentType === "cafe" && !visitTime) {
      setStatus("error");
      setMessage("Укажите время визита в кафе.");
      return;
    }

    if (fulfillmentType === "cafe" && !isCafeVisitTime(visitTime)) {
      setStatus("error");
      setMessage(
        `Выберите время с ${CAFE_OPEN_TIME} до ${CAFE_CLOSE_TIME}.`
      );
      return;
    }

    if (
      fulfillmentType === "cafe" &&
      (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 100)
    ) {
      setStatus("error");
      setMessage("Укажите количество гостей от 1 до 100.");
      return;
    }

    if (
      fulfillmentType === "cafe" &&
      !isFutureSamaraVisit(visitDate, visitTime)
    ) {
      setStatus("error");
      setMessage("Выберите время позже текущего.");
      return;
    }

    if (!customerName) {
      setStatus("error");
      setMessage("Укажите имя.");
      return;
    }

    if (!isPhoneLike(phone)) {
      setStatus("error");
      setMessage("Укажите телефон в формате номера.");
      return;
    }

    if (orderItems.length === 0) {
      setStatus("error");
      setMessage("Корзина пуста.");
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const response = await submitOrder(
        JSON.stringify({
          customerName,
          phone,
          deliveryType: fulfillmentType,
          address: fulfillmentType === "delivery" ? address : "",
          visitDate: fulfillmentType === "cafe" ? visitDate : "",
          visitTime: fulfillmentType === "cafe" ? visitTime : "",
          guestCount: fulfillmentType === "cafe" ? guestCount : 0,
          comment,
          items: orderItems,
          total: totalPrice
        })
      );
      const result = (await response.json()) as {
        success?: boolean;
        orderNumber?: string;
        error?: string;
      };

      if (
        !response.ok ||
        !result.success ||
        !result.orderNumber ||
        !/^\d{4}$/.test(result.orderNumber)
      ) {
        throw new Error(result.error || "Не удалось отправить заказ.");
      }

      clearCart();
      setStatus("sent");
      setMessage(
        "Заказ отправлен! Мы скоро свяжемся с вами для подтверждения."
      );
      onSubmitted({
        orderNumber: result.orderNumber,
        deliveryType: fulfillmentType
      });
      form.reset();
      setFulfillmentType("delivery");
    } catch {
      setStatus("error");
      setMessage(
        "Не удалось отправить заказ. Попробуйте ещё раз или позвоните нам."
      );
    }
  }

  return (
    <form className="grid gap-4" noValidate onSubmit={handleSubmit}>
      <fieldset className="grid gap-2">
        <legend className="text-sm font-bold text-cream">Тип получения</legend>
        <div className="grid grid-cols-2 gap-2">
          <label
            className={fulfillmentOptionClass(fulfillmentType === "delivery")}
          >
            <input
              type="radio"
              name="deliveryType"
              value="delivery"
              checked={fulfillmentType === "delivery"}
              onChange={() => {
                setFulfillmentType("delivery");
                setStatus("idle");
                setMessage("");
              }}
              className="h-4 w-4 accent-ember"
            />
            Доставка
          </label>
          <label
            className={fulfillmentOptionClass(fulfillmentType === "pickup")}
          >
            <input
              type="radio"
              name="deliveryType"
              value="pickup"
              checked={fulfillmentType === "pickup"}
              onChange={() => {
                setFulfillmentType("pickup");
                setStatus("idle");
                setMessage("");
              }}
              className="h-4 w-4 accent-ember"
            />
            Самовывоз
          </label>
          <label
            className={`${fulfillmentOptionClass(fulfillmentType === "cafe")} col-span-2`}
          >
            <input
              type="radio"
              name="deliveryType"
              value="cafe"
              checked={fulfillmentType === "cafe"}
              onChange={() => {
                setFulfillmentType("cafe");
                setStatus("idle");
                setMessage("");
              }}
              className="h-4 w-4 accent-ember"
            />
            В кафе ко времени
          </label>
        </div>
      </fieldset>

      {fulfillmentType === "delivery" ? (
        <label className="grid gap-2 text-sm font-bold text-cream">
          Адрес доставки
          <input
            name="address"
            required
            autoComplete="street-address"
            className="focus-ring min-h-12 rounded-xl border border-gold/18 bg-charcoal px-4 text-base font-medium text-cream outline-none placeholder:text-smoke"
            placeholder="Самара, улица, дом, квартира"
          />
        </label>
      ) : null}

      {fulfillmentType === "cafe" ? (
        <fieldset className="grid gap-3 rounded-xl bg-coal px-4 py-4">
          <legend className="px-1 text-sm font-bold text-cream">
            Визит в кафе
          </legend>
          <p className="text-xs font-medium leading-relaxed text-smoke">
            Заказ можно оформить только на сегодня, с {CAFE_OPEN_TIME} до{" "}
            {CAFE_CLOSE_TIME}. Сотрудник кафе подтвердит его по телефону.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid min-w-0 gap-2 text-sm font-bold text-cream">
              Дата
              <output className="flex min-h-12 min-w-0 items-center rounded-xl bg-charcoal px-4 text-base font-medium text-cream">
                Сегодня, {formatVisitDate(todayInSamara)}
              </output>
            </div>
            <label className="grid min-w-0 gap-2 text-sm font-bold text-cream">
              Время
              <input
                type="time"
                name="visitTime"
                min={CAFE_OPEN_TIME}
                max={CAFE_CLOSE_TIME}
                required
                className="focus-ring min-h-12 min-w-0 rounded-xl border border-gold/18 bg-charcoal px-3 text-base font-medium text-cream outline-none"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold text-cream">
            Количество гостей
            <input
              type="number"
              name="guestCount"
              min={1}
              max={100}
              step={1}
              required
              inputMode="numeric"
              className="focus-ring min-h-12 rounded-xl border border-gold/18 bg-charcoal px-4 text-base font-medium text-cream outline-none placeholder:text-smoke"
              placeholder="Например, 4"
            />
          </label>
        </fieldset>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-cream">
          Имя
          <input
            name="customerName"
            required
            autoComplete="name"
            className="focus-ring min-h-12 min-w-0 rounded-xl border border-gold/18 bg-charcoal px-4 text-base font-medium text-cream outline-none placeholder:text-smoke"
            placeholder="Иван"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-cream">
          Телефон
          <input
            name="phone"
            required
            inputMode="tel"
            autoComplete="tel"
            className="focus-ring min-h-12 min-w-0 rounded-xl border border-gold/18 bg-charcoal px-4 text-base font-medium text-cream outline-none placeholder:text-smoke"
            placeholder="+7 900 000-00-00"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-cream">
        Комментарий
        <textarea
          name="comment"
          rows={4}
          className="focus-ring min-h-28 resize-y rounded-xl border border-gold/18 bg-charcoal px-4 py-3 text-base font-medium text-cream outline-none placeholder:text-smoke"
          placeholder={
            fulfillmentType === "cafe"
              ? "Пожелания по столу, блюдам или встрече..."
              : fulfillmentType === "delivery"
                ? "Время доставки, без лука, домофон, сдача..."
                : "К какому времени приготовить, пожелания к блюдам..."
          }
        />
      </label>

      <div className="grid gap-2 rounded-xl border border-gold/18 bg-coal px-4 py-3">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-smoke">Сумма заказа</span>
          <span className="font-bold text-cream">{formatPrice(totalPrice)} ₽</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-smoke">{fulfillmentLabel}</span>
          <span className="font-bold text-cream">
            {fulfillmentType === "cafe"
              ? "Без доставки"
              : deliveryCost === 0
                ? "Бесплатно"
                : `${formatPrice(deliveryCost)} ₽`}
          </span>
        </div>
        {fulfillmentType === "delivery" ? (
          <p className="border-b border-gold/12 pb-3 text-xs font-medium leading-relaxed text-smoke">
            При заказе до {formatPrice(FREE_DELIVERY_THRESHOLD)} ₽ доставка стоит{" "}
            {formatPrice(DELIVERY_COST)} ₽, от{" "}
            {formatPrice(FREE_DELIVERY_THRESHOLD)} ₽ — бесплатно.
          </p>
        ) : (
          <div className="border-b border-gold/12 pb-1" aria-hidden />
        )}
        <div className="flex items-center justify-between gap-4 pt-1">
          <span className="text-sm font-bold text-smoke">Итого к оплате</span>
          <strong className="text-xl font-extrabold text-ember">
            {formatPrice(grandTotal)} ₽
          </strong>
        </div>
      </div>

      <Button
        type="submit"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        className="min-h-12 rounded-xl border border-ember/35 bg-ember px-5 text-base font-extrabold text-white hover:bg-flame"
      >
        <Send className="h-5 w-5" aria-hidden />
        {status === "sending" ? "Отправляем" : "Подтвердить заказ"}
      </Button>

      {message ? (
        <p
          className={
            status === "error"
              ? "text-sm font-medium leading-relaxed text-red-300"
              : "text-sm font-medium leading-relaxed text-gold-soft"
          }
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
