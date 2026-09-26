import { expect, test } from "@playwright/test";

test("страница банкетов доступна для поисковых систем", async ({ page }) => {
  const response = await page.goto("/banquets");

  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Банкеты, корпоративы и Дни рождения в Самаре"
    })
  ).toBeVisible();
  await expect(page).toHaveTitle(
    /Банкеты, корпоративы и Дни рождения в Самаре/
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://zhanklodmangal.ru/banquets"
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /index/
  );
});

test("первый экран содержит условия, три фотографии и блоки доверия", async ({
  page
}) => {
  await page.goto("/banquets");

  await expect(
    page.getByText(
      "До 40 человек — Стоимость от 2500 ₽ на гостя — Можно со своим алкоголем"
    )
  ).toBeVisible();
  await expect(page.locator("[data-banquet-collage] img")).toHaveCount(3);
  await expect(
    page.getByRole("heading", { name: "Всегда горячие и сочные" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Широкий ассортимент" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Место для больших компаний" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Оставить заявку" })
  ).toBeVisible();
  await expect(page.getByText(/в «Жан Клод Мангал»/)).toBeVisible();
});

test("кнопка открывает доступную форму и Escape возвращает фокус", async ({
  page
}) => {
  await page.goto("/banquets");
  const trigger = page.getByRole("button", { name: "Оставить заявку" });

  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "Оставить заявку на банкет"
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Имя")).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("форма отправляет имя, телефон, комментарий и согласие", async ({
  page
}) => {
  let submitted: Record<string, unknown> | undefined;

  await page.route("**/api/banquet-request", async (route) => {
    submitted = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true })
    });
  });

  await page.goto("/banquets");
  await page.getByRole("button", { name: "Оставить заявку" }).click();
  const dialog = page.getByRole("dialog", {
    name: "Оставить заявку на банкет"
  });

  await dialog.getByLabel("Имя").fill("Мария");
  await dialog.getByLabel("Телефон").fill("+7 (903) 111-22-33");
  await dialog.getByLabel("Комментарий").fill("Нас будет 20 человек");
  await dialog.getByLabel(/Даю согласие/).check();
  await dialog.getByRole("button", { name: "Отправить заявку" }).click();

  await expect(dialog.getByText("Спасибо! Мы скоро вам позвоним.")).toBeVisible();
  expect(submitted).toMatchObject({
    name: "Мария",
    phone: "+7 (903) 111-22-33",
    comment: "Нас будет 20 человек",
    personalDataConsent: { accepted: true }
  });
});

test("телефонный CTA и три отзыва видны на широком экране", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/banquets");

  await expect(
    page.getByRole("heading", { name: "Узнать цену на банкет по телефону" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "+7 (903) 308-62-89" }).last()
  ).toHaveAttribute("href", "tel:+79033086289");
  await expect(
    page.getByRole("heading", { name: "Отзывы наших клиентов" })
  ).toBeVisible();
  const reviewGrid = page.locator("[data-banquet-review-grid]");
  await expect(reviewGrid.locator("article")).toHaveCount(3);
  await expect(reviewGrid.getByText("Илья Бараев")).toBeVisible();
  await expect(reviewGrid.getByText("Виктория Сутягина")).toBeVisible();
  await expect(reviewGrid.getByText("Дамир Шерезданов")).toBeVisible();
  await expect(
    reviewGrid.getByText(/Отмечали здесь семейный праздник/)
  ).toBeVisible();
  await expect(
    reviewGrid.getByText(/Искали место, где можно отметить день рождения/)
  ).toBeVisible();
  await expect(
    reviewGrid.getByText(/Перед банкетом заранее согласовали меню и бюджет/)
  ).toBeVisible();
});

test("блок преимуществ остаётся компактным на широком экране", async ({
  page
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/banquets");

  const benefits = page.locator("[data-banquet-benefits]");
  const box = await benefits.boundingBox();

  expect(box).not.toBeNull();
  expect(box!.height).toBeLessThan(180);
});

test("на широком экране преимущества отделены от основного содержимого", async ({
  page
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/banquets");

  const heroLayout = await page
    .locator("[data-banquet-hero-layout]")
    .boundingBox();
  const benefits = await page.locator("[data-banquet-benefits]").boundingBox();

  expect(heroLayout).not.toBeNull();
  expect(benefits).not.toBeNull();
  expect(benefits!.y - (heroLayout!.y + heroLayout!.height)).toBeGreaterThanOrEqual(
    80
  );
});

test("первый экран сохраняет начало блока преимуществ", async ({
  page
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/banquets");

  const firstBenefit = page.getByRole("heading", {
    name: "Всегда горячие и сочные"
  });
  const box = await firstBenefit.boundingBox();

  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThan(890);
});

test("телефон использует фирменную подсветку и motion-анимацию", async ({
  page
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/banquets");

  const section = page
    .getByRole("heading", { name: "Узнать цену на банкет по телефону" })
    .locator("..");
  const phone = section.getByRole("link", { name: "+7 (903) 308-62-89" });

  await expect(phone).toHaveCSS("color", "rgb(255, 116, 38)");
  await phone.hover();
  await expect
    .poll(() => phone.evaluate((element) => getComputedStyle(element).textShadow))
    .not.toBe("none");
  await expect
    .poll(() => phone.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe("none");
});

test("на мобильном отзывы работают как карусель", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/banquets");

  const carousel = page.locator("[data-banquet-review-carousel]");
  await expect(carousel).toBeVisible();
  await expect(carousel.getByText("1 из 3")).toBeVisible();
  await carousel.getByRole("button", { name: "Следующий отзыв" }).click();
  await expect(carousel.getByText("2 из 3")).toBeVisible();
  await expect(
    carousel.getByRole("button", { name: "Предыдущий отзыв" })
  ).toBeEnabled();
});

test("контакты и карта завершают страницу", async ({ page }) => {
  await page.goto("/banquets");

  const contacts = page.locator("[data-banquet-contacts]");
  await expect(
    contacts.getByRole("heading", { name: "Контакты" })
  ).toBeVisible();
  await expect(contacts).toContainText("Самара, просп. Кирова, 393В");
  await expect(contacts).toContainText("11:00");
  await expect(
    contacts.getByRole("link", { name: "+7 (903) 308-62-89" })
  ).toHaveAttribute("href", "tel:+79033086289");
  const map = page.locator('iframe[title="ЖанКлод Мангал на Яндекс Картах"]');
  await expect(map).toHaveAttribute("src", /yandex\.ru\/map-widget/);
  await expect(map).toHaveAttribute("src", /pt=50\.224685/);
  await expect(map).not.toHaveAttribute("src", /(?:oid=|ol=biz)/);
  await expect(
    contacts.getByRole("link", { name: "Построить маршрут" })
  ).toHaveAttribute("href", /yandex\.ru\/maps/);
});

test("страница и форма не создают горизонтальное переполнение", async ({
  page
}) => {
  for (const viewport of [
    { width: 320, height: 720 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/banquets");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Банкеты, корпоративы и Дни рождения в Самаре"
      })
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1
      )
    ).toBe(true);

    if (viewport.width === 320) {
      await page.getByRole("button", { name: "Оставить заявку" }).click();
      await expect(
        page.getByRole("dialog", { name: "Оставить заявку на банкет" })
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1
        )
      ).toBe(true);
      await page.keyboard.press("Escape");
    }
  }
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
