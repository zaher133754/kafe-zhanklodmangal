import { NextResponse } from "next/server";
import { deliverOrder, type OrderPayload } from "@/lib/order-delivery";

export const runtime = "nodejs";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<OrderPayload>;

    const payload: OrderPayload = {
      name: clean(body.name, 80),
      phone: clean(body.phone, 40),
      type: clean(body.type, 60) || "Доставка",
      message: clean(body.message, 600)
    };

    if (!payload.name || !payload.phone) {
      return NextResponse.json(
        { ok: false, error: "Укажите имя и телефон." },
        { status: 400 }
      );
    }

    const result = await deliverOrder(payload);

    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось отправить заявку." },
      { status: 500 }
    );
  }
}
