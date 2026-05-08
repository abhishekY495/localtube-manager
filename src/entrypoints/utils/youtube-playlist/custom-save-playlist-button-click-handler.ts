import toast from "react-hot-toast";
import {
  ACTIONS,
  CUSTOM_SAVE_PLAYLIST_BUTTON_ICON_ID,
  CUSTOM_SAVE_PLAYLIST_BUTTON_TEXT_ID,
  SAVE_PLAYLIST_ICON,
  SAVE_PLAYLIST_ICON_FILLED,
} from "../constants";
import type { Message, Response } from "../types";
import { getPlaylistData } from "./get-playlist-data";

export const customSavePlaylistButtonClickHandler = async ({
  listId,
  isSaved,
}: {
  listId: string;
  isSaved: boolean;
}) => {
  const playlistData = await getPlaylistData(listId);

  const customSavePlaylistButtonText = document.getElementById(
    CUSTOM_SAVE_PLAYLIST_BUTTON_TEXT_ID,
  ) as HTMLParagraphElement;
  const customSavePlaylistButtonIcon = document.getElementById(
    CUSTOM_SAVE_PLAYLIST_BUTTON_ICON_ID,
  ) as HTMLSpanElement;

  if (isSaved) {
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.DELETE_YOUTUBE_PLAYLIST_BY_ID,
      data: { playlistId: listId },
    } satisfies Message);
    if (response.success) {
      customSavePlaylistButtonIcon.innerHTML = SAVE_PLAYLIST_ICON;
      customSavePlaylistButtonText.textContent = "Save playlist";
    } else {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  } else {
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.ADD_YOUTUBE_PLAYLIST,
      data: { playlist: playlistData },
    } satisfies Message);
    if (response.success) {
      customSavePlaylistButtonIcon.innerHTML = SAVE_PLAYLIST_ICON_FILLED;
      customSavePlaylistButtonText.textContent = "Remove playlist";
    } else {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  }
};
