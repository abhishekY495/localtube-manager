import { ACTIONS } from "@/entrypoints/utils/constants";
import type {
  CheckIfYoutubePlaylistIsSavedResponse,
  Message,
  Response,
} from "@/entrypoints/utils/types";

export const checkIfYoutubePlaylistIsSaved = async (listId: string) => {
  const response: Response<CheckIfYoutubePlaylistIsSavedResponse> =
    await browser.runtime.sendMessage({
      action: ACTIONS.CHECK_IF_YOUTUBE_PLAYLIST_IS_SAVED,
      data: { listId },
    } satisfies Message);
  return response;
};
