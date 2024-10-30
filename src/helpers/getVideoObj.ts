import { Video } from "../types";
import { getVideoUrlSlug } from "./getVideoUrlSlug";

export function getVideoObj(document: any) {
  const urlSlug = getVideoUrlSlug();
  const videoTitle = document.title.replace(" - YouTube", "");
  const videoDurationElement = document.querySelector(
    ".ytp-time-duration"
  ) as HTMLElement;
  const channelNameElement = document.querySelector(
    ".style-scope.ytd-channel-name.complex-string"
  ) as HTMLElement;

  const video: Video = {
    urlSlug: urlSlug || "",
    title: videoTitle,
    duration: videoDurationElement.innerText,
    channelName: channelNameElement.innerText,
    addedAt: new Date().toISOString(),
  };

  return video;
}
