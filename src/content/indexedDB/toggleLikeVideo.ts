import { DotLottie } from "@lottiefiles/dotlottie-web";
import { Video } from "../../types";
import { initializeYoutubeDB } from "./initializeYoutubeDB";
import { notLikedIcon } from "../../helpers/likedUnlikedIcons";

export async function toggleLikeVideo(video: Video, likeBtn: Element) {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("likedVideos", "readwrite");
  const likedVideosStore = tx.objectStore("likedVideos");
  const iconElement = likeBtn.querySelector(".yt-spec-button-shape-next__icon");

  try {
    const existingVideo = await likedVideosStore.get(video.urlSlug);
    if (existingVideo) {
      await likedVideosStore.delete(video.urlSlug);
      // unlike icon
      if (iconElement) {
        iconElement.innerHTML = notLikedIcon;
      }
      console.log("Video removed from liked videos:", existingVideo);
    } else {
      await likedVideosStore.add(video);
      // like animation
      if (iconElement) {
        iconElement.innerHTML = `<canvas id="dotlottie-canvas" style="width: 58px; height: 58px; margin-top:-16px; margin-left:-16px"></canvas>`;
        const canvasElement = document.querySelector(
          "#dotlottie-canvas"
        ) as HTMLCanvasElement;
        new DotLottie({
          autoplay: true,
          loop: false,
          canvas: canvasElement,
          src: "https://gist.githubusercontent.com/abhishekY495/4e81dcc28b3b557c49721dd1051883ab/raw/140a41d7269f6476e9a669ddf5ee102c7cbd2441/like-animation.json",
        });
      }
      console.log("Video added to liked videos:", video);
    }
    await tx.done;
  } catch (error) {
    console.error("Error toggling liked video:", error);
  }
}
