import { expect, test } from "@playwright/test";
import {
  FAR_DELIVERY_COST,
  getDeliveryPricing,
  getDeliveryZone,
  MAX_DELIVERY_DISTANCE_METERS,
  NEAR_DELIVERY_COST,
  NEAR_DELIVERY_MAX_DISTANCE_METERS
} from "../../lib/delivery";
import {
  calculateEstimatedDeliveryDistanceMeters,
  calculateGeodesicDistanceMeters,
  DELIVERY_DISTANCE_COEFFICIENT
} from "../../lib/geo-distance";

test.describe("расстояние по прямой", () => {
  test("между одинаковыми координатами равно нулю", () => {
    const cafe = { latitude: 53.250859, longitude: 50.224685 };

    expect(calculateGeodesicDistanceMeters(cafe, cafe)).toBe(0);
  });

  test("считает геодезическое расстояние между двумя точками", () => {
    const distanceMeters = calculateGeodesicDistanceMeters(
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 1 }
    );

    expect(distanceMeters).toBeGreaterThan(111_000);
    expect(distanceMeters).toBeLessThan(111_300);
  });

  test("применяет к расстоянию коэффициент 1,3", () => {
    const origin = { latitude: 0, longitude: 0 };
    const destination = { latitude: 0, longitude: 1 };
    const directDistance = calculateGeodesicDistanceMeters(
      origin,
      destination
    );
    const estimatedDistance = calculateEstimatedDeliveryDistanceMeters(
      origin,
      destination
    );

    expect(DELIVERY_DISTANCE_COEFFICIENT).toBe(1.3);
    expect(estimatedDistance).toBe(
      Math.round(directDistance * DELIVERY_DISTANCE_COEFFICIENT)
    );
  });
});

test.describe("тарифы доставки", () => {
  test("до 5 км применяет порог 3 000 ₽", () => {
    expect(getDeliveryPricing(2_999, 5_000)).toMatchObject({
      zone: "near",
      cost: NEAR_DELIVERY_COST,
      amountToFreeDelivery: 1
    });
    expect(getDeliveryPricing(3_000, 5_000)).toMatchObject({
      zone: "near",
      cost: 0,
      amountToFreeDelivery: 0
    });
  });

  test("после 5 км применяет порог 5 000 ₽", () => {
    expect(
      getDeliveryPricing(4_999, NEAR_DELIVERY_MAX_DISTANCE_METERS + 1)
    ).toMatchObject({
      zone: "far",
      cost: FAR_DELIVERY_COST,
      amountToFreeDelivery: 1
    });
    expect(getDeliveryPricing(5_000, MAX_DELIVERY_DISTANCE_METERS)).toMatchObject(
      {
        zone: "far",
        cost: 0,
        amountToFreeDelivery: 0
      }
    );
  });

  test("за 20 км адрес считается вне зоны", () => {
    expect(getDeliveryZone(MAX_DELIVERY_DISTANCE_METERS + 1)).toBeNull();
    expect(
      getDeliveryPricing(10_000, MAX_DELIVERY_DISTANCE_METERS + 1)
    ).toBeNull();
  });
});

test("на мобильном адрес за 20 км блокирует онлайн-заказ", async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/api/delivery/suggest?*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        suggestions: [
          {
            id: "ymapsbm1://geo?data=outside-zone",
            title: "Дальний дом, 20",
            subtitle: "Самарская область",
            address: "Самарская область, Дальний дом, 20"
          }
        ]
      })
    });
  });
  await page.route("**/api/delivery/quote", async (route) => {
    await route.fulfill({
      status: 422,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        code: "OUTSIDE_ZONE",
        error: "Адрес находится за пределами зоны доставки 20 км.",
        distanceMeters: 20_100,
        maxDistanceMeters: 20_000
      })
    });
  });

  await page.goto("/menu");
  await page
    .getByRole("button", { name: /Добавить в корзину:/ })
    .first()
    .click();
  await page.getByRole("button", { name: /Открыть корзину:/ }).click();
  await page.getByRole("button", { name: "К оформлению" }).click();
  await page.getByLabel("Адрес доставки").fill("Дальний дом 20");
  await page.getByRole("option", { name: /Дальний дом, 20/ }).click();

  await expect(page.getByText(/20,1 км.*дальше нашей зоны 20 км/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Подтвердить заказ" })
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1
    )
  ).toBe(true);
});
