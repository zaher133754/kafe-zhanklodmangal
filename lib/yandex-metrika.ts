const METRIKA_READY_EVENT = "yandex-metrika-ready";
const CURRENCY = "RUB";
const BRAND = "Жан Клод Мангал";

export const METRIKA_GOALS = {
  addToCart: "add_to_cart",
  beginCheckout: "begin_checkout",
  orderSuccess: "order_success"
} as const;

type MetrikaGoal = (typeof METRIKA_GOALS)[keyof typeof METRIKA_GOALS];
type GoalParams = Record<string, string | number | boolean>;

export type MetrikaProduct = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
};

type OrderSuccess = {
  orderId: string;
  revenue: number;
  fulfillmentType: "delivery" | "pickup" | "cafe";
  promoCode?: string;
  discountAmount?: number;
  products: MetrikaProduct[];
};

function getCounterId() {
  if (typeof window === "undefined") {
    return null;
  }

  const configuredCounterId = Number(
    process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
  );
  const counterId =
    window.__yandexMetrikaCounterId || configuredCounterId || null;

  return counterId && Number.isFinite(counterId) ? counterId : null;
}

function withMetrika(callback: (counterId: number) => void) {
  if (typeof window === "undefined") {
    return;
  }

  const counterId = getCounterId();
  if (!counterId) {
    return;
  }

  if (window.ym) {
    callback(counterId);
    return;
  }

  window.addEventListener(
    METRIKA_READY_EVENT,
    () => {
      if (window.ym) {
        callback(counterId);
      }
    },
    { once: true }
  );
}

function reachGoal(goal: MetrikaGoal, params?: GoalParams) {
  withMetrika((counterId) => {
    window.ym?.(counterId, "reachGoal", goal, params);
  });
}

function toEcommerceProduct(product: MetrikaProduct) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    brand: BRAND,
    ...(product.category ? { category: product.category } : {})
  };
}

function pushEcommerce(payload: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  const dataLayer = (window.dataLayer ||= []);
  dataLayer.push({
    ecommerce: {
      currencyCode: CURRENCY,
      ...payload
    }
  });
}

export function trackProductAdded(product: MetrikaProduct) {
  reachGoal(METRIKA_GOALS.addToCart, {
    product_id: product.id,
    product_name: product.name,
    category: product.category ?? "Без категории",
    item_count: product.quantity,
    order_price: product.price * product.quantity,
    currency: CURRENCY
  });

  pushEcommerce({
    add: {
      products: [toEcommerceProduct(product)]
    }
  });
}

export function trackProductRemoved(product: MetrikaProduct) {
  pushEcommerce({
    remove: {
      products: [toEcommerceProduct(product)]
    }
  });
}

export function trackCheckoutStarted(orderPrice: number, itemCount: number) {
  reachGoal(METRIKA_GOALS.beginCheckout, {
    order_price: orderPrice,
    item_count: itemCount,
    currency: CURRENCY
  });
}

export function trackOrderSuccess({
  orderId,
  revenue,
  fulfillmentType,
  promoCode,
  discountAmount,
  products
}: OrderSuccess) {
  const itemCount = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  reachGoal(METRIKA_GOALS.orderSuccess, {
    order_price: revenue,
    item_count: itemCount,
    fulfillment_type: fulfillmentType,
    ...(promoCode ? { promo_code: promoCode } : {}),
    ...(discountAmount ? { discount_amount: discountAmount } : {}),
    currency: CURRENCY
  });

  pushEcommerce({
    purchase: {
      actionField: {
        id: orderId,
        revenue,
        ...(promoCode ? { coupon: promoCode } : {})
      },
      products: products.map(toEcommerceProduct)
    }
  });
}
