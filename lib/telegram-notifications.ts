import "server-only";
import { request as httpsRequest } from "node:https";
import { HttpsProxyAgent } from "https-proxy-agent";

const TELEGRAM_MESSAGE_LIMIT = 3900;
const TELEGRAM_ATTEMPTS = 2;
const TELEGRAM_TIMEOUT_MS = 8_000;

export type TelegramDeliveryResult = {
  delivered: true;
  channel: "telegram";
};

function splitMessage(text: string) {
  const chunks: string[] = [];
  let remaining = text.trim();

  while (remaining.length > TELEGRAM_MESSAGE_LIMIT) {
    let splitAt = remaining.lastIndexOf("\n", TELEGRAM_MESSAGE_LIMIT);
    if (splitAt < TELEGRAM_MESSAGE_LIMIT / 2) {
      splitAt = remaining.lastIndexOf(" ", TELEGRAM_MESSAGE_LIMIT);
    }
    if (splitAt < 1) splitAt = TELEGRAM_MESSAGE_LIMIT;

    chunks.push(remaining.slice(0, splitAt).trimEnd());
    remaining = remaining.slice(splitAt).trimStart();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

type TelegramApiResult = {
  ok?: boolean;
  description?: string;
};

type TelegramRelayResult = {
  ok?: boolean;
  error?: string;
};

function getErrorMessage(error: unknown) {
  if (error instanceof AggregateError) {
    const messages = error.errors
      .map((nestedError) =>
        nestedError instanceof Error ? nestedError.message : String(nestedError)
      )
      .filter(Boolean);

    if (messages.length > 0) return messages.join("; ");
  }

  return error instanceof Error ? error.message : String(error);
}

function telegramRequest(token: string, payload: string, proxyUrl: string) {
  return new Promise<TelegramApiResult>((resolve, reject) => {
    const request = httpsRequest(
      {
        hostname: "api.telegram.org",
        port: 443,
        path: `/bot${token}/sendMessage`,
        method: "POST",
        ...(proxyUrl
          ? { agent: new HttpsProxyAgent(proxyUrl) }
          : {
              agent: false,
              family: 0,
              autoSelectFamily: true,
              autoSelectFamilyAttemptTimeout: 500
            }),
        headers: {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(payload)
        },
        timeout: TELEGRAM_TIMEOUT_MS
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        response.on("end", () => {
          try {
            const result = JSON.parse(
              Buffer.concat(chunks).toString("utf8")
            ) as TelegramApiResult;

            if (
              !response.statusCode ||
              response.statusCode < 200 ||
              response.statusCode >= 300 ||
              !result.ok
            ) {
              reject(
                new Error(result.description || `HTTP ${response.statusCode || 0}`)
              );
              return;
            }

            resolve(result);
          } catch {
            reject(new Error("Telegram API вернул некорректный ответ."));
          }
        });
      }
    );

    request.once("timeout", () => {
      request.destroy(new Error("превышено время ожидания соединения"));
    });
    request.once("error", reject);
    request.end(payload);
  });
}

async function sendMessage(
  token: string,
  chatId: string,
  text: string,
  silent: boolean,
  proxyUrl: string
) {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= TELEGRAM_ATTEMPTS; attempt += 1) {
    try {
      await telegramRequest(
        token,
        JSON.stringify({
          chat_id: chatId,
          text,
          disable_notification: silent,
          link_preview_options: { is_disabled: true }
        }),
        proxyUrl
      );
      return;
    } catch (error) {
      lastError = new Error(getErrorMessage(error));
      if (attempt < TELEGRAM_ATTEMPTS) await wait(attempt * 500);
    }
  }

  throw new Error(`Telegram API: ${lastError?.message || "ошибка отправки"}`);
}

async function sendMessageThroughRelay(
  relayUrl: string,
  relaySecret: string,
  text: string,
  silent: boolean
) {
  const url = new URL(relayUrl);
  const isLocalRelay =
    url.hostname === "localhost" || url.hostname === "127.0.0.1";

  if (url.protocol !== "https:" && !isLocalRelay) {
    throw new Error("Telegram relay должен использовать HTTPS.");
  }

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= TELEGRAM_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          authorization: `Bearer ${relaySecret}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ text, silent }),
        cache: "no-store",
        signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS)
      });
      const result = (await response.json()) as TelegramRelayResult;

      if (!response.ok || !result.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return;
    } catch (error) {
      lastError = new Error(getErrorMessage(error));
      if (attempt < TELEGRAM_ATTEMPTS) await wait(attempt * 500);
    }
  }

  throw new Error(`Telegram relay: ${lastError?.message || "ошибка отправки"}`);
}

export async function deliverOrderToTelegram(
  orderText: string
): Promise<TelegramDeliveryResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  const silent = process.env.TELEGRAM_SILENT === "true";
  const relayUrl = process.env.TELEGRAM_RELAY_URL?.trim();
  const relaySecret = process.env.TELEGRAM_RELAY_SECRET?.trim();
  const proxyUrl =
    process.env.NODE_ENV === "production"
      ? ""
      : process.env.TELEGRAM_PROXY_URL?.trim() || "";

  if ((relayUrl && !relaySecret) || (!relayUrl && relaySecret)) {
    throw new Error(
      "TELEGRAM_RELAY_URL и TELEGRAM_RELAY_SECRET должны быть настроены вместе."
    );
  }

  if (!relayUrl && (!token || !chatId)) {
    throw new Error(
      "Не настроены TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID для отправки заказа."
    );
  }

  const chunks = splitMessage(`📩 ${orderText}`);
  for (let index = 0; index < chunks.length; index += 1) {
    const prefix = chunks.length > 1 ? `(${index + 1}/${chunks.length})\n` : "";
    const text = `${prefix}${chunks[index]}`;

    if (relayUrl && relaySecret) {
      await sendMessageThroughRelay(relayUrl, relaySecret, text, silent);
    } else {
      await sendMessage(token!, chatId!, text, silent, proxyUrl);
    }
  }

  return { delivered: true, channel: "telegram" };
}
