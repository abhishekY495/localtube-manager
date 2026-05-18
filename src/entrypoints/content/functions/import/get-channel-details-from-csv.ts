import { FETCH_CHANNEL_DETAILS_BATCH_SIZE } from "@/entrypoints/utils/constants";
import { fetchChannelDetailsFromChannelUrl } from "../../../utils/fetch-channel-details-from-channel-url";
import type { Channel } from "../../../utils/types";
import { wait } from "../../../utils/wait";

export const getChannelDetailsFromCSV = async (csvContent: string) => {
  const rows = csvContent.split("\n").slice(1);
  const channelDetails: Channel[] = [];

  for (let i = 0; i < rows.length; i += FETCH_CHANNEL_DETAILS_BATCH_SIZE) {
    const batch = rows.slice(i, i + FETCH_CHANNEL_DETAILS_BATCH_SIZE);
    const batchChannelDetails = await Promise.all(
      batch.map(async (row) => {
        const [channelId, channelUrl, channelName] = row.split(",");
        return await fetchChannelDetailsFromChannelUrl(
          channelId,
          channelUrl,
          channelName,
        );
      }),
    );

    channelDetails.push(
      ...batchChannelDetails.filter((channel): channel is Channel => {
        return channel !== null;
      }),
    );

    if (i + FETCH_CHANNEL_DETAILS_BATCH_SIZE < rows.length) {
      await wait(1000);
    }
  }

  return channelDetails;
};
