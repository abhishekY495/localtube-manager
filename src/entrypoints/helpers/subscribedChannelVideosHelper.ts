import { getSubscribedChannels } from "../indexedDB/channel";
import {
  addVideoToSubscribedChannelVideosStore,
  removeUnsubscribedChannelVideos,
  removeVideoFromSubscribedChannelVideosStore,
} from "../indexedDB/subscriptions";
import { YoutubeChannel } from "../types";

const parseXMLEntry = (entryText: string) => {
  // Extract title
  const titleMatch = entryText.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "";

  // Extract link href attribute (handle attributes in any order)
  const linkMatch = entryText.match(/<link[^>]+href="([^"]+)"/);
  const urlSlug = linkMatch ? linkMatch[1] : "";

  // Extract channel name from <name> tag inside <author>
  const channelNameMatch = entryText.match(/<name>(.*?)<\/name>/);
  const channelName = channelNameMatch ? channelNameMatch[1] : "";

  // Extract uploaded date
  const uploadedAtMatch = entryText.match(/<published>(.*?)<\/published>/);
  const uploadedAt = uploadedAtMatch ? uploadedAtMatch[1] : "";

  return { title, urlSlug, channelName, uploadedAt };
};

const fetchLatestVideosFromChannel = async (
  channelId: string,
  channelHandle: string
) => {
  try {
    const latestVideosResponse = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId
        .split("/")
        .pop()}`
    );

    if (!latestVideosResponse.ok) {
      return [];
    }

    const latestVideosText = await latestVideosResponse.text();

    // Parse XML without DOMParser (not available in service workers)
    // Split by <entry> tags to get individual entries
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const entries = [];
    let match;

    while ((match = entryRegex.exec(latestVideosText)) !== null) {
      entries.push(match[1]);
    }

    const latestVideosDataArray = entries.map((entryText) => {
      const { title, urlSlug, channelName, uploadedAt } =
        parseXMLEntry(entryText);
      return {
        title,
        urlSlug,
        channelHandle,
        channelName,
        uploadedAt,
      };
    });

    return latestVideosDataArray.slice(0, 1);
  } catch (error) {
    console.error(
      `Error fetching latest videos from channel ${channelId}:`,
      error
    );
    return [];
  }
};

export const fetchSubscribedChannelLatestVideos = async () => {
  const subscribedChannels: YoutubeChannel[] = await getSubscribedChannels();
  const subscribedHandles = subscribedChannels.map((channel) => channel.handle);
  const newVideos: { title: string; channelName: string }[] = [];

  for (const channel of subscribedChannels) {
    if (channel.id) {
      const latestVideos = await fetchLatestVideosFromChannel(
        channel.id,
        channel.handle
      );
      for (const video of latestVideos) {
        const isNewVideo = await addVideoToSubscribedChannelVideosStore({
          urlSlug: video.urlSlug,
          title: video.title,
          channelName: video.channelName,
          channelHandle: channel.handle,
          uploadedAt: video.uploadedAt,
        });

        // Track new videos for notifications
        if (isNewVideo) {
          newVideos.push({
            title: video.title,
            channelName: video.channelName,
          });
        }
      }
      await removeVideoFromSubscribedChannelVideosStore(
        channel.handle,
        latestVideos
      );
    }
  }

  // Cleanup videos for unsubscribed channels
  await removeUnsubscribedChannelVideos(subscribedHandles);

  return newVideos;
};
