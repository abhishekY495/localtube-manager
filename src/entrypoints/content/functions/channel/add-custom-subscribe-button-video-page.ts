import { createCustomSubscribeButton } from "@/entrypoints/utils/channel/create-custom-subscribe-button";
import { customSubscribeButtonClickHandlerVideoPage } from "@/entrypoints/utils/channel/custom-subscribe-button-click-handler-video-page";
import { clearExistingCustomSubscribeButtons } from "@/entrypoints/utils/clear-existing-custom-buttons";
import { SELECTORS } from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/find-element-by-selectors";

export const addCustomSubscribeButtonVideoPage = async ({
  channelId,
  isSubscribed,
}: {
  channelId: string;
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
      await customSubscribeButtonClickHandlerVideoPage({
        channelId,
        isSubscribed,
      });
      isSubscribed = !isSubscribed;
    });
  }
};
