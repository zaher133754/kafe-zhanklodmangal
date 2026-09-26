"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { PERSONAL_DATA_CONSENT_VERSION } from "@/lib/personal-data";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function BanquetRequestDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    function openFromTrigger(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest<HTMLElement>(
        "[data-banquet-request-trigger]"
      );
      const dialog = dialogRef.current;
      if (!trigger || !dialog || dialog.open) return;

      triggerRef.current = trigger;
      setSubmitState("idle");
      setMessage("");
      dialog.showModal();
      document.body.classList.add("modal-open");
      requestAnimationFrame(() => nameRef.current?.focus());
    }

    document.addEventListener("click", openFromTrigger);
    return () => {
      document.removeEventListener("click", openFromTrigger);
      document.body.classList.remove("modal-open");
    };
  }, []);

  function closeDialog() {
    dialogRef.current?.close();
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const phone = String(formData.get("phone") ?? "");

    if (phone.replace(/\D/g, "").length < 10) {
      setSubmitState("error");
      setMessage("Укажите корректный телефон.");
      return;
    }

    setSubmitState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/banquet-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone,
          comment: formData.get("comment"),
          personalDataConsent: {
            accepted: formData.get("personalDataConsent") === "on",
            version: PERSONAL_DATA_CONSENT_VERSION
          }
        })
      });
      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Не удалось отправить заявку.");
      }

      formRef.current?.reset();
      setSubmitState("success");
      setMessage("Спасибо! Мы скоро вам позвоним.");
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Не удалось отправить заявку. Попробуйте ещё раз."
      );
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="m-auto max-h-[calc(100dvh-32px)] w-[min(calc(100%-32px),620px)] overflow-y-auto rounded-2xl border border-gold/25 bg-coal p-0 text-cream shadow-[0_28px_90px_rgba(0,0,0,0.62)] backdrop:bg-charcoal/85"
      aria-labelledby="banquet-request-title"
      onClose={() => {
        document.body.classList.remove("modal-open");
        triggerRef.current?.focus();
      }}
      onCancel={() => {
        document.body.classList.remove("modal-open");
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <div className="relative p-6 sm:p-9">
        <button
          type="button"
          className="focus-ring absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 text-cream/75 transition-colors hover:border-ember hover:bg-ember hover:text-white sm:right-6 sm:top-6"
          aria-label="Закрыть форму"
          onClick={closeDialog}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="pr-12">
          <h2
            id="banquet-request-title"
            className="text-balance text-[clamp(1.7rem,5vw,2.3rem)] font-extrabold leading-tight text-cream"
          >
            Оставить заявку на банкет
          </h2>
          <p className="mt-3 max-w-[46ch] leading-relaxed text-cream/68">
            Расскажите немного о мероприятии. Мы перезвоним и обсудим детали.
          </p>
        </div>

        <form ref={formRef} className="mt-7 grid gap-5" onSubmit={submitRequest}>
          <label className="grid gap-2 font-bold text-cream" htmlFor="banquet-name">
            Имя
            <input
              ref={nameRef}
              id="banquet-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={80}
              required
              className="focus-ring h-12 rounded-xl border border-cream/25 bg-charcoal px-4 font-normal text-cream outline-none placeholder:text-cream/48"
            />
          </label>

          <label className="grid gap-2 font-bold text-cream" htmlFor="banquet-phone">
            Телефон
            <input
              id="banquet-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={40}
              required
              placeholder="+7 (___) ___-__-__"
              className="focus-ring h-12 rounded-xl border border-cream/25 bg-charcoal px-4 font-normal text-cream outline-none placeholder:text-cream/48"
            />
          </label>

          <label
            className="grid gap-2 font-bold text-cream"
            htmlFor="banquet-comment"
          >
            Комментарий
            <textarea
              id="banquet-comment"
              name="comment"
              rows={4}
              maxLength={1_000}
              className="focus-ring resize-y rounded-xl border border-cream/25 bg-charcoal px-4 py-3 font-normal text-cream outline-none placeholder:text-cream/48"
            />
          </label>

          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-cream/78">
            <input
              name="personalDataConsent"
              type="checkbox"
              required
              className="focus-ring mt-1 h-5 w-5 shrink-0 accent-ember"
            />
            <span>
              Даю согласие на обработку персональных данных в соответствии с{" "}
              <Link
                href="/consent"
                className="font-bold text-gold-soft underline decoration-gold/55 underline-offset-4 hover:text-flame"
              >
                согласием
              </Link>{" "}
              и{" "}
              <Link
                href="/policy"
                className="font-bold text-gold-soft underline decoration-gold/55 underline-offset-4 hover:text-flame"
              >
                политикой
              </Link>
              .
            </span>
          </label>

          {message ? (
            <p
              className={
                submitState === "success"
                  ? "rounded-xl bg-gold/12 px-4 py-3 font-bold text-gold-soft"
                  : "rounded-xl bg-wine/35 px-4 py-3 font-bold text-cream"
              }
              role="status"
            >
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            className="cta-pill focus-ring mt-1 w-full"
            disabled={submitState === "submitting"}
          >
            {submitState === "submitting" ? "Отправляем..." : "Отправить заявку"}
          </button>
        </form>
      </div>
    </dialog>
  );
}
