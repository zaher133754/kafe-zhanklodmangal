import { NextResponse } from "next/server";
import {
  DeliveryProviderError,
  suggestDeliveryAddresses
} from "@/lib/delivery-provider";
import { getRequestIp, isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const ip = getRequestIp(request);

  if (isRateLimited(`delivery-suggest:${ip}`, 90, 60_000)) {
    return NextResponse.json(
      {
        success: false,
        error: "Слишком много запросов. Подождите минуту и попробуйте снова."
      },
      { status: 429 }
    );
  }

  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim().slice(0, 120) ?? "";

  if (query.length < 3) {
    return NextResponse.json({ success: true, suggestions: [] });
  }

  try {
    const suggestions = await suggestDeliveryAddresses(query);
    return NextResponse.json({ success: true, suggestions });
  } catch (error) {
    const isProviderError = error instanceof DeliveryProviderError;

    return NextResponse.json(
      {
        success: false,
        error:
          isProviderError
            ? error.message
            : "Не удалось найти адрес. Попробуйте ещё раз или позвоните нам."
      },
      { status: isProviderError && error.code === "CONFIGURATION" ? 503 : 502 }
    );
  }
}
