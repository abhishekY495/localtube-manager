import { addCustomLikeButton } from "./video/add-custom-like-button";
import { checkIfVideoIsLiked } from "./video/check-if-video-is-liked";

export const Init = async () => {
  const url = new URL(window.location.href);

  const params = new URLSearchParams(url.search);
  const videoId = params.get("v");

  if (videoId) {
    const response = await checkIfVideoIsLiked(videoId);
    if (response.success) {
      const isLiked = response.data.isLiked;
      await addCustomLikeButton({ videoId, isLiked });
    }
  }
};
