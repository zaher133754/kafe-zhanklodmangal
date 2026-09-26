import { deliverBanquetRequestEmail } from "@/lib/banquet-request-delivery";
import { createBanquetRequestHandler } from "@/lib/banquet-request-handler";

export const runtime = "nodejs";

export const POST = createBanquetRequestHandler(deliverBanquetRequestEmail);
