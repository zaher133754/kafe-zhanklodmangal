import "server-only";

import {
  calculateEstimatedDeliveryDistanceMeters,
  type GeoPoint
} from "@/lib/geo-distance";

const CAFE_COORDINATES: GeoPoint = {
  latitude: 53.250859,
  longitude: 50.224685
};

const SAMARA_SEARCH_WINDOW = {
  center: `${CAFE_COORDINATES.longitude},${CAFE_COORDINATES.latitude}`,
  span: "0.8,0.6"
} as const;

const PROVIDER_TIMEOUT_MS = 8_000;

export type AddressSuggestion = {
  id: string;
  title: string;
  subtitle: string;
  address: string;
};

export type ResolvedDeliveryDistance = {
  address: string;
  distanceMeters: number;
};

export class DeliveryProviderError extends Error {
  code: "CONFIGURATION" | "ADDRESS_NOT_FOUND" | "PROVIDER";

  constructor(
    code: DeliveryProviderError["code"],
    message: string,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = "DeliveryProviderError";
    this.code = code;
  }
}

type YandexSuggestResponse = {
  results?: Array<{
    title?: { text?: string };
    subtitle?: { text?: string };
    tags?: string[];
    address?: { formatted_address?: string };
    uri?: string;
  }>;
};

type YandexGeocoderResponse = {
  response?: {
    GeoObjectCollection?: {
      featureMember?: Array<{
        GeoObject?: {
          metaDataProperty?: {
            GeocoderMetaData?: {
              kind?: string;
              precision?: string;
              text?: string;
              Address?: { formatted?: string };
            };
          };
          Point?: { pos?: string };
        };
      }>;
    };
  };
};

function getApiKey(name: string) {
  const apiKey = process.env[name]?.trim();

  if (!apiKey) {
    throw new DeliveryProviderError(
      "CONFIGURATION",
      "Расчёт доставки временно недоступен. Позвоните нам, чтобы оформить заказ."
    );
  }

  return apiKey;
}

async function fetchProviderJson<T>(url: URL, serviceName: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS)
    });
  } catch (error) {
    throw new DeliveryProviderError(
      "PROVIDER",
      "Не удалось проверить адрес. Попробуйте ещё раз или позвоните нам.",
      { cause: error }
    );
  }

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    console.error(
      `[delivery] ${serviceName} returned ${response.status}: ${details.slice(0, 300)}`
    );
    throw new DeliveryProviderError(
      "PROVIDER",
      "Не удалось проверить адрес. Попробуйте ещё раз или позвоните нам."
    );
  }

  return (await response.json()) as T;
}

export async function suggestDeliveryAddresses(
  query: string
): Promise<AddressSuggestion[]> {
  const url = new URL("https://suggest-maps.yandex.ru/v1/suggest");
  url.searchParams.set("apikey", getApiKey("YANDEX_SUGGEST_API_KEY"));
  url.searchParams.set("text", query);
  url.searchParams.set("lang", "ru");
  url.searchParams.set("results", "6");
  url.searchParams.set("highlight", "0");
  url.searchParams.set("ll", SAMARA_SEARCH_WINDOW.center);
  url.searchParams.set("spn", SAMARA_SEARCH_WINDOW.span);
  url.searchParams.set("strict_bounds", "1");
  url.searchParams.set("countries", "ru");
  url.searchParams.set("types", "house");
  url.searchParams.set("print_address", "1");
  url.searchParams.set("attrs", "uri");

  const data = await fetchProviderJson<YandexSuggestResponse>(
    url,
    "Yandex Suggest"
  );

  return (data.results ?? []).flatMap((item) => {
    const id = item.uri?.trim();
    const title = item.title?.text?.trim();
    const subtitle = item.subtitle?.text?.trim() ?? "";
    const address = item.address?.formatted_address?.trim() || title;

    if (!id || !title || !address || !item.tags?.includes("house")) return [];

    return [{ id, title, subtitle, address }];
  });
}

async function geocodeSuggestionUri(uri: string) {
  const url = new URL("https://geocode-maps.yandex.ru/v1");
  url.searchParams.set("apikey", getApiKey("YANDEX_GEOCODER_API_KEY"));
  url.searchParams.set("uri", uri);
  url.searchParams.set("lang", "ru_RU");
  url.searchParams.set("results", "1");
  url.searchParams.set("format", "json");

  const data = await fetchProviderJson<YandexGeocoderResponse>(
    url,
    "Yandex Geocoder"
  );
  const geoObject =
    data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
  const metadata = geoObject?.metaDataProperty?.GeocoderMetaData;
  const position = geoObject?.Point?.pos
    ?.trim()
    .split(/\s+/)
    .map(Number);
  const longitude = position?.[0];
  const latitude = position?.[1];
  const address = metadata?.Address?.formatted?.trim() || metadata?.text?.trim();

  if (
    metadata?.kind !== "house" ||
    !address ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude as number) > 90 ||
    Math.abs(longitude as number) > 180
  ) {
    throw new DeliveryProviderError(
      "ADDRESS_NOT_FOUND",
      "Выберите дом из подсказок, чтобы рассчитать доставку."
    );
  }

  return {
    address,
    latitude: latitude as number,
    longitude: longitude as number
  };
}

export async function resolveDeliveryDistance(
  suggestionUri: string
): Promise<ResolvedDeliveryDistance> {
  const destination = await geocodeSuggestionUri(suggestionUri);
  const distanceMeters = calculateEstimatedDeliveryDistanceMeters(
    CAFE_COORDINATES,
    destination
  );

  return { address: destination.address, distanceMeters };
}
