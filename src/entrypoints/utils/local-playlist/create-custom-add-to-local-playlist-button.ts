import {
  ADD_TO_LOCAL_PLAYLIST_ICON,
  CUSTOM_ADD_TO_LOCAL_PLAYLIST_BUTTON_ID,
} from "../constants";

export const createCustomAddToLocalPlaylistButton = () => {
  const customAddToLocalPlaylistButton = document.createElement("div");
  customAddToLocalPlaylistButton.id = CUSTOM_ADD_TO_LOCAL_PLAYLIST_BUTTON_ID;
  customAddToLocalPlaylistButton.innerHTML = `
    <span>${ADD_TO_LOCAL_PLAYLIST_ICON}</span>
    <p>Add to</p>
  `;
  return customAddToLocalPlaylistButton;
};
