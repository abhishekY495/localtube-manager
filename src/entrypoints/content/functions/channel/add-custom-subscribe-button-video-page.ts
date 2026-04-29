import { createCustomSubscribeButton } from "@/entrypoints/utils/channel/create-custom-subscribe-button";
import { customSubscribeButtonClickHandler } from "@/entrypoints/utils/channel/custom-subscribe-button-click-handler";
import { clearExistingCustomSubscribeButtons } from "@/entrypoints/utils/clear-existing-custom-buttons";
import { SELECTORS } from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/find-element-by-selectors";

export const addCustomSubscribeButtonVideoPage = async ({
  channelHandle,
  isSubscribed,
}: {
  channelHandle: string;
  isSubscribed: boolean;
}) => {
  const subscribeButtonElement = await findElementBySelectors(
    SELECTORS.SUBSCRIBE_BUTTON_FROM_VIDEO_PAGE_ELEMENTS,
  );

  if (subscribeButtonElement) {
    const customSubscribeButton = createCustomSubscribeButton({ isSubscribed });

    clearExistingCustomSubscribeButtons();
    subscribeButtonElement.appendChild(customSubscribeButton);

    customSubscribeButton.addEventListener("click", async () => {
      await customSubscribeButtonClickHandler({ channelHandle, isSubscribed });
      isSubscribed = !isSubscribed;
    });
  }
};
