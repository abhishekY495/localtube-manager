import { ACTIONS } from "../utils/constants";
import type {
  CheckIfVideoIsLikedResponse,
  Message,
  Response,
} from "../utils/types";

export const checkIfVideoIsLiked = async (videoId: string) => {
  const response: Response<CheckIfVideoIsLikedResponse> =
    await browser.runtime.sendMessage({
      action: ACTIONS.CHECK_IF_VIDEO_IS_LIKED,
      data: { videoId },
    } satisfies Message);

  if (response.success) {
    console.log(response.data);
  }

  //   return response.data;
};
