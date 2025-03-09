import { Video } from "@/entrypoints/types";

export function getVideoObj(
  document: Document,
  aboveTheFoldElement: HTMLElement,
  videoUrlSlug: string
) {
  const videoTitle = document.title.replace(" - YouTube", "");
  const videoDurationElement = document.querySelector(
    ".ytp-time-duration"
  ) as HTMLElement;

  const ownerElement = aboveTheFoldElement.querySelector(
    "#owner"
  ) as HTMLElement;
  const videoOwnerRendererElement = ownerElement.querySelector(
    "ytd-video-owner-renderer"
  ) as HTMLElement;
  const channelLinks = videoOwnerRendererElement.querySelectorAll("a");
  const channelHandle = channelLinks[0];
  const channelId2 = channelLinks[1];

  const video: Video = {
    urlSlug: videoUrlSlug || "",
    title: videoTitle,
    duration: videoDurationElement.innerText,
    channelName: channelId2?.innerText,
    channelHandle: channelHandle?.href,
    addedAt: new Date().toISOString(),
  };

  return video;
}
