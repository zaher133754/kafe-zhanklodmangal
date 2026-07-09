"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";

type CheckoutFormProps = {
  onSubmitted: (orderNumber: string) => void;
};

type PickupType = "delivery" | "pickup";

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function isPhoneLike(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10;
}

export function CheckoutForm({ onSubmitted }: CheckoutFormProps) {
  const { clearCart, lines, totalPrice } = useCart();
  const [pickupType, setPickupType] = useState<PickupType>("delivery");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

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
    const comment = String(formData.get("comment") ?? "").trim();

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

    if (pickupType === "delivery" && !address) {
      setStatus("error");
      setMessage("Укажите адрес доставки.");
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
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          deliveryType: pickupType,
          address: pickupType === "delivery" ? address : "",
          comment,
          items: orderItems,
          total: totalPrice
        })
      });
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
      onSubmitted(result.orderNumber);
      form.reset();
      setPickupType("delivery");
    } catch {
      setStatus("error");
      setMessage(
        "Не удалось отправить заказ. Попробуйте ещё раз или позвоните нам."
      );
    }
  }

  return (
    <form className="grid gap-4" noValidate onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-bold text-cream">
        Имя
        <input
          name="customerName"
          required
          autoComplete="name"
          className="focus-ring min-h-12 rounded-xl border border-gold/18 bg-charcoal px-4 text-base font-medium text-cream outline-none placeholder:text-smoke"
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
          className="focus-ring min-h-12 rounded-xl border border-gold/18 bg-charcoal px-4 text-base font-medium text-cream outline-none placeholder:text-smoke"
          placeholder="+7 900 000-00-00"
        />
      </label>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-bold text-cream">Тип получения</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="focus-within:ring-ring/50 flex min-h-12 items-center gap-3 rounded-xl border border-gold/18 bg-charcoal px-4 text-sm font-bold text-cream focus-within:ring-3">
            <input
              type="radio"
              name="deliveryType"
              value="delivery"
              checked={pickupType === "delivery"}
              onChange={() => setPickupType("delivery")}
              className="h-4 w-4 accent-ember"
            />
            Доставка
          </label>
          <label className="focus-within:ring-ring/50 flex min-h-12 items-center gap-3 rounded-xl border border-gold/18 bg-charcoal px-4 text-sm font-bold text-cream focus-within:ring-3">
            <input
              type="radio"
              name="deliveryType"
              value="pickup"
              checked={pickupType === "pickup"}
              onChange={() => setPickupType("pickup")}
              className="h-4 w-4 accent-ember"
            />
            Самовывоз
          </label>
        </div>
      </fieldset>

      {pickupType === "delivery" ? (
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

      <label className="grid gap-2 text-sm font-bold text-cream">
        Комментарий
        <textarea
          name="comment"
          rows={4}
          className="focus-ring min-h-28 resize-y rounded-xl border border-gold/18 bg-charcoal px-4 py-3 text-base font-medium text-cream outline-none placeholder:text-smoke"
          placeholder="Время доставки, без лука, домофон, сдача..."
        />
      </label>

      <div className="rounded-xl border border-gold/18 bg-coal px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-bold text-smoke">Итого к заказу</span>
          <strong className="text-xl font-extrabold text-ember">
            {formatPrice(totalPrice)} ₽
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
