import { fetchChannelDetailsFromChannelUrl } from "./fetch-channel-details-from-channel-url";
import type { Channel } from "./types";
import { wait } from "./wait";

export const getChannelDetailsFromCSV = async (csvContent: string) => {
  const rows = csvContent.split("\n").slice(1);
  const channelDetails: Channel[] = [];
  const batchSize = 10;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
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

    if (i + batchSize < rows.length) {
      await wait(1000);
    }
  }

  return channelDetails;
};
