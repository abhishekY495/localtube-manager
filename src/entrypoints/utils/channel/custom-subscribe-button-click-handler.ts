import toast from "react-hot-toast";
import {
  ACTIONS,
  CUSTOM_SUBSCRIBE_BUTTON_ID,
  CUSTOM_SUBSCRIBED_BUTTON_ID,
} from "../constants";
import type { Message, Response } from "@/entrypoints/utils/types";
import { getChannelDataFromVideoPage } from "../video/get-channel-data-from-video-page";

type CustomSubscribeButtonClickHandlerProps = {
  channelHandle: string;
  isSubscribed: boolean;
};

export const customSubscribeButtonClickHandler = async ({
  channelHandle,
  isSubscribed,
}: CustomSubscribeButtonClickHandlerProps) => {
  const chanelData = await getChannelDataFromVideoPage();
  const customSubscribeButton = document.getElementById(
    isSubscribed ? CUSTOM_SUBSCRIBED_BUTTON_ID : CUSTOM_SUBSCRIBE_BUTTON_ID,
  ) as HTMLDivElement;
  customSubscribeButton.id = isSubscribed
    ? CUSTOM_SUBSCRIBE_BUTTON_ID
    : CUSTOM_SUBSCRIBED_BUTTON_ID;

  if (isSubscribed) {
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.DELETE_SUBSCRIBED_CHANNEL_BY_HANDLE,
      data: { channelHandle },
    } satisfies Message);
    if (response.success) {
      customSubscribeButton.textContent = "Subscribe";
    } else {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  } else {
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.ADD_SUBSCRIBED_CHANNEL,
      data: { channel: chanelData },
    } satisfies Message);
    if (response.success) {
      customSubscribeButton.textContent = "Subscribed";
    } else {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  }
};
