async page => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("http://127.0.0.1:3002/#top", {
    waitUntil: "domcontentloaded",
    timeout: 15000
  });

  const results = [];

  for (const width of [320, 390, 768, 820, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    results.push(
      await page.evaluate((viewportWidth) => {
        const header = document.querySelector("header");
        const desktopNav = header?.querySelector("nav");
        const burger = [...(header?.querySelectorAll("button") ?? [])].find(
          (element) => element.getAttribute("aria-label") === "Открыть меню"
        );
        const isVisible = (element) => {
          if (!element || getComputedStyle(element).display === "none") return false;
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        };
        const targets = [...(header?.querySelectorAll("a,button") ?? [])].filter(
          (element) => isVisible(element) && !element.closest("dialog")
        );
        const sizes = targets.map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            label:
              element.getAttribute("aria-label") ?? element.textContent?.trim(),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          };
        });

        return {
          width: viewportWidth,
          scrollWidth: document.documentElement.scrollWidth,
          desktopNav: isVisible(desktopNav),
          burger: isVisible(burger),
          minTarget: sizes.reduce(
            (minimum, size) => Math.min(minimum, size.width, size.height),
            999
          ),
          sizes
        };
      }, width)
    );
  }

  return results;
}
