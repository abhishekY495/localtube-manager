import { getAllSubscribedChannels } from "@/entrypoints/indexed-db/subscribed-channels";
import { wait } from "../wait";
import { fetchLatestVideosUsingRssFeed } from "./fetch-latest-videos-using-rss-feed";
import type { Subscription } from "../types";
import { syncSubscriptionsWithLatestVideos } from "@/entrypoints/indexed-db/subscriptions";

export const subscriptionsCronJob = async () => {
  const subscribedChannels = await getAllSubscribedChannels();
  const latestVideos: Subscription[] = [];

  for (const channel of subscribedChannels) {
    if (channel.id) {
      await wait(500);

      try {
        const channelLatestVideos = await fetchLatestVideosUsingRssFeed(
          channel.id,
        );
        latestVideos.push(...channelLatestVideos);
      } catch (error) {
        console.warn(
          `Failed to sync latest videos for channel ${channel.id}`,
          error,
        );
        throw new Error("YouTube RSS feed is down or unavailable.");
      }
    }
  }

  const newVideos = await syncSubscriptionsWithLatestVideos(latestVideos);

  return newVideos;
};
