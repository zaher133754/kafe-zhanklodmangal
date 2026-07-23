import "server-only";
import nodemailer from "nodemailer";
import {
  CAFE_CLOSE_TIME,
  CAFE_OPEN_TIME,
  getTodayInSamara,
  isCafeVisitTime,
  isFutureSamaraVisit
} from "@/lib/cafe-visit";
import { calculateDeliveryCost } from "@/lib/delivery";
import { deliverOrderToTelegram } from "@/lib/telegram-notifications";

export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

export type FulfillmentType = "delivery" | "pickup" | "cafe";

export type CheckoutOrderPayload = {
  customerName: string;
  phone: string;
  deliveryType: FulfillmentType;
  address?: string;
  visitDate?: string;
  visitTime?: string;
  guestCount?: number;
  comment?: string;
  items: OrderItem[];
  total?: number;
};

export type ValidatedOrder = {
  customerName: string;
  phone: string;
  deliveryType: FulfillmentType;
  deliveryCost: number;
  address?: string;
  visitDate?: string;
  visitTime?: string;
  guestCount?: number;
  comment?: string;
  items: Array<OrderItem & { total: number }>;
  total: number;
  grandTotal: number;
};

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
  const address = clean(source.address, 240);
  const visitDate = clean(source.visitDate, 10);
  const visitTime = clean(source.visitTime, 5);
  const guestCount = cleanNumber(source.guestCount);
  const comment = clean(source.comment, 800);
  const rawItems = Array.isArray(source.items) ? source.items : [];

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

  if (deliveryType === "delivery" && !address) {
    throw new Error("Укажите адрес доставки.");
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

    if (!isFutureSamaraVisit(visitDate, visitTime)) {
      throw new Error("Выберите время позже текущего.");
    }
  }

  const items = rawItems
    .map((item) => {
      const price = Math.max(0, Math.round(cleanNumber(item.price)));
      const quantity = Math.max(0, Math.round(cleanNumber(item.quantity)));

      return {
        name: clean(item.name, 160),
        price,
        quantity,
        total: price * quantity
      };
    })
    .filter((item) => item.name && item.price > 0 && item.quantity > 0);

  if (items.length === 0) {
    throw new Error("Корзина пуста.");
  }

  const total = items.reduce((sum, item) => sum + item.total, 0);
  const deliveryCost = calculateDeliveryCost(deliveryType, total);
  const grandTotal = total + deliveryCost;

  return {
    customerName,
    phone,
    deliveryType,
    deliveryCost,
    address: deliveryType === "delivery" ? address : "",
    visitDate: deliveryType === "cafe" ? visitDate : undefined,
    visitTime: deliveryType === "cafe" ? visitTime : undefined,
    guestCount: deliveryType === "cafe" ? guestCount : undefined,
    comment,
    items,
    total,
    grandTotal
  };
}

export function formatOrderEmail(order: ValidatedOrder, orderNumber: string) {
  const lines = [
    `Номер заказа: ${orderNumber}`,
    `Дата и время заказа: ${formatOrderDateTime()}`,
    "",
    order.deliveryType === "cafe"
      ? "Новый заказ в кафе ко времени — требуется подтверждение"
      : "Новый заказ с сайта Жан Клод Мангал",
    "",
    `Имя: ${order.customerName}`,
    `Телефон: ${order.phone}`,
    `Тип получения: ${fulfillmentLabel(order.deliveryType)}`,
    ...(order.address ? [`Адрес доставки: ${order.address}`] : []),
    ...(order.visitDate && order.visitTime && order.guestCount
      ? [
          `Дата визита: ${formatVisitDate(order.visitDate)}`,
          `Время визита: ${order.visitTime}`,
          `Количество гостей: ${order.guestCount}`
        ]
      : []),
    order.comment ? `Комментарий: ${order.comment}` : "Комментарий: —",
    "",
    "Состав заказа:",
    ...order.items.map(
      (item, index) =>
        `${index + 1}. ${item.name} — ${item.quantity} × ${money(item.price)} ₽ = ${money(item.total)} ₽`
    ),
    "",
    `Сумма блюд: ${money(order.total)} ₽`,
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
        subject:
          order.deliveryType === "cafe"
            ? `Заказ в кафе ко времени №${orderNumber} — подтвердить`
            : `Новый заказ №${orderNumber} с сайта Жан Клод Мангал`,
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
    deliverOrderToTelegram(orderText)
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
