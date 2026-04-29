import { customSubscribeBtn } from "@/entrypoints/utils/channel/custom-subscribe-btn";
import { customSubscribeBtnClickHandler } from "@/entrypoints/utils/channel/custom-subscribe-btn-click-handler";
import {
  CUSTOM_SUBSCRIBE_BUTTON_ID,
  CUSTOM_SUBSCRIBED_BUTTON_ID,
  SELECTORS,
} from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/find-element-by-selectors";

export const addCustomSubscribeButtonVideoPage = async ({
  channelHandle,
  isSubscribed,
}: {
  channelHandle: string;
  isSubscribed: boolean;
}) => {
  const subscribeButtonElement = await findElementBySelectors(
    SELECTORS.SUBSCRIBE_BTN_FROM_VIDEO_PAGE_ELEMENTS,
  );

  if (subscribeButtonElement) {
    const customSubscribeButton = customSubscribeBtn({ isSubscribed });

    // Remove existing custom subscribe and then insert
    document
      .querySelectorAll(`#${CUSTOM_SUBSCRIBE_BUTTON_ID}`)
      .forEach((customSubscribeButton) => customSubscribeButton.remove());
    document
      .querySelectorAll(`#${CUSTOM_SUBSCRIBED_BUTTON_ID}`)
      .forEach((customSubscribeButton) => customSubscribeButton.remove());
    subscribeButtonElement.appendChild(customSubscribeButton);

    customSubscribeButton.addEventListener("click", async () => {
      await customSubscribeBtnClickHandler({ channelHandle, isSubscribed });
      isSubscribed = !isSubscribed;
    });
  }
};
