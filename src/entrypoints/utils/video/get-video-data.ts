import type { Video } from "@/entrypoints/utils/types";
import { getChannelDataFromVideoPage } from "./get-channel-data-from-video-page";
import { getVideoDuration } from "./get-video-duration";

export const getVideoData = async (
  videoId: string,
  document: Document,
): Promise<Video> => {
  const videoTitle = document.title.replace(" - YouTube", "");
  const { handle, name } = await getChannelDataFromVideoPage();
  const duration = await getVideoDuration();

  return {
    title: videoTitle,
    urlSlug: videoId,
    channelHandle: handle,
    channelName: name,
    duration,
    addedAt: new Date().toISOString(),
    isShort: document.URL.includes("/shorts/"),
  };
};
