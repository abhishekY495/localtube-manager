import { XMLParser } from "fast-xml-parser";
import { YOUTUBE_RSS_FEED_URL } from "../constants";
import type { Subscription } from "../types";

export const fetchLatestVideosUsingRssFeed = async (
  channelId: string,
): Promise<Subscription[]> => {
  const response = await fetch(`${YOUTUBE_RSS_FEED_URL}${channelId}`);
  const data = await response.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
  });
  const json = parser.parse(data);
  const entries = json.feed.entry || [];

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
};
