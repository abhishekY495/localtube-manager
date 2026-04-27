import { checkIfVideoIsLiked } from "./video/check-if-video-is-liked";

export const Init = async () => {
  const url = new URL(window.location.href);

  const params = new URLSearchParams(url.search);
  const videoId = params.get("v");

  if (videoId) {
    checkIfVideoIsLiked(videoId);
  }
};
