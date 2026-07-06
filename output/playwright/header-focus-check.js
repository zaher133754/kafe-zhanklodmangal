async page => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3002/#top", {
    waitUntil: "domcontentloaded",
    timeout: 15000
  });

  const trigger = page.getByRole("button", { name: "Открыть меню" });
  await trigger.click();

  const focusSequence = [];
  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press("Tab");
    focusSequence.push(
      await page.evaluate(() => ({
        insideDialog: Boolean(document.activeElement?.closest("dialog[open]")),
        label:
          document.activeElement?.getAttribute("aria-label") ??
          document.activeElement?.textContent?.trim().slice(0, 32)
      }))
    );
  }

  const menuTargets = await page.locator("dialog[open] a, dialog[open] button").evaluateAll(
    (elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          label: element.getAttribute("aria-label") ?? element.textContent?.trim(),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      })
  );

  await page.keyboard.press("Escape");
  const afterEscape = await page.evaluate(() => ({
    dialogOpen: Boolean(document.querySelector("dialog[open]")),
    focusLabel: document.activeElement?.getAttribute("aria-label")
  }));

  await page.setViewportSize({ width: 768, height: 900 });
  await trigger.click();
  await page.mouse.click(20, 400);
  const afterOutsideClick = await page.evaluate(() => ({
    dialogOpen: Boolean(document.querySelector("dialog[open]")),
    focusLabel: document.activeElement?.getAttribute("aria-label")
  }));

  return { focusSequence, menuTargets, afterEscape, afterOutsideClick };
}
