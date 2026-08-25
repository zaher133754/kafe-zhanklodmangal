import "server-only";
import nodemailer from "nodemailer";
import { menuItems } from "@/data/menu";
import {
  CAFE_CLOSE_TIME,
  CAFE_OPEN_TIME,
  getTodayInSamara,
  hasCafePreparationTime,
  isCafeVisitTime,
  MIN_CAFE_PREPARATION_MINUTES
} from "@/lib/cafe-visit";
import {
  getDeliveryPricing,
  type DeliveryZone
} from "@/lib/delivery";
import { verifyDeliveryQuoteToken } from "@/lib/delivery-quote";
import { DELIVERY_DISTANCE_COEFFICIENT } from "@/lib/geo-distance";
import {
  calculatePromoDiscount,
  FLYER_PROMO_DISCOUNT_PERCENT,
  isPromoCodeValid,
  normalizePromoCode
} from "@/lib/promo-code";
import {
  PERSONAL_DATA_CONSENT_REQUIRED_MESSAGE,
  PERSONAL_DATA_CONSENT_VERSION
} from "@/lib/personal-data";
import { deliverOrderToTelegram } from "@/lib/telegram-notifications";

export type OrderItem = {
  id: string;
  quantity: number;
};

export type ValidatedOrderItem = OrderItem & {
  name: string;
  price: number;
  total: number;
};

export type FulfillmentType = "delivery" | "pickup" | "cafe";

export type CheckoutOrderPayload = {
  customerName: string;
  phone: string;
  deliveryType: FulfillmentType;
  address?: string;
  deliveryDetails?: string;
  deliveryQuoteToken?: string;
  visitDate?: string;
  visitTime?: string;
  guestCount?: number;
  comment?: string;
  promoCode?: string;
  personalDataConsent?: {
    accepted?: boolean;
    version?: string;
    acceptedAt?: string;
  };
  items: OrderItem[];
  total?: number;
};

export type ValidatedOrder = {
  customerName: string;
  phone: string;
  deliveryType: FulfillmentType;
  deliveryCost: number;
  address?: string;
  deliveryDetails?: string;
  deliveryDistanceMeters?: number;
  deliveryZone?: DeliveryZone;
  visitDate?: string;
  visitTime?: string;
  guestCount?: number;
  comment?: string;
  promoCode?: string;
  personalDataConsent: {
    accepted: true;
    version: typeof PERSONAL_DATA_CONSENT_VERSION;
    acceptedAt: string;
  };
  discountAmount: number;
  discountedTotal: number;
  items: ValidatedOrderItem[];
  total: number;
  grandTotal: number;
};

const menuItemById = new Map(
  menuItems.map((item) => [
    item.id,
    { id: item.id, name: item.name, price: item.price }
  ])
);

export type OrderDeliveryResult = {
  delivered: true;
  channels: Array<"email" | "telegram">;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function isPhoneLike(value: string) {
  return value.replace(/\D/g, "").length >= 10;
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().startsWith(value);
}

function money(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatDistance(distanceMeters: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 1
  }).format(distanceMeters / 1_000);
}

function formatOrderDateTime(date = new Date()) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Samara"
  }).format(date);
}

function formatVisitDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "long",
    timeZone: "Europe/Samara"
  }).format(new Date(`${value}T12:00:00+04:00`));
}

function fulfillmentLabel(type: FulfillmentType) {
  if (type === "delivery") return "Доставка";
  if (type === "pickup") return "Самовывоз";
  return "В кафе ко времени";
}

