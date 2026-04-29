import {
  CUSTOM_SUBSCRIBE_BUTTON_ID,
  CUSTOM_SUBSCRIBED_BUTTON_ID,
} from "../constants";

export const createCustomSubscribeButton = ({
  isSubscribed,
}: {
  isSubscribed: boolean;
}) => {
  const customSubscribeButton = document.createElement("div");
  customSubscribeButton.id = isSubscribed
    ? CUSTOM_SUBSCRIBED_BUTTON_ID
    : CUSTOM_SUBSCRIBE_BUTTON_ID;
  customSubscribeButton.innerHTML = `
    <p>${isSubscribed ? "Subscribed" : "Subscribe"}</p>
  `;
  return customSubscribeButton;
};
