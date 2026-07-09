import { randomInt } from "node:crypto";

let nextOrderNumber = randomInt(1000, 10000);

export function generateOrderNumber() {
  const orderNumber = nextOrderNumber.toString();
  nextOrderNumber = nextOrderNumber >= 9999 ? 1000 : nextOrderNumber + 1;

  return orderNumber;
}
