import { Video } from "../../types";
import { getVideoUrlSlug } from "./getVideoUrlSlug";

export function getVideoObj(
  document: Document,
  aboveTheFoldElement: HTMLElement
) {
  const urlSlug = getVideoUrlSlug();
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
  const channelId = channelLinks[1];

  const video: Video = {
    urlSlug: urlSlug || "",
    title: videoTitle,
    duration: videoDurationElement.innerText,
    channelName: channelId?.innerText,
    addedAt: new Date().toISOString(),
  };

  return video;
}
