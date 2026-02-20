import { YoutubeChannel } from "@/entrypoints/types";
import { getChannelDetailsFromChannelHandle } from "./getChannelDetailsFromChannelHandle";

export async function getChannelObjFromChannelPage(
  pageHeaderElement: HTMLElement,
) {
  const contentMetadataViewModel = pageHeaderElement.querySelector(
    "yt-content-metadata-view-model",
  ) as HTMLElement;
  const channelHandleElement = contentMetadataViewModel.querySelector(
    "span",
  ) as HTMLElement;

  const channelHandle = channelHandleElement.innerText;

  const channelDetails =
    await getChannelDetailsFromChannelHandle(channelHandle);

  const channel: YoutubeChannel = {
    name: channelDetails?.channelName || "",
    handle: `https://www.youtube.com/${channelHandle}`,
    id: channelDetails?.channelId || "",
    imageUrl: channelDetails?.channelImage || "",
    addedAt: new Date().toISOString(),
  };

  return channel;
}
