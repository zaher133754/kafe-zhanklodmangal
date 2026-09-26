import type { ValidatedBanquetRequest } from "@/lib/banquet-request";

type BanquetRequestChannel = (
  request: ValidatedBanquetRequest
) => Promise<unknown>;

export type BanquetRequestChannels = {
  email: BanquetRequestChannel;
  telegram: BanquetRequestChannel;
};

export async function deliverBanquetRequestToChannels(
  request: ValidatedBanquetRequest,
  channels: BanquetRequestChannels
): Promise<void> {
  const deliveries = await Promise.allSettled([
    channels.email(request),
    channels.telegram(request)
  ]);
  const deliveredChannels: string[] = [];
  const failedChannels: string[] = [];

  for (const [index, delivery] of deliveries.entries()) {
    const channel = index === 0 ? "email" : "telegram";
    if (delivery.status === "fulfilled") {
      deliveredChannels.push(channel);
    } else {
      failedChannels.push(channel);
    }
  }

  if (deliveredChannels.length === 0) {
    throw new Error("Не удалось доставить банкетную заявку ни по одному каналу.");
  }

  if (failedChannels.length > 0) {
    console.error(
      `[banquet request] Заявка доставлена через ${deliveredChannels.join(
        ", "
      )}; не сработал канал: ${failedChannels.join(", ")}.`
    );
  }
}
