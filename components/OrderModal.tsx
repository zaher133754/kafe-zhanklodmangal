"use client";

import { Send, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type SubmitState = "idle" | "sending" | "sent" | "error";

export function OrderModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [selectedDish, setSelectedDish] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function open(dish = "") {
      setSelectedDish(dish);
      setSubmitState("idle");
      setMessage("");
      setIsOpen(true);
    }

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>("[data-order-open]");

      if (trigger) {
        event.preventDefault();
        open(trigger.dataset.orderItem ?? "");
      }
    }

    function onOpenOrder(event: Event) {
      const detail = (event as CustomEvent<{ dish?: string }>).detail;
      open(detail?.dish ?? "");
    }

    window.addEventListener("open-order", onOpenOrder);
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("open-order", onOpenOrder);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitState("sending");
    setMessage("");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      type: String(formData.get("type") ?? "Доставка"),
      message: String(formData.get("message") ?? "")
    };

    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = (await response.json()) as {
      ok?: boolean;
      delivered?: boolean;
      error?: string;
    };

    if (!response.ok || !result.ok) {
      setSubmitState("error");
      setMessage(result.error ?? "Не удалось отправить заявку.");
      return;
    }

    setSubmitState("sent");
    setMessage(
      result.delivered
        ? "Заявка отправлена. Мы свяжемся с вами."
        : "Заявка принята. Канал отправки подключается через переменные окружения."
    );
    form.reset();
  }

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-black/80 p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-[560px] rounded-lg border border-white/10 bg-[#120b07] p-6 shadow-2xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
      >
        <button
          type="button"
          className="focus-ring absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"
          aria-label="Закрыть"
          onClick={() => setIsOpen(false)}
        >
          <X size={22} aria-hidden />
        </button>

        <h2 id="order-title" className="pr-12 text-3xl font-extrabold text-ember">
          {selectedDish ? "Заказать блюдо" : "Сделать заказ"}
        </h2>
        {selectedDish ? (
          <p className="mt-3 pr-12 text-base leading-relaxed text-white/75">
            Выбрано: <span className="font-bold text-gold-soft">{selectedDish}</span>
          </p>
        ) : null}
        <form className="mt-7 grid gap-4" onSubmit={onSubmit}>
          <label className="grid gap-2 text-sm font-bold text-white">
            Имя
            <input
              name="name"
              required
              autoComplete="name"
              className="focus-ring rounded-md border border-white/15 bg-black/35 px-4 py-3 font-normal text-white outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-white">
            Телефон
            <input
              name="phone"
              required
              inputMode="tel"
              autoComplete="tel"
              className="focus-ring rounded-md border border-white/15 bg-black/35 px-4 py-3 font-normal text-white outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-white">
            Тип заявки
            <select
              name="type"
              className="focus-ring rounded-md border border-white/15 bg-black/35 px-4 py-3 font-normal text-white outline-none"
              defaultValue="Доставка"
            >
              <option>Доставка</option>
              <option>Банкет</option>
              <option>Вопрос по меню</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-white">
            Комментарий
            <textarea
              name="message"
              rows={4}
              defaultValue={selectedDish ? `Хочу заказать: ${selectedDish}` : ""}
              className="focus-ring resize-y rounded-md border border-white/15 bg-black/35 px-4 py-3 font-normal text-white outline-none"
            />
          </label>
          <button
            type="submit"
            className="cta-pill focus-ring mt-2 gap-2"
            disabled={submitState === "sending"}
          >
            <Send size={18} aria-hidden />
            {submitState === "sending" ? "Отправляем" : "Отправить"}
          </button>
          {message ? (
            <p
              className={`text-sm ${
                submitState === "error" ? "text-red-300" : "text-white/80"
              }`}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </div>,
    document.body
  );
}
