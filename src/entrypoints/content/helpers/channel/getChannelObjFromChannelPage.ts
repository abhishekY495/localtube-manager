import { YoutubeChannel } from "@/entrypoints/types";

export function getChannelObjFromChannelPage(pageHeaderElement: HTMLElement) {
  const dynamicTextViewModelEement = pageHeaderElement.querySelector(
    "yt-dynamic-text-view-model"
  ) as HTMLElement;
  const decoratedAvatarViewModelEement = pageHeaderElement.querySelector(
    "yt-decorated-avatar-view-model"
  ) as HTMLElement;
  const contentMetadataViewModel = pageHeaderElement.querySelector(
    "yt-content-metadata-view-model"
  ) as HTMLElement;
  const channelHandleElement = contentMetadataViewModel.querySelector(
    "span"
  ) as HTMLElement;

  const channelHandle = channelHandleElement.innerText;

  const imageElement = decoratedAvatarViewModelEement.querySelector(
    "img"
  ) as HTMLElement;
  const imageUrl = imageElement.getAttribute("src");

  const channel: YoutubeChannel = {
    name: dynamicTextViewModelEement?.innerText,
    handle: `https://www.youtube.com/${channelHandle}`,
    id: "",
    imageUrl: imageUrl?.replace("=s160", "=s176") || "",
    addedAt: new Date().toISOString(),
  };

  return channel;
}
