export const FLYER_PROMO_CODE = "NOW5";
export const FLYER_PROMO_DISCOUNT_PERCENT = 5;

export function normalizePromoCode(value: unknown) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

export function isPromoCodeValid(value: unknown) {
  return normalizePromoCode(value) === FLYER_PROMO_CODE;
}

export function calculatePromoDiscount(orderTotal: number, promoCode: unknown) {
  if (!isPromoCodeValid(promoCode)) {
    return 0;
  }

  const safeTotal = Number.isFinite(orderTotal)
    ? Math.max(0, Math.round(orderTotal))
    : 0;

  return Math.round((safeTotal * FLYER_PROMO_DISCOUNT_PERCENT) / 100);
}
