import {
  ACTIONS,
  CUSTOM_LIKE_BUTTON_ICON_ID,
  likeIcon,
  likeIconFilled,
} from "@/entrypoints/utils/constants";
import { getVideoDataObject } from "./get-video-data-object";
import type { Message } from "@/entrypoints/utils/types";

type CustomLikeBtnClickHandlerProps = {
  videoId: string;
  isLiked: boolean;
};

export const customLikeBtnClickHandler = async ({
  videoId,
  isLiked,
}: CustomLikeBtnClickHandlerProps) => {
  const videoData = await getVideoDataObject(videoId, document);
  const customLikeButtonIcon = document.getElementById(
    CUSTOM_LIKE_BUTTON_ICON_ID,
  ) as HTMLSpanElement;

  if (isLiked) {
    await browser.runtime.sendMessage({
      action: ACTIONS.DELETE_LIKED_VIDEO_BY_ID,
      data: { videoId },
    } satisfies Message);
    customLikeButtonIcon.innerHTML = likeIcon;
  } else {
    await browser.runtime.sendMessage({
      action: ACTIONS.ADD_LIKED_VIDEO,
      data: { video: videoData },
    } satisfies Message);
    customLikeButtonIcon.innerHTML = likeIconFilled;
  }
};
