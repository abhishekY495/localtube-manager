import { likedIcon } from "../../helpers/likedUnlikedIcons";
import { initializeYoutubeDB } from "./initializeYoutubeDB";

export async function checkIfVideoIsInLikedDB(urlSlug: string) {
  const db = await initializeYoutubeDB();
  const video = await db.get("likedVideos", urlSlug);

  new MutationObserver((mutations, observer) => {
    const actionsElement = document.querySelector("#actions-inner");
    if (!actionsElement) {
      console.log("Waiting for actions element...");
      return; // Exit early, continue observing
    }

    const likeBtn = actionsElement.querySelector(".YtLikeButtonViewModelHost");
    if (!likeBtn) {
      console.log("Waiting for like button...");
      return; // Exit early, continue observing
    }

    const iconElement = likeBtn.querySelector(
      ".yt-spec-button-shape-next__icon"
    );
    if (!iconElement) {
      console.log("Waiting for icon element...");
      return; // Exit early, continue observing
    }

    setTimeout(() => {
      if (video) {
        iconElement.innerHTML = likedIcon;
        console.log("Icon updated with likedIcon after delay");
      }
    }, 1000);
    observer.disconnect(); // Stop observing as everything loaded successfully
  }).observe(document.body, { childList: true, subtree: true });

  return video ? true : false;
}
