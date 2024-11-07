import { clickTitle } from "../../helpers/clickTitle";
import { getVideoObj } from "../../helpers/getVideoObj";
import { likedIcon } from "../../helpers/likedUnlikedIcons";
import { initializeYoutubeDB } from "./initializeYoutubeDB";
import { toggleLikeVideo } from "./toggleLikeVideo";

let observer: MutationObserver | null = null;

export async function checkIfVideoIsInLikedDB(urlSlug: string) {
  const db = await initializeYoutubeDB();
  const video = await db.get("likedVideos", urlSlug);

  console.log(video ? "Video liked" : "Video not liked");

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Initialize the observer
  observer = new MutationObserver(() => {
    const actionsElement = document.querySelector("#actions-inner");
    if (!actionsElement) return;

    const likeBtn = actionsElement.querySelector(".YtLikeButtonViewModelHost");
    if (!likeBtn) return;

    const iconElement = likeBtn.querySelector(
      ".yt-spec-button-shape-next__icon"
    );
    if (!iconElement) return;

    // Retry mechanism to ensure YouTube has fully rendered the icon element
    const applyIconUpdate = () => {
      if (iconElement.innerHTML !== likedIcon) {
        iconElement.innerHTML = likedIcon;

        // Disconnect the observer if the icon has been updated and listener added
        if (
          likeBtn.hasAttribute("listenerAdded") &&
          iconElement.innerHTML === likedIcon
        ) {
          observer?.disconnect();
        }
      }
    };

    // Add click event listener if not already added
    if (!likeBtn.hasAttribute("listenerAdded")) {
      likeBtn.setAttribute("listenerAdded", "true");
      likeBtn.addEventListener("click", async () => {
        const video = getVideoObj(document);
        await toggleLikeVideo(video, likeBtn);
        clickTitle();
      });
    }

    // Delay execution to avoid conflicts with YouTube’s rendering
    setTimeout(() => {
      if (video) {
        applyIconUpdate();
      } else {
        observer?.disconnect();
      }
    }, 1500);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
