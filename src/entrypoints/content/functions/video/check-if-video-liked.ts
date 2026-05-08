import { ACTIONS } from "@/entrypoints/utils/constants";
import type {
  CheckIfVideoLikedResponse,
  Message,
  Response,
} from "@/entrypoints/utils/types";

export const checkIfVideoIsLiked = async (videoId: string) => {
  const response: Response<CheckIfVideoLikedResponse> =
    await browser.runtime.sendMessage({
      action: ACTIONS.CHECK_IF_VIDEO_LIKED,
      data: { videoId },
    } satisfies Message);

  return response;
};
