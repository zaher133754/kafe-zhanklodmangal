import { expect, test } from "@playwright/test";

const consentLabel = "Даю согласие на обработку персональных данных";
const consentError =
  "Необходимо дать согласие на обработку персональных данных";

test("юридические страницы открываются напрямую, индексируются и не переполняют экран", async ({
  page
}) => {
  const routes = [
    {
      path: "/consent",
      heading: "Согласие на обработку персональных данных"
    },
    {
      path: "/policy",
      heading: "Политика в отношении обработки персональных данных"
    }
  ];
  const viewports = [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 1000 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);

    for (const route of routes) {
      const response = await page.goto(route.path);

      expect(response?.status()).toBe(200);
      await expect(
        page.getByRole("heading", { level: 1, name: route.heading })
      ).toBeVisible();
      await expect(page.getByText("731304199885", { exact: true })).toBeVisible();
      await expect(
        page.getByText("318732500052980", { exact: true })
      ).toBeVisible();
      await expect(
        page.getByText(/Редакция от 17 августа 2026 года/)
      ).toBeVisible();
      await expect(page).toHaveTitle(new RegExp(route.heading));
      await expect(
        page.getByRole("link", { name: "Вернуться на сайт" })
      ).toHaveAttribute("href", "/");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1
        )
      ).toBe(true);
    }
  }

  const sitemap = await page.request.get("/sitemap.xml");
  const sitemapBody = await sitemap.text();

  expect(sitemap.ok()).toBe(true);
  expect(sitemapBody).toContain("/consent");
  expect(sitemapBody).toContain("/policy");
});

test("backend отклоняет заказ без подтверждённого согласия", async ({
  request
}) => {
  const validOrderWithoutConsent = {
    customerName: "Тестовый заказ",
    phone: "+7 900 000-00-00",
    deliveryType: "pickup",
    items: [
      {
        name: "Тестовое блюдо",
        price: 500,
        quantity: 1
      }
    ]
  };

  for (const personalDataConsent of [undefined, { accepted: false }]) {
    const response = await request.post("/api/order", {
      data: {
        ...validOrderWithoutConsent,
        ...(personalDataConsent ? { personalDataConsent } : {})
      }
    });
    const body = (await response.json()) as { error?: string };

    expect(response.status()).toBe(400);
    expect(body.error).toBe(consentError);
  }
});

test("корзина сохраняет расчёты, а заказ отправляется только после согласия", async ({
  page
}) => {
  let submittedOrder: Record<string, unknown> | undefined;
  let orderRequests = 0;

  await page.route("**/api/order", async (route) => {
    orderRequests += 1;
    submittedOrder = route.request().postDataJSON() as Record<string, unknown>;

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        orderNumber: "1234",
        grandTotal: 1_500,
        discountAmount: 0,
        promoCode: null,
        channels: ["email"]
      })
    });
  });

  await page.goto("/menu");
  await page
    .getByRole("button", { name: /Добавить в корзину:/ })
    .first()
    .click();

  await page.getByRole("button", { name: /Открыть корзину:/ }).click();
  await expect(
    page.getByRole("heading", { level: 2, name: "Корзина" })
  ).toBeVisible();

  const cartTotal = page
    .getByText("Сумма заказа", { exact: true })
    .locator("xpath=following-sibling::p");
  const initialTotal = (await cartTotal.textContent())?.trim();

  expect(initialTotal).toBeTruthy();
  await page
    .getByRole("button", { name: /Увеличить количество/ })
    .first()
    .click();
  await expect(cartTotal).not.toHaveText(initialTotal ?? "");

  await page.getByRole("button", { name: "К оформлению" }).click();
  await expect(
    page.getByRole("heading", { level: 2, name: "Оформление заказа" })
  ).toBeVisible();

  const consentCheckbox = page.getByRole("checkbox", {
    name: consentLabel
  });
  await expect(consentCheckbox).not.toBeChecked();

  const consentLink = page.locator('form a[href="/consent"]');
  const policyLink = page.locator('form a[href="/policy"]');

  await expect(consentLink).toHaveAttribute("target", "_blank");
  await expect(policyLink).toHaveAttribute("target", "_blank");

  await page.getByLabel("Адрес доставки").fill("Самара, проспект Кирова, 393В");
  await page.getByLabel("Имя", { exact: true }).fill("Мария");
  await page
    .getByLabel("Телефон", { exact: true })
    .fill("+7 900 000-00-00");
  await page.getByRole("button", { name: "Подтвердить заказ" }).click();

  await expect(page.getByText(consentError, { exact: true })).toBeVisible();
  expect(orderRequests).toBe(0);

  await consentCheckbox.check();
  await expect(consentCheckbox).toBeChecked();
  await expect(page.getByText(consentError, { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Подтвердить заказ" }).click();

  await expect(page.getByText("1234", { exact: true })).toBeVisible();
  expect(orderRequests).toBe(1);
  expect(submittedOrder).toMatchObject({
    customerName: "Мария",
    phone: "+7 900 000-00-00",
    deliveryType: "delivery",
    personalDataConsent: {
      accepted: true,
      version: "1.0"
    }
  });
  expect(
    (submittedOrder?.personalDataConsent as Record<string, unknown>).acceptedAt
  ).toBeUndefined();
});
