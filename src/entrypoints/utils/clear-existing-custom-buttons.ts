import {
  CUSTOM_LIKE_BUTTON_ID,
  CUSTOM_SUBSCRIBE_BUTTON_ID,
  CUSTOM_SUBSCRIBED_BUTTON_ID,
} from "./constants";

export const clearExistingCustomLikedButton = () => {
  document
    .querySelectorAll(`#${CUSTOM_LIKE_BUTTON_ID}`)
    .forEach((customLikeButton) => customLikeButton.remove());
};

export const clearExistingCustomSubscribeButtonsFromVideoPage = () => {
  document
    .querySelectorAll(`#${CUSTOM_SUBSCRIBE_BUTTON_ID}`)
    .forEach((customSubscribeButton) => customSubscribeButton.remove());
  document
    .querySelectorAll(`#${CUSTOM_SUBSCRIBED_BUTTON_ID}`)
    .forEach((customSubscribeButton) => customSubscribeButton.remove());
};
