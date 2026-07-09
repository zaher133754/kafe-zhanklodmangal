import { NextResponse } from "next/server";
import { deliverCheckoutOrder, validateOrderPayload } from "@/lib/order";
import { generateOrderNumber } from "@/lib/order-number";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const order = validateOrderPayload(await request.json());
    const orderNumber = generateOrderNumber();
    await deliverCheckoutOrder(order, orderNumber);

    return NextResponse.json({ success: true, orderNumber });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Не удалось отправить заказ."
      },
      { status: 400 }
    );
  }
}
