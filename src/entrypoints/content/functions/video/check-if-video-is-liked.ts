import {
  ACTIONS,
  CUSTOM_LIKE_BUTTON_ID,
  SELECTORS,
} from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/find-element-by-selectors";
import type {
  CheckIfVideoIsLikedResponse,
  Message,
  Response,
} from "@/entrypoints/utils/types";
import { customLikeBtn } from "../../../utils/video/custom-like-btn";
import { customLikeBtnClickHandler } from "../../../utils/video/custom-like-btn-click-handler";

export const checkIfVideoIsLiked = async (videoId: string) => {
  const response: Response<CheckIfVideoIsLikedResponse> =
    await browser.runtime.sendMessage({
      action: ACTIONS.CHECK_IF_VIDEO_IS_LIKED,
      data: { videoId },
    } satisfies Message);

  if (response.success) {
    let isLiked = response.data.isLiked;
    let likeCount = "0";
    const likeButtonElement = await findElementBySelectors(
      SELECTORS.LIKE_BTN_ELEMENTS,
    );

    if (likeButtonElement) {
      const likeCountElement1 = await findElementBySelectors(
        SELECTORS.LIKE_COUNT_ELEMENTS_1,
      );
      if (likeCountElement1) {
        likeCount = likeCountElement1.textContent;
      } else {
        const likeCountElement2 = await findElementBySelectors(
          SELECTORS.LIKE_COUNT_ELEMENTS_2,
        );
        likeCount = likeCountElement2?.textContent ?? "0";
      }

      const customLikeButton = customLikeBtn({ likeCount, isLiked });

      // Remove existing custom like and then insert
      document
        .querySelectorAll(`#${CUSTOM_LIKE_BUTTON_ID}`)
        .forEach((customLikeButton) => customLikeButton.remove());
      likeButtonElement.insertBefore(
        customLikeButton,
        likeButtonElement.children[1],
      );

      customLikeButton.addEventListener("click", async () => {
        await customLikeBtnClickHandler({ videoId, isLiked });
        isLiked = !isLiked;
      });
    }
  }
};
