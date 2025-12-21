import { ResponseData, Video } from "@/entrypoints/types";
import { Notyf } from "notyf";
import { likedIcon, notLikedIcon } from "../../helpers/video/likedUnlikedIcons";

const notyf = new Notyf();

export async function toggleLikedVideo(video: Video, likeBtn: Element) {
  const iconElement = likeBtn.querySelector("#custom-ltm-like-btn-icon");

  try {
    const responseData: ResponseData = await browser.runtime.sendMessage({
      task: "toggleLikedVideo",
      data: { video },
    });
    const { success, data, error } = responseData;

    if (success) {
      const isVideoLiked = data?.isVideoLiked;
      if (isVideoLiked) {
        iconElement?.setAttribute(
          "data-custom-no-login-yt-btn-icon-liked",
          "liked"
        );
        // like icon
        if (iconElement) {
          iconElement.innerHTML = likedIcon;
        }
      } else {
        // unlike icon
        iconElement?.setAttribute(
          "data-custom-no-login-yt-btn-icon-liked",
          "not-liked"
        );
        if (iconElement) {
          iconElement.innerHTML = notLikedIcon;
        }
      }
    } else {
      console.error("Error toggling liked video:", error);
      notyf.open({
        type: "error",
        message: "Something went wrong <br />Please refresh and try again",
        position: { x: "left", y: "bottom" },
        duration: 3000,
        dismissible: true,
        className: "toast-message",
        icon: false,
      });
    }
  } catch (error) {
    console.error("Error toggling liked video:", error);
    notyf.open({
      type: "error",
      message: "Something went wrong <br />Please refresh and try again",
      position: { x: "left", y: "bottom" },
      duration: 3000,
      dismissible: true,
      className: "toast-message",
      icon: false,
    });
  }
}
