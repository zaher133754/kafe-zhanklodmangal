import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import {
  getDeliveryZone,
  MAX_DELIVERY_DISTANCE_METERS,
  type DeliveryZone
} from "@/lib/delivery";

const DELIVERY_QUOTE_TTL_MS = 2 * 60 * 60 * 1_000;

type DeliveryQuotePayload = {
  version: 1;
  address: string;
  distanceMeters: number;
  zone: DeliveryZone;
  issuedAt: number;
  expiresAt: number;
};

export type DeliveryQuote = DeliveryQuotePayload & {
  token: string;
};

function getQuoteSecret() {
  const secret = process.env.DELIVERY_QUOTE_SECRET?.trim();

  if (!secret || secret.length < 32) {
    throw new Error(
      "Расчёт доставки временно недоступен. Позвоните нам, чтобы оформить заказ."
    );
  }

  return secret;
}

function sign(encodedPayload: string) {
  return createHmac("sha256", getQuoteSecret())
    .update(encodedPayload)
    .digest("base64url");
}

export function createDeliveryQuote(
  address: string,
  distanceMeters: number
): DeliveryQuote {
  const zone = getDeliveryZone(distanceMeters);

  if (!zone || distanceMeters > MAX_DELIVERY_DISTANCE_METERS) {
    throw new Error("Адрес находится за пределами зоны доставки 20 км.");
  }

  const issuedAt = Date.now();
  const payload: DeliveryQuotePayload = {
    version: 1,
    address,
    distanceMeters,
    zone,
    issuedAt,
    expiresAt: issuedAt + DELIVERY_QUOTE_TTL_MS
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  return { ...payload, token: `${encodedPayload}.${sign(encodedPayload)}` };
}

export function verifyDeliveryQuoteToken(token: string): DeliveryQuotePayload {
  const [encodedPayload, suppliedSignature, extraPart] = token.split(".");

  if (!encodedPayload || !suppliedSignature || extraPart) {
    throw new Error("Выберите адрес доставки из подсказок ещё раз.");
  }

  const expectedSignature = sign(encodedPayload);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    throw new Error("Выберите адрес доставки из подсказок ещё раз.");
  }

  let payload: DeliveryQuotePayload;

  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as DeliveryQuotePayload;
  } catch {
    throw new Error("Выберите адрес доставки из подсказок ещё раз.");
  }

  const zone = getDeliveryZone(payload.distanceMeters);

  if (
    payload.version !== 1 ||
    !payload.address ||
    payload.address.length > 240 ||
    !Number.isFinite(payload.issuedAt) ||
    !Number.isFinite(payload.expiresAt) ||
    payload.issuedAt > Date.now() + 60_000 ||
    payload.expiresAt <= Date.now() ||
    payload.expiresAt - payload.issuedAt !== DELIVERY_QUOTE_TTL_MS ||
    !zone ||
    zone !== payload.zone
  ) {
    throw new Error("Расчёт доставки устарел. Выберите адрес ещё раз.");
  }

  return payload;
}
