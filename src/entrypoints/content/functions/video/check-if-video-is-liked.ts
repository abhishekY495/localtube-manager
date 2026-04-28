import { ACTIONS } from "@/entrypoints/utils/constants";
import type {
  CheckIfVideoIsLikedResponse,
  Message,
  Response,
} from "@/entrypoints/utils/types";

export const checkIfVideoIsLiked = async (videoId: string) => {
  const response: Response<CheckIfVideoIsLikedResponse> =
    await browser.runtime.sendMessage({
      action: ACTIONS.CHECK_IF_VIDEO_IS_LIKED,
      data: { videoId },
    } satisfies Message);

  return response;
};
