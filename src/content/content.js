import "./content.css";

import { getVideoUrl } from "../helpers/getVideoUrl";
import { clickTitle } from "../helpers/clickTitle";
import { removePopupModalContainer } from "../helpers/removePopupModalContainer";
import { getLikedVideos } from "./indexedDB/getLikedVideos";
import { toggleLikeVideo } from "./indexedDB/toggleLikeVideo";

async function setupLikeButtonListener() {
  document.body.addEventListener(
    "click",
    async (event) => {
      const likeBtn = event.target.closest(".YtLikeButtonViewModelHost");
      if (likeBtn) {
        removePopupModalContainer();
        const videoURL = getVideoUrl();
        await toggleLikeVideo(videoURL);
        const videosArr = await getLikedVideos();
        clickTitle();
        console.log("Liked videos:", videosArr);
      }
    },
    { passive: true }
  );
}

// Initial setup
setupLikeButtonListener();

// Listen for URL changes
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log("URL changed:", url);
    // You can add any necessary actions here when the URL changes
  }
}).observe(document, { subtree: true, childList: true });
