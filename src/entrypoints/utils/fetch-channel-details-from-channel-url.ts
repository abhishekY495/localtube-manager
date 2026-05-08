import {
  CHANNEL_HANDLE_ELEMENTS_REGEX,
  CHANNEL_IMAGE_URL_ELEMENTS,
} from "./constants";
import type { Channel } from "./types";

export const fetchChannelDetailsFromChannelUrl = async (
  channelId: string,
  url: string,
  channelName: string,
): Promise<Channel | null> => {
  let channelImageUrl: string | null = null;
  let channelHandle: string | null = null;

  if (!url) return null;

  const response = await fetch(url.replace("http", "https"));
  if (!response.ok) return null;

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const channelImageUrlElement = CHANNEL_IMAGE_URL_ELEMENTS.map((element) => {
    return doc.querySelector(element.selector)?.getAttribute(element.attribute);
  }).find(Boolean);
  if (!channelImageUrlElement) return null;
  channelImageUrl = channelImageUrlElement?.replace("=s900", "=s160");

  const channelHandleElement = CHANNEL_HANDLE_ELEMENTS_REGEX.map((element) => {
    return html
      .match(element)?.[1]
      ?.replace(/^\//, "")
      ?.split("/")[0]
      ?.replace("@", "");
  }).find(Boolean);
  if (!channelHandleElement) return null;
  channelHandle = channelHandleElement;

  return {
    id: channelId,
    name: channelName,
    handle: channelHandle,
    image: channelImageUrl,
    addedAt: new Date().toISOString(),
  };
};
