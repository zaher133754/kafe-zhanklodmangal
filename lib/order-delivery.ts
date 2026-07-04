import "server-only";
import nodemailer from "nodemailer";

export type OrderPayload = {
  name: string;
  phone: string;
  type: string;
  message?: string;
};

export type DeliveryResult = {
  delivered: boolean;
  channel: "telegram" | "email" | "none";
};

function formatOrder(payload: OrderPayload) {
  return [
    "Новая заявка с сайта ЖанКлод Мангал",
    "",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Тип заявки: ${payload.type}`,
    payload.message ? `Комментарий: ${payload.message}` : null
  ]
    .filter(Boolean)
    .join("\n");
}

export async function deliverOrder(
  payload: OrderPayload
): Promise<DeliveryResult> {
  const text = formatOrder(payload);

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text
        })
      }
    );

    if (!response.ok) {
      throw new Error("Telegram delivery failed");
    }

    return { delivered: true, channel: "telegram" };
  }

  if (
    process.env.ORDER_EMAIL_HOST &&
    process.env.ORDER_EMAIL_TO &&
    process.env.ORDER_EMAIL_FROM
  ) {
    const transporter = nodemailer.createTransport({
      host: process.env.ORDER_EMAIL_HOST,
      port: Number(process.env.ORDER_EMAIL_PORT ?? 587),
      secure: process.env.ORDER_EMAIL_SECURE === "true",
      auth:
        process.env.ORDER_EMAIL_USER && process.env.ORDER_EMAIL_PASS
          ? {
              user: process.env.ORDER_EMAIL_USER,
              pass: process.env.ORDER_EMAIL_PASS
            }
          : undefined
    });

    await transporter.sendMail({
      from: process.env.ORDER_EMAIL_FROM,
      to: process.env.ORDER_EMAIL_TO,
      subject: "Новая заявка с сайта ЖанКлод Мангал",
      text
    });

    return { delivered: true, channel: "email" };
  }

  return { delivered: false, channel: "none" };
}
