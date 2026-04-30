import {
  ACTIONS,
  CUSTOM_LIKE_BUTTON_ICON_ID,
  LIKE_ICON,
  LIKE_ICON_FILLED,
} from "@/entrypoints/utils/constants";
import { getVideoData } from "./get-video-data";
import type { Message, Response } from "@/entrypoints/utils/types";
import toast from "react-hot-toast";

type CustomLikeButtonClickHandlerProps = {
  videoId: string;
  isLiked: boolean;
};

export const customLikeButtonClickHandler = async ({
  videoId,
  isLiked,
}: CustomLikeButtonClickHandlerProps) => {
  const videoData = await getVideoData(videoId, document);
  const customLikeButtonIcon = document.getElementById(
    CUSTOM_LIKE_BUTTON_ICON_ID,
  ) as HTMLSpanElement;

  if (isLiked) {
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.DELETE_LIKED_VIDEO_BY_ID,
      data: { videoId },
    } satisfies Message);
    if (response.success) {
      customLikeButtonIcon.innerHTML = LIKE_ICON;
    } else {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  } else {
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.ADD_LIKED_VIDEO,
      data: { video: videoData },
    } satisfies Message);
    if (response.success) {
      customLikeButtonIcon.innerHTML = LIKE_ICON_FILLED;
    } else {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  }
};
