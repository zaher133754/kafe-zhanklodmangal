async (page) => {
  return await page.evaluate(() => ({
    width: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    hiddenRevealCount: Array.from(document.querySelectorAll("[data-reveal]"))
      .filter((element) => getComputedStyle(element).opacity === "0").length,
    heroSrc:
      document.querySelector('img[alt*="мангальной кухни"]')?.currentSrc ??
      document.querySelector('img[alt*="мангальной кухни"]')?.src ??
      null,
    highPriorityImages: Array.from(document.querySelectorAll("img"))
      .filter((image) => image.fetchPriority === "high").length
  }));
}
