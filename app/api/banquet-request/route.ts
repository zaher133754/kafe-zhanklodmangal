import {
  deliverBanquetRequestEmail,
  deliverBanquetRequestTelegram
} from "@/lib/banquet-request-delivery";
import { createBanquetRequestHandler } from "@/lib/banquet-request-handler";
import { deliverBanquetRequestToChannels } from "@/lib/banquet-request-multichannel";

export const runtime = "nodejs";

export const POST = createBanquetRequestHandler((request) =>
  deliverBanquetRequestToChannels(request, {
    email: deliverBanquetRequestEmail,
    telegram: deliverBanquetRequestTelegram
  })
);
