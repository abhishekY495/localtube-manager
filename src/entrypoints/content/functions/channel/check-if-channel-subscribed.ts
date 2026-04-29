import { ACTIONS } from "@/entrypoints/utils/constants";
import type {
  CheckIfChannelSubscribedResponse,
  Message,
  Response,
} from "@/entrypoints/utils/types";

export const checkIfChannelSubscribed = async (id: string) => {
  const response: Response<CheckIfChannelSubscribedResponse> =
    await browser.runtime.sendMessage({
      action: ACTIONS.CHECK_IF_CHANNEL_SUBSCRIBED,
      data: { id },
    } satisfies Message);
  return response;
};
