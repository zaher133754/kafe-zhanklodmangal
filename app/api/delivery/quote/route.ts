import { NextResponse } from "next/server";
import { getDeliveryZone, MAX_DELIVERY_DISTANCE_METERS } from "@/lib/delivery";
import {
  DeliveryProviderError,
  resolveDeliveryDistance
} from "@/lib/delivery-provider";
import { createDeliveryQuote } from "@/lib/delivery-quote";
import { getRequestIp, isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getRequestIp(request);

  if (isRateLimited(`delivery-quote:${ip}`, 24, 60_000)) {
    return NextResponse.json(
      {
        success: false,
        code: "RATE_LIMITED",
        error: "Слишком много расчётов. Подождите минуту и попробуйте снова."
      },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as { uri?: unknown };
    const uri = typeof body.uri === "string" ? body.uri.trim() : "";

    if (!uri || uri.length > 2_000) {
      return NextResponse.json(
        {
          success: false,
          code: "ADDRESS_NOT_SELECTED",
          error: "Выберите дом из подсказок."
        },
        { status: 400 }
      );
    }

    const delivery = await resolveDeliveryDistance(uri);
    const zone = getDeliveryZone(delivery.distanceMeters);

    if (!zone) {
      return NextResponse.json(
        {
          success: false,
          code: "OUTSIDE_ZONE",
          error: "Адрес находится за пределами зоны доставки 20 км.",
          address: delivery.address,
          distanceMeters: delivery.distanceMeters,
          maxDistanceMeters: MAX_DELIVERY_DISTANCE_METERS
        },
        { status: 422 }
      );
    }

    const quote = createDeliveryQuote(
      delivery.address,
      delivery.distanceMeters
    );

    return NextResponse.json({ success: true, quote });
  } catch (error) {
    const isProviderError = error instanceof DeliveryProviderError;
    const status =
      isProviderError && error.code === "CONFIGURATION"
        ? 503
        : isProviderError && error.code === "ADDRESS_NOT_FOUND"
          ? 422
          : isProviderError
            ? 502
            : 503;

    return NextResponse.json(
      {
        success: false,
        code: isProviderError ? error.code : "DELIVERY_UNAVAILABLE",
        error:
          error instanceof Error
            ? error.message
            : "Расчёт доставки временно недоступен. Позвоните нам, чтобы оформить заказ."
      },
      { status }
    );
  }
}
