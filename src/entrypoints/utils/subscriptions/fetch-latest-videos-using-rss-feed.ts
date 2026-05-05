import { XMLParser } from "fast-xml-parser";
import { YOUTUBE_RSS_FEED_URL } from "../constants";
import type { Subscription } from "../types";

export const fetchLatestVideosUsingRssFeed = async (
  channelId: string,
): Promise<Subscription[]> => {
  try {
    const response = await fetch(`${YOUTUBE_RSS_FEED_URL}${channelId}`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
    });
    const json = parser.parse(data);

    if (!json.feed) {
      throw new Error("Invalid RSS feed response");
    }

    const entries = Array.isArray(json.feed.entry)
      ? json.feed.entry
      : json.feed.entry
        ? [json.feed.entry]
        : [];

    return entries.map((entry: any) => {
      const videoId = entry["yt:videoId"];
      const videoUrl = entry.link["@_href"];

      return {
        title: entry.title,
        urlSlug: videoId,
        channelName: entry.author.name,
        uploadedAt: entry.published,
        isShort: videoUrl.includes("/shorts/"),
      };
    });
  } catch (error) {
    throw new Error(`Failed to fetch latest videos for channel ${channelId}`, {
      cause: error,
    });
  }
};
