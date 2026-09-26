import "server-only";
import nodemailer from "nodemailer";
import {
  formatBanquetRequestEmail,
  type ValidatedBanquetRequest
} from "@/lib/banquet-request";

const BANQUET_REQUEST_SUBJECT =
  "Новая заявка на банкет с сайта Жан Клод Мангал";

export async function deliverBanquetRequestEmail(
  request: ValidatedBanquetRequest
): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.ORDER_EMAIL;
  const from = process.env.SMTP_FROM?.trim() || user;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true";
  const configuredTimeout = Number(process.env.SMTP_TIMEOUT_MS ?? 12_000);
  const timeoutMs =
    Number.isFinite(configuredTimeout) && configuredTimeout >= 5_000
      ? configuredTimeout
      : 12_000;

  if (!host || !to || !user || !pass) {
    throw new Error("Не настроены SMTP-переменные для банкетных заявок.");
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
        subject: BANQUET_REQUEST_SUBJECT,
        text: formatBanquetRequestEmail(request)
      }),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error("SMTP timeout while sending banquet request.")),
          timeoutMs
        );
      })
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
    transporter.close();
  }
}
