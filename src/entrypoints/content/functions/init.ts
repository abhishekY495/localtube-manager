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
  }
};
