import {
  ACTIONS,
  CUSTOM_LIKE_BUTTON_ID,
  SELECTORS,
} from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/findElementBySelectors";
import type {
  CheckIfVideoIsLikedResponse,
  Message,
  Response,
} from "@/entrypoints/utils/types";
import { customLikeBtn } from "../../helpers/video/custom-like-btn";
import { getVideoDataObject } from "../../helpers/video/get-video-data-object";

export const checkIfVideoIsLiked = async (videoId: string) => {
  const response: Response<CheckIfVideoIsLikedResponse> =
    await browser.runtime.sendMessage({
      action: ACTIONS.CHECK_IF_VIDEO_IS_LIKED,
      data: { videoId },
    } satisfies Message);

  if (response.success) {
    const likeButtonElement = await findElementBySelectors(
      SELECTORS.LIKE_BTN_ELEMENTS,
    );
    const { isLiked } = response.data;

    if (likeButtonElement) {
      document
        .querySelectorAll(`#${CUSTOM_LIKE_BUTTON_ID}`)
        .forEach((customLikeButton) => customLikeButton.remove());

      const likeCountElement = await findElementBySelectors(
        SELECTORS.LIKE_COUNT_ELEMENTS,
      );
      const likeCount = likeCountElement?.textContent ?? "0";
      const customLikeButton = customLikeBtn({ likeCount, isLiked });

      likeButtonElement.insertBefore(
        customLikeButton,
        likeButtonElement.children[1],
      );

      customLikeButton.addEventListener("click", async () => {
        const videoData = await getVideoDataObject(videoId, document);
        console.log(videoData);
      });
    }
  }
};
