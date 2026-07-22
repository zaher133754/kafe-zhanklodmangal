export const FREE_DELIVERY_THRESHOLD = 3_000;
export const DELIVERY_COST = 350;

export function calculateDeliveryCost(
  deliveryType: string,
  orderTotal: number
) {
  if (deliveryType !== "delivery") return 0;
  return orderTotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_COST : 0;
}
