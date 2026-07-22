import "server-only";
import nodemailer from "nodemailer";
import { calculateDeliveryCost } from "@/lib/delivery";
import { deliverOrderToTelegram } from "@/lib/telegram-notifications";

export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutOrderPayload = {
  customerName: string;
  phone: string;
  deliveryType: "delivery" | "pickup" | string;
  address?: string;
  comment?: string;
  items: OrderItem[];
  total?: number;
};

export type ValidatedOrder = {
  customerName: string;
  phone: string;
  deliveryType: "delivery" | "pickup" | string;
  deliveryCost: number;
  address?: string;
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

export function validateOrderPayload(body: unknown): ValidatedOrder {
  const source = body as Partial<CheckoutOrderPayload>;
  const customerName = clean(source.customerName, 80);
  const phone = clean(source.phone, 40);
  const deliveryType = clean(source.deliveryType, 40) || "delivery";
  const address = clean(source.address, 240);
  const comment = clean(source.comment, 800);
  const rawItems = Array.isArray(source.items) ? source.items : [];

  if (!customerName) {
    throw new Error("Укажите имя.");
  }

  if (!isPhoneLike(phone)) {
    throw new Error("Укажите корректный телефон.");
  }

  if (deliveryType === "delivery" && !address) {
    throw new Error("Укажите адрес доставки.");
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
    comment,
    items,
    total,
    grandTotal
  };
}

export function formatOrderEmail(order: ValidatedOrder, orderNumber: string) {
  const deliveryLabel =
    order.deliveryType === "delivery"
      ? "Доставка"
      : order.deliveryType === "pickup"
        ? "Самовывоз"
        : order.deliveryType;

  const lines = [
    `Номер заказа: ${orderNumber}`,
    `Дата и время заказа: ${formatOrderDateTime()}`,
    "",
    "Новый заказ с сайта Жан Клод Мангал",
    "",
    `Имя: ${order.customerName}`,
    `Телефон: ${order.phone}`,
    `Тип получения: ${deliveryLabel}`,
    order.address ? `Адрес доставки: ${order.address}` : "Адрес доставки: —",
    order.comment ? `Комментарий: ${order.comment}` : "Комментарий: —",
    "",
    "Состав заказа:",
    ...order.items.map(
      (item, index) =>
        `${index + 1}. ${item.name} — ${item.quantity} × ${money(item.price)} ₽ = ${money(item.total)} ₽`
    ),
    "",
    `Сумма блюд: ${money(order.total)} ₽`,
    `Стоимость доставки: ${money(order.deliveryCost)} ₽${order.deliveryCost === 0 ? " (бесплатно)" : ""}`,
    `Итоговая сумма: ${money(order.grandTotal)} ₽`
  ];

  return lines.filter(Boolean).join("\n");
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
        subject: `Новый заказ №${orderNumber} с сайта Жан Клод Мангал`,
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
