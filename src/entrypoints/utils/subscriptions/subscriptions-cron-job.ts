import { getAllSubscribedChannels } from "@/entrypoints/indexedDb/subscribed-channels";
import { wait } from "../wait";
import { fetchLatestVideosUsingRssFeed } from "./fetch-latest-videos-using-rss-feed";
import { addSubscription } from "@/entrypoints/indexedDb/subscriptions";

export const subscriptionsCronJob = async () => {
  const subscribedChannels = await getAllSubscribedChannels();
  for (const channel of subscribedChannels) {
    if (channel.id) {
      await wait(1000);
      const latestVideos = await fetchLatestVideosUsingRssFeed(channel.id);
      for (const video of latestVideos) {
        await addSubscription(video);
      }
    }
  }
};
