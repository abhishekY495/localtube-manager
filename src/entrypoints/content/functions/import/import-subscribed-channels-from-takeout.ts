import { ACTIONS } from "@/entrypoints/utils/constants";
import { getChannelDetailsFromCSV } from "@/entrypoints/utils/get-channel-details-from-csv";
import type { Message, Response } from "@/entrypoints/utils/types";

export const importSubscribedChannelsFromTakeout = async (
  csvContent: string,
) => {
  const subscribedChannels = await getChannelDetailsFromCSV(csvContent);
  if (subscribedChannels) {
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.BULK_ADD_SUBSCRIBED_CHANNELS,
      data: { channels: subscribedChannels },
    } satisfies Message);
    if (!response.success) {
      throw new Error("Failed to add subscribed channels");
    }
    return response.success;
  } else {
    throw new Error("Failed to add subscribed channels");
  }
};
