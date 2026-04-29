import {
  CUSTOM_LIKE_BUTTON_ID,
  SELECTORS,
} from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/find-element-by-selectors";
import { createCustomLikeButton } from "@/entrypoints/utils/video/create-custom-like-button";
import { customLikeButtonClickHandler } from "@/entrypoints/utils/video/custom-like-button-click-handler";

export const addCustomLikeButton = async ({
  videoId,
  isLiked,
}: {
  videoId: string;
  isLiked: boolean;
}) => {
  let likeCount;
  const likeButtonElement = await findElementBySelectors(
    SELECTORS.LIKE_BUTTON_ELEMENTS,
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

    const customLikeButton = createCustomLikeButton({ likeCount, isLiked });

    // Remove existing custom like and then insert
    document
      .querySelectorAll(`#${CUSTOM_LIKE_BUTTON_ID}`)
      .forEach((customLikeButton) => customLikeButton.remove());
    likeButtonElement.insertBefore(
      customLikeButton,
      likeButtonElement.children[1],
    );

    customLikeButton.addEventListener("click", async () => {
      await customLikeButtonClickHandler({ videoId, isLiked });
      isLiked = !isLiked;
    });
  }
};
