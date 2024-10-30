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
      const target = event.target as HTMLElement;
      if (!target) {
        console.log("No Target found");
      }

      const actionsElement = target.closest("#actions-inner") as HTMLElement;
      if (!actionsElement) {
        console.log("No Actions element found");
      }

      const likeBtn = actionsElement?.querySelector(
        ".YtLikeButtonViewModelHost"
      ) as HTMLElement;
      if (!likeBtn) {
        console.log("No Like button found");
      }

      removePopupModalContainer();

      const video = getVideoObj(document);
      await toggleLikeVideo(video, likeBtn);
      clickTitle();

      const videosArr = await getLikedVideos();
      console.log("Liked videos:", videosArr);
    },
    { passive: true }
  );
}

// Initial setup
setupLikeButtonListener();
const urlSlug = getVideoUrlSlug();
const video = await checkIfVideoIsInLikedDB(String(urlSlug));
console.log(video ? "video is liked" : "video not liked");

// Listen for URL changes
let lastUrl = location.href;
new MutationObserver(async () => {
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
