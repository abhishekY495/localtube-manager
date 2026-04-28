import { getChannelDataFromVideoPage } from "@/entrypoints/utils/video/get-channel-data-from-video-page";
import { checkIfChannelSubscribed } from "./channel/check-if-channel-subscribed";
import { addCustomLikeButton } from "./video/add-custom-like-button";
import { checkIfVideoIsLiked } from "./video/check-if-video-liked";

export const Init = async () => {
  const url = new URL(window.location.href);

  const params = new URLSearchParams(url.search);
  const videoId = params.get("v");

  if (videoId) {
    // check if video liked from video page
    const checkIfVideoLikedResponse = await checkIfVideoIsLiked(videoId);
    if (checkIfVideoLikedResponse.success) {
      const isLiked = checkIfVideoLikedResponse.data.isLiked;
      await addCustomLikeButton({ videoId, isLiked });
    }

    // check if channel subscribed from video page
    const { channelHandle } = await getChannelDataFromVideoPage();
    if (channelHandle) {
      const checkIfChannelSubscribedResponse =
        await checkIfChannelSubscribed(channelHandle);
    }
    // if (checkIfChannelSubscribedResponse.success) {
    //   const isSubscribed = checkIfChannelSubscribedResponse.data.isSubscribed;
    //   await addCustomSubscribeButton({ isSubscribed });
    // }
  }
};
