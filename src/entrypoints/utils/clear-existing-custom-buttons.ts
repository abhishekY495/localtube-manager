import {
  ADD_TO_LOCAL_PLAYLIST_MODAL_UNMOUNT_EVENT,
  CUSTOM_ADD_TO_LOCAL_PLAYLIST_BUTTON_ID,
  CUSTOM_ADD_TO_LOCAL_PLAYLIST_MODAL_ID,
  CUSTOM_LIKE_BUTTON_ID,
  CUSTOM_SAVE_PLAYLIST_BUTTON_ID,
  CUSTOM_SUBSCRIBE_BUTTON_ID,
  CUSTOM_SUBSCRIBED_BUTTON_ID,
} from "./constants";

export const clearExistingCustomLikedButton = () => {
  document
    .querySelectorAll(`#${CUSTOM_LIKE_BUTTON_ID}`)
    .forEach((customLikeButton) => customLikeButton.remove());
};

export const clearExistingCustomSubscribeButtons = () => {
  document
    .querySelectorAll(`#${CUSTOM_SUBSCRIBE_BUTTON_ID}`)
    .forEach((customSubscribeButton) => customSubscribeButton.remove());
  document
    .querySelectorAll(`#${CUSTOM_SUBSCRIBED_BUTTON_ID}`)
    .forEach((customSubscribeButton) => customSubscribeButton.remove());
};

export const clearExistingCustomSavePlaylistButton = () => {
  document
    .querySelectorAll(`#${CUSTOM_SAVE_PLAYLIST_BUTTON_ID}`)
    .forEach((customSavePlaylistButton) => customSavePlaylistButton.remove());
};

export const clearExistingCustomAddToLocalPlaylistButton = () => {
  document
    .querySelectorAll(`#${CUSTOM_ADD_TO_LOCAL_PLAYLIST_BUTTON_ID}`)
    .forEach((customAddToLocalPlaylistButton) =>
      customAddToLocalPlaylistButton.remove(),
    );
};

export const clearExistingCustomLocalPlaylistModal = () => {
  document
    .querySelectorAll(`#${CUSTOM_ADD_TO_LOCAL_PLAYLIST_MODAL_ID}`)
    .forEach((customAddToLocalPlaylistModal) => {
      customAddToLocalPlaylistModal.dispatchEvent(
        new Event(ADD_TO_LOCAL_PLAYLIST_MODAL_UNMOUNT_EVENT),
      );
      customAddToLocalPlaylistModal.remove();
    });
};
