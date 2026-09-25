import { expect, test } from "@playwright/test";

test("все категории меню видны на главной сразу", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Напитки", exact: true })
  ).toBeVisible();
});

test("на главной нет кнопок раскрытия и сворачивания меню", async ({
  page
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("button", {
      name: /^(Показать всё меню|Свернуть меню)$/
    })
  ).toHaveCount(0);
});
