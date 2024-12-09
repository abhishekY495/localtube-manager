import { DotLottie } from "@lottiefiles/dotlottie-web";
import { notLikedIcon } from "../../helpers/video/likedUnlikedIcons";
import { ResponseData, Video } from "../../types";

export async function toggleLikedVideo(video: Video, likeBtn: Element) {
  const iconElement = likeBtn.querySelector("#custom-nologin-yt-like-btn-icon");

  try {
    const responseData: ResponseData = await chrome.runtime.sendMessage({
      task: "toggleLikedVideo",
      data: { video },
    });
    const isVideoLiked = responseData?.data?.isVideoLiked;

    if (isVideoLiked) {
      iconElement?.setAttribute(
        "data-custom-no-login-yt-btn-icon-liked",
        "liked"
      );
      // like animation
      if (iconElement) {
        iconElement.innerHTML = `<canvas id="custom-nologin-yt-dotlottie-canvas" style="width: 58px; height: 58px; margin-top:-16px; margin-left:-16px; margin-right:-18px;"></canvas>`;
        const canvasElement = document.querySelector(
          "#custom-nologin-yt-dotlottie-canvas"
        ) as HTMLCanvasElement;
        new DotLottie({
          autoplay: true,
          loop: false,
          canvas: canvasElement,
          src: chrome.runtime.getURL("./like-animation.json"),
        });
      }
      console.log("Video added to liked videos:", video);
    } else {
      // unlike icon
      iconElement?.setAttribute(
        "data-custom-no-login-yt-btn-icon-liked",
        "not-liked"
      );
      if (iconElement) {
        iconElement.innerHTML = notLikedIcon;
      }
      console.log("Video removed from liked videos:", video.title);
    }
  } catch (error) {
    console.error("Error toggling liked video:", error);
  }
}
