import toast from "react-hot-toast";
import {
  ACTIONS,
  CUSTOM_SUBSCRIBE_BUTTON_ID,
  CUSTOM_SUBSCRIBED_BUTTON_ID,
} from "../constants";
import type { Message, Response } from "@/entrypoints/utils/types";
import { getChannelDataFromVideoPage } from "../video/get-channel-data-from-video-page";

type CustomSubscribeButtonClickHandlerVideoPageProps = {
  channelId: string;
  isSubscribed: boolean;
};

export const customSubscribeButtonClickHandlerVideoPage = async ({
  channelId,
  isSubscribed,
}: CustomSubscribeButtonClickHandlerVideoPageProps) => {
  const channelData = await getChannelDataFromVideoPage();
  const customSubscribeButton = document.getElementById(
    isSubscribed ? CUSTOM_SUBSCRIBED_BUTTON_ID : CUSTOM_SUBSCRIBE_BUTTON_ID,
  ) as HTMLDivElement;

  if (isSubscribed) {
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.DELETE_SUBSCRIBED_CHANNEL_BY_ID,
      data: { channelId },
    } satisfies Message);
    if (response.success) {
      customSubscribeButton.textContent = "Subscribe";
      customSubscribeButton.id = CUSTOM_SUBSCRIBE_BUTTON_ID;
    } else {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  } else {
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.ADD_SUBSCRIBED_CHANNEL,
      data: { channel: channelData },
    } satisfies Message);
    if (response.success) {
      customSubscribeButton.textContent = "Subscribed";
      customSubscribeButton.id = CUSTOM_SUBSCRIBED_BUTTON_ID;
    } else {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  }
};
