"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent
} from "react";
import {
  Check,
  LoaderCircle,
  MapPinOff,
  Send,
  TicketPercent
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import {
  PERSONAL_DATA_CONSENT_INPUT_ID,
  PersonalDataConsentField
} from "@/components/legal/PersonalDataConsentField";
import { Button } from "@/components/ui/button";
import {
  CAFE_CLOSE_TIME,
  CAFE_OPEN_TIME,
  getEarliestCafeVisitTime,
  getTodayInSamara,
  hasCafePreparationTime,
  isCafeVisitTime,
  MIN_CAFE_PREPARATION_MINUTES
} from "@/lib/cafe-visit";
import {
  FAR_DELIVERY_COST,
  FAR_FREE_DELIVERY_THRESHOLD,
  getDeliveryPricing,
  MAX_DELIVERY_DISTANCE_METERS,
  NEAR_DELIVERY_COST,
  NEAR_DELIVERY_MAX_DISTANCE_METERS,
  NEAR_FREE_DELIVERY_THRESHOLD,
  type DeliveryZone
} from "@/lib/delivery";
import {
  calculatePromoDiscount,
  FLYER_PROMO_CODE,
  FLYER_PROMO_DISCOUNT_PERCENT,
  isPromoCodeValid,
  normalizePromoCode
} from "@/lib/promo-code";
import {
  PERSONAL_DATA_CONSENT_REQUIRED_MESSAGE,
  PERSONAL_DATA_CONSENT_VERSION
} from "@/lib/personal-data";
import { trackOrderSuccess } from "@/lib/yandex-metrika";

export type FulfillmentType = "delivery" | "pickup" | "cafe";

export type SubmittedOrder = {
  orderNumber: string;
  deliveryType: FulfillmentType;
  visitTime?: string;
};

type CheckoutFormProps = {
  onSubmitted: (order: SubmittedOrder) => void;
};

type AddressSuggestion = {
  id: string;
  title: string;
  subtitle: string;
  address: string;
};

type DeliveryQuote = {
  token: string;
  address: string;
  distanceMeters: number;
  zone: DeliveryZone;
  issuedAt: number;
  expiresAt: number;
};

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

function formatDistance(distanceMeters: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 1
  }).format(distanceMeters / 1_000);
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
  const [earliestCafeVisitTime, setEarliestCafeVisitTime] = useState(
    getEarliestCafeVisitTime
  );
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [personalDataConsentAccepted, setPersonalDataConsentAccepted] =
    useState(false);
  const [personalDataConsentError, setPersonalDataConsentError] =
    useState("");
  const [promoStatus, setPromoStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [addressInput, setAddressInput] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [suggestionStatus, setSuggestionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState("");
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(
    null
  );
  const [deliveryQuoteStatus, setDeliveryQuoteStatus] = useState<
    "idle" | "loading" | "success" | "outside" | "error"
  >("idle");
  const [deliveryQuoteMessage, setDeliveryQuoteMessage] = useState("");
  const quoteRequestSequence = useRef(0);
  const discountAmount = calculatePromoDiscount(totalPrice, appliedPromoCode);
  const discountedTotal = totalPrice - discountAmount;
  const deliveryPricing = deliveryQuote
    ? getDeliveryPricing(totalPrice, deliveryQuote.distanceMeters)
    : null;
  const deliveryCost =
    fulfillmentType === "delivery" ? (deliveryPricing?.cost ?? null) : 0;
  const grandTotal = discountedTotal + (deliveryCost ?? 0);
  const fulfillmentLabel =
    fulfillmentType === "delivery"
      ? "Доставка"
      : fulfillmentType === "pickup"
        ? "Самовывоз"
        : "В кафе ко времени";

  const orderItems = useMemo(
    () =>
      lines.map((line) => ({
        id: line.id,
        quantity: line.quantity
      })),
    [lines]
  );

  useEffect(() => {
    const query = addressInput.trim();

    if (
      fulfillmentType !== "delivery" ||
      query.length < 3 ||
      selectedSuggestionId
    ) {
      if (query.length < 3) {
        setAddressSuggestions([]);
        setSuggestionStatus("idle");
        setSuggestionsOpen(false);
      }
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setSuggestionStatus("loading");
      setSuggestionsOpen(true);

      try {
        const response = await fetch(
          `/api/delivery/suggest?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const result = (await response.json()) as {
          success?: boolean;
          suggestions?: AddressSuggestion[];
          error?: string;
        };

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Не удалось найти адрес.");
        }

        setAddressSuggestions(result.suggestions ?? []);
        setSuggestionStatus("success");
        setActiveSuggestionIndex(-1);
      } catch (error) {
        if (controller.signal.aborted) return;
        setAddressSuggestions([]);
        setSuggestionStatus("error");
        setDeliveryQuoteMessage(
          error instanceof Error
            ? error.message
            : "Не удалось найти адрес. Попробуйте ещё раз."
        );
      }
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [addressInput, fulfillmentType, selectedSuggestionId]);

  function resetDeliveryAddress(nextAddress = "") {
    quoteRequestSequence.current += 1;
    setAddressInput(nextAddress);
    setSelectedSuggestionId("");
    setDeliveryQuote(null);
    setDeliveryQuoteStatus("idle");
    setDeliveryQuoteMessage("");
    setAddressSuggestions([]);
    setActiveSuggestionIndex(-1);
    setSuggestionsOpen(nextAddress.trim().length >= 3);
  }

  async function handleSuggestionSelect(suggestion: AddressSuggestion) {
    const requestSequence = quoteRequestSequence.current + 1;
    quoteRequestSequence.current = requestSequence;
    setAddressInput(suggestion.address);
    setSelectedSuggestionId(suggestion.id);
    setAddressSuggestions([]);
    setSuggestionsOpen(false);
    setActiveSuggestionIndex(-1);
    setDeliveryQuote(null);
    setDeliveryQuoteStatus("loading");
    setDeliveryQuoteMessage("");
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/delivery/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uri: suggestion.id })
      });
      const result = (await response.json()) as {
        success?: boolean;
        code?: string;
        error?: string;
        address?: string;
        distanceMeters?: number;
        quote?: DeliveryQuote;
      };

      if (requestSequence !== quoteRequestSequence.current) return;

      if (result.code === "OUTSIDE_ZONE") {
        setDeliveryQuoteStatus("outside");
        setDeliveryQuoteMessage(
          typeof result.distanceMeters === "number"
            ? `До адреса ${formatDistance(result.distanceMeters)} км — это дальше нашей зоны 20 км.`
            : "Адрес находится за пределами зоны доставки 20 км."
        );
        return;
      }

      if (
        !response.ok ||
        !result.success ||
        !result.quote ||
        !result.quote.token ||
        typeof result.quote.distanceMeters !== "number"
      ) {
        throw new Error(result.error || "Не удалось рассчитать доставку.");
      }

      setAddressInput(result.quote.address);
      setDeliveryQuote(result.quote);
      setDeliveryQuoteStatus("success");
    } catch (error) {
      if (requestSequence !== quoteRequestSequence.current) return;
      setDeliveryQuoteStatus("error");
      setDeliveryQuoteMessage(
        error instanceof Error
          ? error.message
          : "Не удалось рассчитать доставку. Попробуйте ещё раз."
      );
    }
  }

  function handleAddressKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!suggestionsOpen || addressSuggestions.length === 0) {
      if (event.key === "ArrowDown" && addressSuggestions.length > 0) {
        event.preventDefault();
        setSuggestionsOpen(true);
        setActiveSuggestionIndex(0);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestionIndex((current) =>
        current >= addressSuggestions.length - 1 ? 0 : current + 1
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((current) =>
        current <= 0 ? addressSuggestions.length - 1 : current - 1
      );
    } else if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      void handleSuggestionSelect(addressSuggestions[activeSuggestionIndex]);
    } else if (event.key === "Escape") {
      setSuggestionsOpen(false);
      setActiveSuggestionIndex(-1);
    }
  }

  function handleApplyPromo() {
    const normalizedPromoCode = normalizePromoCode(promoInput);

    if (!isPromoCodeValid(normalizedPromoCode)) {
      setAppliedPromoCode("");
      setPromoStatus("error");
      return;
    }

    setPromoInput(normalizedPromoCode);
    setAppliedPromoCode(normalizedPromoCode);
    setPromoStatus("success");
    setStatus("idle");
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const customerName = String(formData.get("customerName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const deliveryDetails = String(
      formData.get("deliveryDetails") ?? ""
    ).trim();
    const visitDate = getTodayInSamara();
    const visitTime = String(formData.get("visitTime") ?? "").trim();
    const guestCount = Number(formData.get("guestCount"));
    const comment = String(formData.get("comment") ?? "").trim();
    const currentEarliestCafeVisitTime = getEarliestCafeVisitTime();

    if (fulfillmentType === "cafe") {
      setEarliestCafeVisitTime(currentEarliestCafeVisitTime);
    }

    if (!personalDataConsentAccepted) {
      setPersonalDataConsentError(PERSONAL_DATA_CONSENT_REQUIRED_MESSAGE);
      setStatus("error");
      setMessage("");
      window.requestAnimationFrame(() => {
        document.getElementById(PERSONAL_DATA_CONSENT_INPUT_ID)?.focus();
      });
      return;
    }

    setPersonalDataConsentError("");

    if (promoInput.trim() && !appliedPromoCode) {
      setStatus("error");
      setMessage("Примените промокод или очистите поле перед оформлением заказа.");
      return;
    }

    if (
      fulfillmentType === "delivery" &&
      (deliveryQuoteStatus !== "success" || !deliveryQuote)
    ) {
      setStatus("error");
      setMessage("Выберите дом из подсказок, чтобы рассчитать доставку.");
      return;
    }

    if (fulfillmentType === "cafe" && !visitTime) {
      setStatus("error");
      setMessage(
        currentEarliestCafeVisitTime
          ? "Укажите время визита в кафе."
          : `Сегодня уже нет доступного времени: на приготовление нужно минимум ${MIN_CAFE_PREPARATION_MINUTES} минут.`
      );
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
      !hasCafePreparationTime(visitDate, visitTime)
    ) {
      setStatus("error");
      setMessage(
        `Выберите время минимум через ${MIN_CAFE_PREPARATION_MINUTES} минут после оформления заказа.`
      );
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
          address:
            fulfillmentType === "delivery" ? deliveryQuote?.address : "",
          deliveryDetails:
            fulfillmentType === "delivery" ? deliveryDetails : "",
          deliveryQuoteToken:
            fulfillmentType === "delivery" ? deliveryQuote?.token : "",
          visitDate: fulfillmentType === "cafe" ? visitDate : "",
          visitTime: fulfillmentType === "cafe" ? visitTime : "",
          guestCount: fulfillmentType === "cafe" ? guestCount : 0,
          comment,
          promoCode: appliedPromoCode,
          personalDataConsent: {
            accepted: personalDataConsentAccepted,
            version: PERSONAL_DATA_CONSENT_VERSION
          },
          items: orderItems
        })
      );
      const result = (await response.json()) as {
        success?: boolean;
        orderNumber?: string;
        grandTotal?: number;
        discountAmount?: number;
        promoCode?: string | null;
        visitTime?: string | null;
        error?: string;
      };
      const serverGrandTotal = result.grandTotal;

      if (
        !response.ok ||
        !result.success ||
        !result.orderNumber ||
        !/^\d{4}$/.test(result.orderNumber) ||
        typeof serverGrandTotal !== "number" ||
        !Number.isFinite(serverGrandTotal)
      ) {
        throw new Error(result.error || "Не удалось отправить заказ.");
      }

      trackOrderSuccess({
        orderId: `web-${result.orderNumber}-${Date.now()}`,
        revenue: serverGrandTotal,
        fulfillmentType,
        promoCode: result.promoCode ?? undefined,
        discountAmount: result.discountAmount,
        products: lines.map((line) => ({
          id: line.id,
          name: line.name,
          price: line.price,
          quantity: line.quantity,
          category: line.category
        }))
      });
      clearCart();
      setStatus("sent");
      setMessage(
        fulfillmentType === "delivery"
          ? "Заказ отправлен! Мы скоро свяжемся с вами для подтверждения."
          : fulfillmentType === "pickup"
            ? "Заказ принят! Готовность — примерно через 15–20 минут."
            : `Заказ принят! Ожидаем вас сегодня к ${result.visitTime ?? visitTime}.`
      );
      onSubmitted({
        orderNumber: result.orderNumber,
        deliveryType: fulfillmentType,
        visitTime:
          fulfillmentType === "cafe"
            ? (result.visitTime ?? visitTime)
            : undefined
      });
      form.reset();
      setFulfillmentType("delivery");
      setPromoInput("");
      setAppliedPromoCode("");
      setPromoStatus("idle");
      setPersonalDataConsentAccepted(false);
      setPersonalDataConsentError("");
      resetDeliveryAddress();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Не удалось отправить заказ. Попробуйте ещё раз или позвоните нам."
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
                setEarliestCafeVisitTime(getEarliestCafeVisitTime());
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
        <div className="grid gap-3">
          <div className="grid gap-2 text-sm font-bold text-cream">
            <label htmlFor="delivery-address">Адрес доставки</label>
            <div
              className="relative"
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(event.relatedTarget as Node)
                ) {
                  setSuggestionsOpen(false);
                  setActiveSuggestionIndex(-1);
                }
              }}
            >
              <input
                id="delivery-address"
                name="address"
                value={addressInput}
                required
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={suggestionsOpen}
                aria-controls="delivery-address-suggestions"
                aria-activedescendant={
                  activeSuggestionIndex >= 0
                    ? `delivery-address-option-${activeSuggestionIndex}`
                    : undefined
                }
                aria-busy={suggestionStatus === "loading"}
                autoComplete="off"
                enterKeyHint="search"
                onChange={(event) => {
                  resetDeliveryAddress(event.currentTarget.value);
                  setStatus("idle");
                  setMessage("");
                }}
                onFocus={() => {
                  if (
                    addressInput.trim().length >= 3 &&
                    !selectedSuggestionId
                  ) {
                    setSuggestionsOpen(true);
                  }
                }}
                onKeyDown={handleAddressKeyDown}
                className="focus-ring min-h-12 w-full rounded-xl border border-gold/18 bg-charcoal px-4 pr-11 text-base font-medium text-cream outline-none placeholder:text-smoke"
                placeholder="Начните вводить улицу и дом"
              />
              {suggestionStatus === "loading" ? (
                <LoaderCircle
                  className="pointer-events-none absolute top-3.5 right-4 h-5 w-5 animate-spin text-gold-soft"
                  aria-hidden
                />
              ) : null}

              {suggestionsOpen && addressInput.trim().length >= 3 ? (
                <div
                  id="delivery-address-suggestions"
                  className="absolute top-full right-0 left-0 z-40 mt-2 max-h-72 overflow-y-auto rounded-xl border border-gold/25 bg-coal p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.48)]"
                  role="listbox"
                  aria-label="Подсказки адреса"
                >
                  {suggestionStatus === "loading" ? (
                    <p className="px-3 py-3 text-sm font-medium text-smoke">
                      Ищем дома рядом с кафе…
                    </p>
                  ) : null}
                  {suggestionStatus === "success" &&
                  addressSuggestions.length === 0 ? (
                    <p className="px-3 py-3 text-sm font-medium leading-relaxed text-smoke">
                      Дом не найден. Проверьте улицу и номер дома.
                    </p>
                  ) : null}
                  {addressSuggestions.map((suggestion, index) => (
                    <button
                      id={`delivery-address-option-${index}`}
                      key={suggestion.id}
                      type="button"
                      role="option"
                      aria-selected={activeSuggestionIndex === index}
                      onFocus={() => setActiveSuggestionIndex(index)}
                      onPointerMove={() => setActiveSuggestionIndex(index)}
                      onClick={() => void handleSuggestionSelect(suggestion)}
                      className="focus-ring grid min-h-14 w-full gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gold/10 focus:bg-gold/10 aria-selected:bg-gold/10"
                    >
                      <span className="text-sm font-bold text-cream">
                        {suggestion.title}
                      </span>
                      {suggestion.subtitle ? (
                        <span className="text-xs font-medium text-smoke">
                          {suggestion.subtitle}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {deliveryQuoteStatus === "loading" ? (
            <div
              className="flex min-h-12 items-center gap-3 rounded-xl border border-gold/18 bg-coal px-4 py-3 text-sm font-medium text-smoke"
              role="status"
            >
              <LoaderCircle
                className="h-5 w-5 shrink-0 animate-spin text-gold-soft"
                aria-hidden
              />
              Определяем расстояние от кафе…
            </div>
          ) : null}

          {deliveryQuoteStatus === "outside" ||
          deliveryQuoteStatus === "error" ||
          suggestionStatus === "error" ? (
            <div
              className="flex items-start gap-3 rounded-xl border border-red-400/28 bg-red-400/8 px-4 py-3 text-sm font-medium leading-relaxed text-red-200"
              role="alert"
            >
              <MapPinOff className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              {deliveryQuoteMessage ||
                "Не удалось проверить адрес. Попробуйте ещё раз."}
            </div>
          ) : null}

          {deliveryQuoteStatus === "success" ? (
            <label className="grid gap-2 text-sm font-bold text-cream">
              Квартира, подъезд, этаж
              <input
                name="deliveryDetails"
                autoComplete="address-line2"
                className="focus-ring min-h-12 rounded-xl border border-gold/18 bg-charcoal px-4 text-base font-medium text-cream outline-none placeholder:text-smoke"
                placeholder="Например, кв. 24, подъезд 2"
              />
            </label>
          ) : null}

        </div>
      ) : null}

      {fulfillmentType === "cafe" ? (
        <fieldset className="grid gap-3 rounded-xl bg-coal px-4 py-4">
          <legend className="px-1 text-sm font-bold text-cream">
            Визит в кафе
          </legend>
          <p className="text-xs font-medium leading-relaxed text-smoke">
            Заказ можно оформить только на сегодня, с {CAFE_OPEN_TIME} до{" "}
            {CAFE_CLOSE_TIME}. На приготовление нужно минимум{" "}
            {MIN_CAFE_PREPARATION_MINUTES} минут. После оформления заказ сразу
            поступит на кухню — будем ждать вас к выбранному времени.
          </p>
          {!earliestCafeVisitTime ? (
            <p
              className="text-xs font-medium leading-relaxed text-red-300"
              role="status"
            >
              Сегодня уже нет доступного времени для заказа в кафе.
            </p>
          ) : null}
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
                min={earliestCafeVisitTime ?? CAFE_OPEN_TIME}
                max={CAFE_CLOSE_TIME}
                required
                disabled={!earliestCafeVisitTime}
                onFocus={() =>
                  setEarliestCafeVisitTime(getEarliestCafeVisitTime())
                }
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

      <div className="grid gap-2">
        <label
          htmlFor="promo-code"
          className="flex items-center gap-2 text-sm font-bold text-cream"
        >
          <TicketPercent className="h-4 w-4 text-gold-soft" aria-hidden />
          Промокод
        </label>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <input
            id="promo-code"
            value={promoInput}
            onChange={(event) => {
              const nextValue = event.currentTarget.value;
              setPromoInput(nextValue);

              if (
                appliedPromoCode &&
                normalizePromoCode(nextValue) !== appliedPromoCode
              ) {
                setAppliedPromoCode("");
                setPromoStatus("idle");
                return;
              }

              setPromoStatus(appliedPromoCode ? "success" : "idle");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleApplyPromo();
              }
            }}
            onBlur={() => {
              if (promoInput.trim() && !appliedPromoCode) {
                setPromoStatus(
                  isPromoCodeValid(promoInput) ? "idle" : "error"
                );
              }
            }}
            aria-invalid={promoStatus === "error"}
            aria-describedby={
              promoStatus === "idle" ? undefined : "promo-code-message"
            }
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={40}
            className="focus-ring min-h-12 min-w-0 rounded-xl border border-gold/18 bg-charcoal px-4 text-base font-bold uppercase text-cream outline-none placeholder:normal-case placeholder:font-medium placeholder:text-smoke aria-invalid:border-red-400/70"
            placeholder="Введите промокод"
          />
          <Button
            type="button"
            onClick={handleApplyPromo}
            disabled={!promoInput.trim() || status === "sending"}
            className={
              promoStatus === "success"
                ? "min-h-12 rounded-xl border border-gold/35 bg-gold/12 px-4 font-extrabold text-gold-soft hover:bg-gold/18"
                : "min-h-12 rounded-xl border border-gold/22 bg-charcoal px-4 font-extrabold text-cream hover:border-gold/40 hover:bg-coal"
            }
          >
            {promoStatus === "success" ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : null}
            {promoStatus === "success" ? "Применён" : "Применить"}
          </Button>
        </div>
        {promoStatus !== "idle" ? (
          <p
            id="promo-code-message"
            className={
              promoStatus === "success"
                ? "text-xs font-bold leading-relaxed text-gold-soft"
                : "text-xs font-medium leading-relaxed text-red-300"
            }
            role={promoStatus === "error" ? "alert" : "status"}
          >
            {promoStatus === "success"
              ? `Промокод ${FLYER_PROMO_CODE} применён — скидка ${FLYER_PROMO_DISCOUNT_PERCENT}%.`
              : "Промокод не найден. Проверьте написание и попробуйте снова."}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2 rounded-xl border border-gold/18 bg-coal px-4 py-3">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-smoke">Сумма блюд</span>
          <span className="font-bold text-cream">{formatPrice(totalPrice)} ₽</span>
        </div>
        {discountAmount > 0 ? (
          <>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-bold text-gold-soft">
                Промокод {appliedPromoCode} · {FLYER_PROMO_DISCOUNT_PERCENT}%
              </span>
              <span className="font-extrabold text-gold-soft">
                −{formatPrice(discountAmount)} ₽
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-smoke">После скидки</span>
              <span className="font-bold text-cream">
                {formatPrice(discountedTotal)} ₽
              </span>
            </div>
          </>
        ) : null}
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-smoke">{fulfillmentLabel}</span>
          <span className="font-bold text-cream">
            {fulfillmentType !== "delivery"
              ? "Без доставки"
              : deliveryQuoteStatus === "loading"
                ? "Считаем…"
                : deliveryCost === null
                  ? "После выбора адреса"
                  : deliveryCost === 0
                ? "Бесплатно"
                : `${formatPrice(deliveryCost)} ₽`}
          </span>
        </div>
        {fulfillmentType === "delivery" ? (
          <p className="border-b border-gold/12 pb-3 text-xs font-medium leading-relaxed text-smoke">
            До {formatDistance(NEAR_DELIVERY_MAX_DISTANCE_METERS)} км —{" "}
            {formatPrice(NEAR_DELIVERY_COST)} ₽ или бесплатно от{" "}
            {formatPrice(NEAR_FREE_DELIVERY_THRESHOLD)} ₽. От{" "}
            {formatDistance(NEAR_DELIVERY_MAX_DISTANCE_METERS)} до{" "}
            {formatDistance(MAX_DELIVERY_DISTANCE_METERS)} км —{" "}
            {formatPrice(FAR_DELIVERY_COST)} ₽ или бесплатно от{" "}
            {formatPrice(FAR_FREE_DELIVERY_THRESHOLD)} ₽.
          </p>
        ) : (
          <div className="border-b border-gold/12 pb-1" aria-hidden />
        )}
        <div className="flex items-center justify-between gap-4 pt-1">
          <span className="text-sm font-bold text-smoke">Итого к оплате</span>
          <strong className="text-xl font-extrabold text-ember">
            {fulfillmentType === "delivery" && deliveryCost === null
              ? "—"
              : `${formatPrice(grandTotal)} ₽`}
          </strong>
        </div>
      </div>

      <PersonalDataConsentField
        checked={personalDataConsentAccepted}
        error={personalDataConsentError}
        onChange={(accepted) => {
          setPersonalDataConsentAccepted(accepted);
          if (accepted) {
            setPersonalDataConsentError("");
            setStatus("idle");
            setMessage("");
          }
        }}
      />

      <Button
        type="submit"
        disabled={
          status === "sending" ||
          (fulfillmentType === "delivery" &&
            deliveryQuoteStatus !== "success")
        }
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
