import { expect, test } from "@playwright/test";

test("страница банкетов доступна для поисковых систем", async ({ page }) => {
  const response = await page.goto("/banquets");

  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { level: 1, name: "Банкеты и торжества" })
  ).toBeVisible();
  await expect(page).toHaveTitle(/Банкеты и торжества/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://zhanklodmangal.ru/banquets"
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /index/
  );
});

test("банкетный блок удалён с главной страницы", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Банкеты и торжества" })
  ).toHaveCount(0);
});

test("пункт меню открывает отдельную страницу банкетов", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Банкеты" }).first()).toHaveAttribute(
    "href",
    "/banquets"
  );
});

test("страница банкетов опубликована в sitemap", async ({ request }) => {
  const response = await request.get("/sitemap.xml");

  expect(response.status()).toBe(200);
  expect(await response.text()).toContain(
    "<loc>https://zhanklodmangal.ru/banquets</loc>"
  );
});
