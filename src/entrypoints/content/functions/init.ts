import { getChannelDataFromVideoPage } from "@/entrypoints/utils/video/get-channel-data-from-video-page";
import { checkIfChannelSubscribed } from "./channel/check-if-channel-subscribed";
import { addCustomLikeButton } from "./video/add-custom-like-button";
import { checkIfVideoIsLiked } from "./video/check-if-video-liked";
import { addCustomSubscribeButtonVideoPage } from "./channel/add-custom-subscribe-button-video-page";

export const init = async () => {
  const url = new URL(window.location.href);

  const params = new URLSearchParams(url.search);
  const videoId = params.get("v");

  // videoId i.e we are on a video page
  if (videoId) {
    // check if video liked from video page
    const checkIfVideoLikedResponse = await checkIfVideoIsLiked(videoId);
    if (checkIfVideoLikedResponse.success) {
      const isLiked = checkIfVideoLikedResponse.data.isLiked;
      await addCustomLikeButton({ videoId, isLiked });
    }

    // get channel data from video page
    const { id: channelId } = await getChannelDataFromVideoPage();
    if (channelId) {
      // check if channel subscribed by id
      const checkIfChannelSubscribedResponse =
        await checkIfChannelSubscribed(channelId);
      if (checkIfChannelSubscribedResponse.success) {
        const isSubscribed = checkIfChannelSubscribedResponse.data.isSubscribed;
        await addCustomSubscribeButtonVideoPage({
          channelId,
          isSubscribed,
        });
      }
    }
  }
};
