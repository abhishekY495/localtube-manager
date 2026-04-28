import { ACTIONS } from "@/entrypoints/utils/constants";
import { Message } from "@/entrypoints/utils/types";

export const checkIfChannelSubscribed = async (channelHandle: string) => {
  const response = await browser.runtime.sendMessage({
    action: ACTIONS.CHECK_IF_CHANNEL_SUBSCRIBED,
    data: { channelHandle },
  } satisfies Message);
  return response;
};
