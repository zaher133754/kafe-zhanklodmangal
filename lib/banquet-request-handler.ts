import {
  BanquetRequestValidationError,
  validateBanquetRequestPayload,
  type ValidatedBanquetRequest
} from "@/lib/banquet-request";
import { getRequestIp, isRateLimited } from "@/lib/rate-limit";

type DeliverBanquetRequest = (
  request: ValidatedBanquetRequest
) => Promise<void>;

const LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1_000;

export function createBanquetRequestHandler(deliver: DeliverBanquetRequest) {
  return async function handleBanquetRequest(request: Request) {
    const ip = getRequestIp(request);

    if (isRateLimited(`banquet-request:${ip}`, LIMIT, WINDOW_MS)) {
      return Response.json(
        { error: "Слишком много заявок. Попробуйте снова через 15 минут." },
        { status: 429 }
      );
    }

    try {
      const payload = await request.json();
      const banquetRequest = validateBanquetRequestPayload(payload);
      await deliver(banquetRequest);

      return Response.json({ success: true });
    } catch (error) {
      if (error instanceof BanquetRequestValidationError) {
        return Response.json({ error: error.message }, { status: 400 });
      }

      if (error instanceof SyntaxError) {
        return Response.json(
          { error: "Не удалось прочитать данные формы." },
          { status: 400 }
        );
      }

      console.error(
        "Failed to deliver banquet request",
        error instanceof Error ? error.name : "UnknownError"
      );
      return Response.json(
        {
          error:
            "Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам."
        },
        { status: 500 }
      );
    }
  };
}
