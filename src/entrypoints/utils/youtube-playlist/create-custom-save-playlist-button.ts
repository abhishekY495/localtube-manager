import {
  CUSTOM_SAVE_PLAYLIST_BUTTON_ICON_ID,
  CUSTOM_SAVE_PLAYLIST_BUTTON_ID,
  CUSTOM_SAVE_PLAYLIST_BUTTON_TEXT_ID,
  SAVE_PLAYLIST_ICON,
  SAVE_PLAYLIST_ICON_FILLED,
} from "../constants";

export const createCustomSavePlaylistButton = ({
  isSaved,
}: {
  isSaved: boolean;
}) => {
  const customSavePlaylistButton = document.createElement("div");
  customSavePlaylistButton.id = CUSTOM_SAVE_PLAYLIST_BUTTON_ID;
  customSavePlaylistButton.innerHTML = `
    <span id="${CUSTOM_SAVE_PLAYLIST_BUTTON_ICON_ID}">${isSaved ? SAVE_PLAYLIST_ICON_FILLED : SAVE_PLAYLIST_ICON}</span>
    <p id="${CUSTOM_SAVE_PLAYLIST_BUTTON_TEXT_ID}">${isSaved ? "Remove playlist" : "Save playlist"}</p>
  `;
  return customSavePlaylistButton;
};
