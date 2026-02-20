import {
  getSubscribedChannels,
  updateChannelId,
} from "../../../indexedDB/channel";
import {
  addVideoToSubscribedChannelVideosStore,
  removeUnsubscribedChannelVideos,
  removeVideoFromSubscribedChannelVideosStore,
} from "../../../indexedDB/subscriptions";
import { YoutubeChannel } from "../../../types";

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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getChannelIdFromHandle = async (
  handle: string,
): Promise<string | null> => {
  try {
    // Clean the handle - remove @ and full YouTube URLs
    let cleanHandle = handle
      .replace(/^@/, "")
      .replace(/^https?:\/\/www\.youtube\.com\/@/, "")
      .replace(/^https?:\/\/youtube\.com\/@/, "")
      .replace(/^www\.youtube\.com\/@/, "")
      .replace(/^youtube\.com\/@/, "");

    // Try to get channel ID from YouTube page
    const channelUrl = `https://www.youtube.com/@${cleanHandle}`;
    const response = await fetch(channelUrl);

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Multiple patterns to find the channel ID - META TAG FIRST (most reliable)
    const patterns = [
      /<meta itemprop="identifier" content="(UC[a-zA-Z0-9_-]{22})"/, // META TAG - PRIORITY 1
      /"channelId":"(UC[a-zA-Z0-9_-]{22})"/,
      /"browseId":"(UC[a-zA-Z0-9_-]{22})"/,
      /channel\/(UC[a-zA-Z0-9_-]{22})/,
      /"externalId":"(UC[a-zA-Z0-9_-]{22})"/,
      /data-channel-external-id="(UC[a-zA-Z0-9_-]{22})"/,
    ];

    for (let i = 0; i < patterns.length; i++) {
      const match = html.match(patterns[i]);
      if (match) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};

const fetchLatestVideosFromChannel = async (
  channelId: string,
  channelHandle: string,
) => {
  try {
    const latestVideosResponse = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId
        .split("/")
        .pop()}`,
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

    // Return all videos
    return latestVideosDataArray;
  } catch (error) {
    console.error(
      `Error fetching latest videos from channel ${channelId}:`,
      error,
    );
    return [];
  }
};

const processChannelVideos = async (
  channelId: string,
  channelHandle: string,
) => {
  const newVideos: {
    title: string;
    channelName: string;
    thumbnailUrl: string;
  }[] = [];

  const latestVideos = await fetchLatestVideosFromChannel(
    channelId,
    channelHandle,
  );

  // Add delay to avoid rate limiting

  for (const video of latestVideos) {
    const isNewVideo = await addVideoToSubscribedChannelVideosStore({
      urlSlug: video.urlSlug,
      title: video.title,
      channelName: video.channelName,
      channelHandle: channelHandle,
      uploadedAt: video.uploadedAt,
    });

    // Track new videos for notifications
    if (isNewVideo) {
      const thumbnailUrl = video.urlSlug?.includes("shorts")
        ? `https://i.ytimg.com/vi/${
            video?.urlSlug?.split("/shorts/")[1]
          }/oar2.jpg`
        : `https://i.ytimg.com/vi/${
            video?.urlSlug?.split("=")[1]
          }/mqdefault.jpg`;

      newVideos.push({
        title: video.title,
        channelName: video.channelName,
        thumbnailUrl,
      });
    }
  }

  await removeVideoFromSubscribedChannelVideosStore(
    channelHandle,
    latestVideos,
  );

  return newVideos;
};

export const fetchSubscribedChannelLatestVideos = async () => {
  const subscribedChannels: YoutubeChannel[] = await getSubscribedChannels();
  const subscribedHandles = subscribedChannels.map((channel) => channel.handle);
  const newVideos: {
    title: string;
    channelName: string;
    thumbnailUrl: string;
  }[] = [];

  for (const channel of subscribedChannels) {
    if (!channel.id) {
      const channelId = await getChannelIdFromHandle(channel.handle);
      if (channelId) {
        await updateChannelId(channel.handle, channelId);
        const channelNewVideos = await processChannelVideos(
          channelId,
          channel.handle,
        );
        newVideos.push(...channelNewVideos);
      }
    }
    if (channel.id) {
      const channelNewVideos = await processChannelVideos(
        channel.id,
        channel.handle,
      );
      newVideos.push(...channelNewVideos);
    }
  }

  // Cleanup videos for unsubscribed channels
  await removeUnsubscribedChannelVideos(subscribedHandles);

  return newVideos;
};
