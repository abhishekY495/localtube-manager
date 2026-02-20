import { YoutubeChannel } from "@/entrypoints/types";
import { getChannelDetailsFromChannelHandle } from "./getChannelDetailsFromChannelHandle";

export async function getChannelObjFromVideoPage(ownerElement: HTMLElement) {
  const videoOwnerRendererElement = ownerElement.querySelector(
    "ytd-video-owner-renderer",
  ) as HTMLElement;

  const channelLinks = videoOwnerRendererElement.querySelectorAll("a");
  const channelHandle = channelLinks[0];

  const channelDetails = await getChannelDetailsFromChannelHandle(
    channelHandle.href,
  );

  const channel: YoutubeChannel = {
    name: channelDetails?.channelName || "",
    handle: channelHandle?.href || "",
    id: channelDetails?.channelId || "",
    imageUrl: channelDetails?.channelImage || "",
    addedAt: new Date().toISOString(),
  };

  return channel;
}