export function validateOrderPayload(body: unknown): ValidatedOrder {
  const source = body as Partial<CheckoutOrderPayload>;
  const customerName = clean(source.customerName, 80);
  const phone = clean(source.phone, 40);
  const rawDeliveryType = clean(source.deliveryType, 40) || "delivery";
  const deliveryDetails = clean(source.deliveryDetails, 160);
  const deliveryQuoteToken = clean(source.deliveryQuoteToken, 4_000);
  const visitDate = clean(source.visitDate, 10);
  const visitTime = clean(source.visitTime, 5);
  const guestCount = cleanNumber(source.guestCount);
  const comment = clean(source.comment, 800);
  const rawPromoCode = clean(source.promoCode, 40);
  const rawItems = Array.isArray(source.items) ? source.items : [];

  if (source.personalDataConsent?.accepted !== true) {
    throw new Error(PERSONAL_DATA_CONSENT_REQUIRED_MESSAGE);
  }

  const personalDataConsent = {
    accepted: true as const,
    version: PERSONAL_DATA_CONSENT_VERSION,
    acceptedAt: new Date().toISOString()
  };

  if (rawPromoCode && !isPromoCodeValid(rawPromoCode)) {
    throw new Error("Промокод не найден. Проверьте написание и попробуйте снова.");
  }

  const promoCode = rawPromoCode
    ? normalizePromoCode(rawPromoCode)
    : undefined;

  if (!(["delivery", "pickup", "cafe"] as const).includes(
    rawDeliveryType as FulfillmentType
  )) {
    throw new Error("Выберите корректный тип получения.");
  }

  const deliveryType = rawDeliveryType as FulfillmentType;

  if (!customerName) {
    throw new Error("Укажите имя.");
  }

  if (!isPhoneLike(phone)) {
    throw new Error("Укажите корректный телефон.");
  }

  let address = "";
  let deliveryDistanceMeters: number | undefined;
  let deliveryZone: DeliveryZone | undefined;

  if (deliveryType === "delivery") {
    if (!deliveryQuoteToken) {
      throw new Error("Выберите адрес доставки из подсказок.");
    }

    const deliveryQuote = verifyDeliveryQuoteToken(deliveryQuoteToken);
    address = deliveryQuote.address;
    deliveryDistanceMeters = deliveryQuote.distanceMeters;
    deliveryZone = deliveryQuote.zone;
  }

  if (deliveryType === "cafe") {
    if (!isIsoDate(visitDate)) {
      throw new Error("Укажите корректную дату визита в кафе.");
    }

    if (visitDate !== getTodayInSamara()) {
      throw new Error("Заказ в кафе ко времени можно оформить только на сегодня.");
    }

    if (!isCafeVisitTime(visitTime)) {
      throw new Error(
        `Выберите время с ${CAFE_OPEN_TIME} до ${CAFE_CLOSE_TIME}.`
      );
    }

    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 100) {
      throw new Error("Укажите количество гостей от 1 до 100.");
    }

    if (!hasCafePreparationTime(visitDate, visitTime)) {
      throw new Error(
        `Выберите время минимум через ${MIN_CAFE_PREPARATION_MINUTES} минут после оформления заказа.`
      );
    }
  }

  const quantitiesById = new Map<string, number>();

  for (const rawItem of rawItems) {
    const item = rawItem as Partial<OrderItem>;
    const id = clean(item.id, 120);
    const quantity = Math.round(cleanNumber(item.quantity));

    if (!id || quantity <= 0) continue;

    const catalogItem = menuItemById.get(id);

    if (!catalogItem) {
      throw new Error("Одно из блюд больше недоступно. Обновите корзину.");
    }

    const nextQuantity = (quantitiesById.get(id) ?? 0) + quantity;

    if (nextQuantity > 99) {
      throw new Error("Количество одного блюда не может быть больше 99.");
    }

    quantitiesById.set(id, nextQuantity);
  }

  const items = Array.from(quantitiesById, ([id, quantity]) => {
    const catalogItem = menuItemById.get(id)!;

    return {
      ...catalogItem,
      quantity,
      total: catalogItem.price * quantity
    };
  });

  if (items.length === 0) {
    throw new Error("Корзина пуста.");
  }

  const total = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = calculatePromoDiscount(total, promoCode);
  const discountedTotal = total - discountAmount;
  const deliveryPricing =
    deliveryType === "delivery" && typeof deliveryDistanceMeters === "number"
      ? getDeliveryPricing(total, deliveryDistanceMeters)
      : null;

  if (deliveryType === "delivery" && !deliveryPricing) {
    throw new Error("Адрес находится за пределами зоны доставки 20 км.");
  }

  const deliveryCost = deliveryPricing?.cost ?? 0;
  const grandTotal = discountedTotal + deliveryCost;

  return {
    customerName,
    phone,
    deliveryType,
    deliveryCost,
    address: deliveryType === "delivery" ? address : "",
    deliveryDetails:
      deliveryType === "delivery" ? deliveryDetails || undefined : undefined,
    deliveryDistanceMeters,
    deliveryZone,
    visitDate: deliveryType === "cafe" ? visitDate : undefined,
    visitTime: deliveryType === "cafe" ? visitTime : undefined,
    guestCount: deliveryType === "cafe" ? guestCount : undefined,
    comment,
    promoCode,
    personalDataConsent,
    discountAmount,
    discountedTotal,
    items,
    total,
    grandTotal
  };
}

