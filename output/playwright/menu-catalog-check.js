async (page) => {
  return await page.evaluate(() => ({
    width: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    menuSliderVisible:
      document.querySelector('[aria-label^="Открыть Страница меню"]') !== null,
    categoryLinks: Array.from(
      document.querySelectorAll('nav[aria-label="Категории меню"] a')
    ).map((element) => element.textContent?.replace(/\s+/g, " ").trim()),
    dishCards: document.querySelectorAll("#menu article").length,
    firstDish:
      document.querySelector("#menu article [data-slot='card-title']")
        ?.textContent?.trim() ?? null,
    orderButtons: Array.from(
      document.querySelectorAll("#menu [data-order-open]")
    ).length
  }));
}
