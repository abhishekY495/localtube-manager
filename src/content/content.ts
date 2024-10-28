import "./content.css";

import { clickTitle } from "../helpers/clickTitle";
import { getLikedVideos } from "./indexedDB/getLikedVideos";
import { toggleLikeVideo } from "./indexedDB/toggleLikeVideo";
import { removePopupModalContainer } from "../helpers/removePopupModalContainer";
import { getVideoObj } from "../helpers/getVideoObj";
import { checkIfVideoIsInLikedDB } from "./indexedDB/checkIfVideoIsInLikedDB";
import { getVideoUrlSlug } from "../helpers/getVideoUrlSlug";

async function setupLikeButtonListener() {
  document.body.addEventListener(
    "click",
    async (event) => {
      const target = event.target as HTMLElement | null;
      if (target) {
        const actionsElement = target.closest("#actions-inner") as HTMLElement;
        if (actionsElement) {
          const likeBtn = actionsElement?.querySelector(
            ".YtLikeButtonViewModelHost"
          ) as HTMLElement;
          if (likeBtn) {
            removePopupModalContainer();

            const video = getVideoObj(document);
            await toggleLikeVideo(video, likeBtn);

            const videosArr = await getLikedVideos();
            clickTitle();

            console.log("Liked videos:", videosArr);
          }
        }
      }
    },
    { passive: true }
  );
}

// Initial setup
setupLikeButtonListener();

// Listen for URL changes
let lastUrl = location.href;
new MutationObserver(async () => {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Document is fully loaded and parsed.");
    // Your code here
  });
  window.addEventListener("load", function () {
    console.log("Entire page and resources are fully loaded.");
    // Your code here
  });
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // console.log("URL changed:", url);
    // You can add any necessary actions here when the URL changes
    const urlSlug = getVideoUrlSlug();
    const video = await checkIfVideoIsInLikedDB(String(urlSlug));
    if (video) {
      console.log("video is liked");
    } else {
      console.log("video not liked");
    }
  }
}).observe(document, { subtree: true, childList: true });