export function formatOrderEmail(order: ValidatedOrder, orderNumber: string) {
  const orderHeading =
    order.deliveryType === "cafe"
      ? "Новый заказ в кафе ко времени"
      : order.deliveryType === "pickup"
        ? "Новый заказ на самовывоз"
        : "Новый заказ с сайта Жан Клод Мангал";
  const lines = [
    `Номер заказа: ${orderNumber}`,
    `Дата и время заказа: ${formatOrderDateTime()}`,
    "",
    orderHeading,
    "",
    `Имя: ${order.customerName}`,
    `Телефон: ${order.phone}`,
    `Тип получения: ${fulfillmentLabel(order.deliveryType)}`,
    ...(order.address ? [`Адрес доставки: ${order.address}`] : []),
    ...(order.deliveryDetails
      ? [`Квартира / подъезд / этаж: ${order.deliveryDetails}`]
      : []),
    ...(typeof order.deliveryDistanceMeters === "number"
      ? [
          `Расчётное расстояние (по прямой × ${String(DELIVERY_DISTANCE_COEFFICIENT).replace(".", ",")}): ${formatDistance(order.deliveryDistanceMeters)} км`,
          `Зона доставки: ${order.deliveryZone === "near" ? "до 5 км" : "от 5 до 20 км"}`
        ]
      : []),
    ...(order.visitDate && order.visitTime && order.guestCount
      ? [
          `Дата визита: ${formatVisitDate(order.visitDate)}`,
          `Время визита: ${order.visitTime}`,
          `Количество гостей: ${order.guestCount}`
        ]
      : []),
    order.comment ? `Комментарий: ${order.comment}` : "Комментарий: —",
    "",
    "Согласие на обработку персональных данных: принято",
    "",
    "Состав заказа:",
    ...order.items.map(
      (item, index) =>
        `${index + 1}. ${item.name} — ${item.quantity} × ${money(item.price)} ₽ = ${money(item.total)} ₽`
    ),
    "",
    `Сумма блюд: ${money(order.total)} ₽`,
    ...(order.promoCode
      ? [
          `Промокод: ${order.promoCode} (скидка ${FLYER_PROMO_DISCOUNT_PERCENT}%)`,
          `Скидка: −${money(order.discountAmount)} ₽`,
          `Сумма после скидки: ${money(order.discountedTotal)} ₽`
        ]
      : []),
    ...(order.deliveryType === "delivery"
      ? [
          `Стоимость доставки: ${money(order.deliveryCost)} ₽${order.deliveryCost === 0 ? " (бесплатно)" : ""}`
        ]
      : []),
    `Итоговая сумма: ${money(order.grandTotal)} ₽`
  ];

  return lines.join("\n");
}

async function deliverOrderToEmail(
  order: ValidatedOrder,
  orderNumber: string
): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true";
  const to = process.env.ORDER_EMAIL;
  const from = process.env.SMTP_FROM?.trim() || user;
  const configuredTimeout = Number(process.env.SMTP_TIMEOUT_MS ?? 12_000);
  const timeoutMs =
    Number.isFinite(configuredTimeout) && configuredTimeout >= 5_000
      ? configuredTimeout
      : 12_000;

  if (!host || !to || !user || !pass) {
    throw new Error("Не настроены SMTP-переменные для отправки заказа.");
  }

  if (pass.startsWith("сюда_")) {
    throw new Error(
      "SMTP_PASS должен содержать только пароль приложения без подсказок и префиксов."
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: timeoutMs,
    greetingTimeout: timeoutMs,
    socketTimeout: timeoutMs
  });

  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      transporter.sendMail({
        from,
        to,
        subject: `${
          order.deliveryType === "cafe"
            ? `Заказ в кафе к ${order.visitTime} №${orderNumber} — звонок не требуется`
            : order.deliveryType === "pickup"
              ? `Самовывоз №${orderNumber} — звонок не требуется`
              : `Новый заказ №${orderNumber} с сайта Жан Клод Мангал`
        }${order.promoCode ? ` · промокод ${order.promoCode}` : ""}`,
        text: formatOrderEmail(order, orderNumber)
      }),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error(`SMTP не ответил за ${timeoutMs / 1000} секунд.`)),
          timeoutMs
        );
      })
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
    transporter.close();
  }
}

export async function deliverCheckoutOrder(
  order: ValidatedOrder,
  orderNumber: string
): Promise<OrderDeliveryResult> {
  const orderText = formatOrderEmail(order, orderNumber);
  const deliveries = await Promise.allSettled([
    deliverOrderToEmail(order, orderNumber),
    deliverOrderToTelegram(orderText, orderNumber)
  ]);

  const channels: Array<"email" | "telegram"> = [];

  if (deliveries[0].status === "fulfilled") channels.push("email");
  if (deliveries[1].status === "fulfilled") channels.push("telegram");

  const errors = deliveries
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map((result) =>
      result.reason instanceof Error ? result.reason.message : String(result.reason)
    );

  if (channels.length === 0) {
    throw new Error(`Не удалось отправить заказ: ${errors.join("; ")}`);
  }

  if (errors.length > 0) {
    console.error(
      `[order ${orderNumber}] Заказ доставлен только через ${channels.join(", ")}: ${errors.join("; ")}`
    );
  }

  return { delivered: true, channels };
}
