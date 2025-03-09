import { YoutubeChannel } from "@/entrypoints/types";

export function getChannelObjFromVideoPage(
  aboveTheFoldElement: HTMLElement,
  ownerElement: HTMLElement
) {
  const socialLinksElement = aboveTheFoldElement.querySelector(
    "#social-links"
  ) as HTMLElement;
  const videoOwnerRendererElement = ownerElement.querySelector(
    "ytd-video-owner-renderer"
  ) as HTMLElement;

  const channelSocialLinks = socialLinksElement.querySelectorAll("a");
  const channelId1 = channelSocialLinks[0];

  const channelLinks = videoOwnerRendererElement.querySelectorAll("a");
  const channelHandle = channelLinks[0];
  const channelId2 = channelLinks[1];

  const imageElement = channelHandle.querySelector("img") as HTMLImageElement;
  const imageUrl = imageElement.getAttribute("src") || imageElement.src || "";

  const channel: YoutubeChannel = {
    name: channelId2?.innerText,
    handle: channelHandle?.href,
    id: channelId1?.href?.replace("/videos", "") || channelId2.href,
    imageUrl: imageUrl?.replace("=s48", "=s176") || "",
    addedAt: new Date().toISOString(),
  };

  return channel;
}
