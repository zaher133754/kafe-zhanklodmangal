export const NEAR_DELIVERY_MAX_DISTANCE_METERS = 5_000;
export const MAX_DELIVERY_DISTANCE_METERS = 20_000;

export const NEAR_FREE_DELIVERY_THRESHOLD = 3_000;
export const FAR_FREE_DELIVERY_THRESHOLD = 5_000;

export const NEAR_DELIVERY_COST = 350;
export const FAR_DELIVERY_COST = 450;

export type DeliveryZone = "near" | "far";

export type DeliveryPricing = {
  zone: DeliveryZone;
  cost: number;
  freeDeliveryThreshold: number;
  amountToFreeDelivery: number;
};

export function getDeliveryZone(
  distanceMeters: number
): DeliveryZone | null {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) return null;
  if (distanceMeters <= NEAR_DELIVERY_MAX_DISTANCE_METERS) return "near";
  if (distanceMeters <= MAX_DELIVERY_DISTANCE_METERS) return "far";
  return null;
}

export function getDeliveryPricing(
  orderTotal: number,
  distanceMeters: number
): DeliveryPricing | null {
  const zone = getDeliveryZone(distanceMeters);

  if (!zone) return null;

  const freeDeliveryThreshold =
    zone === "near"
      ? NEAR_FREE_DELIVERY_THRESHOLD
      : FAR_FREE_DELIVERY_THRESHOLD;
  const paidDeliveryCost =
    zone === "near" ? NEAR_DELIVERY_COST : FAR_DELIVERY_COST;
  const normalizedOrderTotal = Math.max(0, orderTotal);

  return {
    zone,
    cost:
      normalizedOrderTotal >= freeDeliveryThreshold ? 0 : paidDeliveryCost,
    freeDeliveryThreshold,
    amountToFreeDelivery: Math.max(
      0,
      freeDeliveryThreshold - normalizedOrderTotal
    )
  };
}

export function calculateDeliveryCost(
  deliveryType: string,
  orderTotal: number,
  distanceMeters?: number
) {
  if (deliveryType !== "delivery") return 0;
  if (typeof distanceMeters !== "number") return null;

  return getDeliveryPricing(orderTotal, distanceMeters)?.cost ?? null;
}
