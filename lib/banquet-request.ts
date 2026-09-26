import {
  PERSONAL_DATA_CONSENT_REQUIRED_MESSAGE,
  PERSONAL_DATA_CONSENT_VERSION
} from "@/lib/personal-data";

export type BanquetRequestPayload = {
  name?: unknown;
  phone?: unknown;
  comment?: unknown;
  personalDataConsent?: {
    accepted?: unknown;
    version?: unknown;
  };
};

export type ValidatedBanquetRequest = {
  name: string;
  phone: string;
  comment?: string;
  personalDataConsent: {
    accepted: true;
    version: typeof PERSONAL_DATA_CONSENT_VERSION;
    acceptedAt: string;
  };
};

export class BanquetRequestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BanquetRequestValidationError";
  }
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function validateBanquetRequestPayload(
  body: unknown
): ValidatedBanquetRequest {
  const source =
    body && typeof body === "object" ? (body as BanquetRequestPayload) : {};
  const name = clean(source.name, 80);
  const phone = clean(source.phone, 40);
  const comment = clean(source.comment, 1_000);

  if (source.personalDataConsent?.accepted !== true) {
    throw new BanquetRequestValidationError(
      PERSONAL_DATA_CONSENT_REQUIRED_MESSAGE
    );
  }

  if (!name) {
    throw new BanquetRequestValidationError("Укажите имя.");
  }

  if (phone.replace(/\D/g, "").length < 10) {
    throw new BanquetRequestValidationError("Укажите корректный телефон.");
  }

  return {
    name,
    phone,
    comment: comment || undefined,
    personalDataConsent: {
      accepted: true,
      version: PERSONAL_DATA_CONSENT_VERSION,
      acceptedAt: new Date().toISOString()
    }
  };
}

export function formatBanquetRequestEmail(
  request: ValidatedBanquetRequest,
  date = new Date()
) {
  const requestedAt = new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Samara"
  }).format(date);

  return [
    "Новая заявка на банкет",
    "",
    `Дата и время: ${requestedAt}`,
    `Имя: ${request.name}`,
    `Телефон: ${request.phone}`,
    `Комментарий: ${request.comment || "не указан"}`,
    "",
    "Согласие на обработку персональных данных: принято"
  ].join("\n");
}
