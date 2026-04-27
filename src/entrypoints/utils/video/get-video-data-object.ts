import type { Video } from "@/entrypoints/utils/types";
import { getChannelDataFromVideoPage } from "./get-channel-data-from-video-page";
import { getVideoDuration } from "./get-video-duration";

export const getVideoDataObject = async (
  videoId: string,
  document: Document,
): Promise<Video> => {
  const videoTitle = document.title.replace(" - YouTube", "");
  const { channelHandle, channelName } = await getChannelDataFromVideoPage();
  const duration = await getVideoDuration();

  return {
    title: videoTitle,
    urlSlug: videoId,
    channelHandle,
    channelName,
    duration,
    addedAt: new Date().toISOString(),
    isShort: document.URL.includes("/shorts/"),
  };
};
