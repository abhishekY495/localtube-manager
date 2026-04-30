import { createCustomSubscribeButton } from "@/entrypoints/utils/channel/create-custom-subscribe-button";
import { customSubscribeButtonClickHandlerChannelPage } from "@/entrypoints/utils/channel/custom-subscribe-button-click-handler-channel-page";
import { clearExistingCustomSubscribeButtons } from "@/entrypoints/utils/clear-existing-custom-buttons";
import { SELECTORS } from "@/entrypoints/utils/constants";
import { findElementBySelectors } from "@/entrypoints/utils/find-element-by-selectors";

export const addCustomSubscribeButtonChannelPage = async ({
  channelId,
  isSubscribed,
}: {
  channelId: string;
  isSubscribed: boolean;
}) => {
  const subscribeButtonElement = await findElementBySelectors(
    SELECTORS.SUBSCRIBE_BUTTON_FROM_CHANNEL_PAGE_ELEMENTS,
  );

  if (subscribeButtonElement) {
    const customSubscribeButton = createCustomSubscribeButton({
      isSubscribed,
      isChannelPage: true,
    });

    clearExistingCustomSubscribeButtons();
    subscribeButtonElement.insertBefore(
      customSubscribeButton,
      subscribeButtonElement.children[1],
    );

    customSubscribeButton.addEventListener("click", async () => {
      customSubscribeButtonClickHandlerChannelPage({ channelId, isSubscribed });
      isSubscribed = !isSubscribed;
    });
  }
};
