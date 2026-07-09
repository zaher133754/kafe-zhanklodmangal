async (page) => {
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1500);

  return await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll("h2"));
    const categories = headings
      .map((heading) => {
        const category = heading.textContent?.trim() ?? "";
        if (!category) return null;

        let section = heading.parentElement;
        for (let index = 0; index < 4 && section; index += 1) {
          const buttonCount = section.querySelectorAll("button").length;
          const priceText = section.textContent?.includes("₽");
          if (buttonCount > 0 && priceText) break;
          section = section.parentElement;
        }

        if (!section) return null;

        const buttons = Array.from(section.querySelectorAll("button"));
        const items = buttons
          .map((button) => {
            const text = button.textContent?.replace(/\s+/g, " ").trim() ?? "";
            if (!text || !text.includes("₽")) return null;

            const image =
              button.querySelector("img")?.getAttribute("src") ??
              button.querySelector("img")?.getAttribute("data-src") ??
              null;

            return { raw: text, image };
          })
          .filter(Boolean);

        return items.length ? { category, items } : null;
      })
      .filter(Boolean);

    const footer = Array.from(document.querySelectorAll("*"))
      .map((element) => element.textContent?.replace(/\s+/g, " ").trim())
      .filter((text) => text?.includes("Источник:"))
      .slice(-3);

    return { categories, footer };
  });
}
