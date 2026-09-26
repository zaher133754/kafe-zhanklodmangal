import { expect, test } from "@playwright/test";
import {
  BanquetRequestValidationError,
  formatBanquetRequestEmail,
  validateBanquetRequestPayload
} from "../../lib/banquet-request";
import { createBanquetRequestHandler } from "../../lib/banquet-request-handler";
import { PERSONAL_DATA_CONSENT_VERSION } from "../../lib/personal-data";

const validPayload = {
  name: "  Анна Петрова  ",
  phone: "+7 (903) 123-45-67",
  comment: "  Банкет на день рождения  ",
  personalDataConsent: { accepted: true }
};

test.describe("банкетная заявка", () => {
  test("очищает и принимает корректные данные", () => {
    const request = validateBanquetRequestPayload(validPayload);

    expect(request).toMatchObject({
      name: "Анна Петрова",
      phone: "+7 (903) 123-45-67",
      comment: "Банкет на день рождения",
      personalDataConsent: {
        accepted: true,
        version: PERSONAL_DATA_CONSENT_VERSION
      }
    });
    expect(Date.parse(request.personalDataConsent.acceptedAt)).not.toBeNaN();
  });

  test("отклоняет пустое имя, короткий телефон и отсутствие согласия", () => {
    const invalidPayloads = [
      { ...validPayload, name: "   " },
      { ...validPayload, phone: "+7 123" },
      { ...validPayload, personalDataConsent: { accepted: false } }
    ];

    for (const payload of invalidPayloads) {
      expect(() => validateBanquetRequestPayload(payload)).toThrow(
        BanquetRequestValidationError
      );
    }
  });

  test("формирует понятное текстовое письмо", () => {
    const request = validateBanquetRequestPayload(validPayload);
    const text = formatBanquetRequestEmail(
      request,
      new Date("2026-09-26T08:30:00.000Z")
    );

    expect(text).toContain("Новая заявка на банкет");
    expect(text).toContain("Имя: Анна Петрова");
    expect(text).toContain("Телефон: +7 (903) 123-45-67");
    expect(text).toContain("Комментарий: Банкет на день рождения");
    expect(text).toContain("Согласие на обработку персональных данных: принято");
    expect(text).toContain("26.09.2026");
  });

  test("валидная заявка вызывает доставку и возвращает 200", async () => {
    const delivered: string[] = [];
    const handler = createBanquetRequestHandler(async (request) => {
      delivered.push(request.phone);
    });
    const response = await handler(makeRequest(validPayload));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(delivered).toEqual(["+7 (903) 123-45-67"]);
  });

  test("ошибка валидации возвращает 400 и не вызывает доставку", async () => {
    let deliveries = 0;
    const handler = createBanquetRequestHandler(async () => {
      deliveries += 1;
    });
    const response = await handler(
      makeRequest({ ...validPayload, phone: "123" })
    );

    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain("телефон");
    expect(deliveries).toBe(0);
  });

  test("шестая заявка с одного IP за 15 минут возвращает 429", async () => {
    let deliveries = 0;
    const handler = createBanquetRequestHandler(async () => {
      deliveries += 1;
    });
    const ip = `198.51.100.${Math.floor(Math.random() * 100) + 1}`;

    for (let index = 0; index < 5; index += 1) {
      const response = await handler(makeRequest(validPayload, ip));
      expect(response.status).toBe(200);
    }

    const limited = await handler(makeRequest(validPayload, ip));
    expect(limited.status).toBe(429);
    expect(deliveries).toBe(5);
  });

  test("ошибка SMTP возвращает безопасное сообщение без технических деталей", async () => {
    const secret = "smtp://user:very-secret-password@mail.example";
    const handler = createBanquetRequestHandler(async () => {
      throw new Error(secret);
    });
    const response = await handler(makeRequest(validPayload));
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(500);
    expect(body.error).not.toContain(secret);
    expect(body.error).toContain("Не удалось отправить заявку");
  });
});

function makeRequest(payload: unknown, ip = `203.0.113.${Date.now() % 200}`) {
  return new Request("http://localhost/api/banquet-request", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip
    },
    body: JSON.stringify(payload)
  });
}
