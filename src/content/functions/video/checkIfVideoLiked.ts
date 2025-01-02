import { getVideoObj } from "../../helpers/video/getVideoObj";
import { likedIcon, notLikedIcon } from "../../helpers/video/likedUnlikedIcons";
import { ResponseData } from "../../../types";
import { toggleLikedVideo } from "./toggleLikedVideo";

let observer: MutationObserver | null = null;
let isProcessing = false;
let debounceTimeout: number | undefined;

export async function checkIfVideoLiked(urlSlug: string) {
  const responseData: ResponseData = await chrome.runtime.sendMessage({
    task: "checkIfVideoLiked",
    data: { urlSlug },
  });
  const isVideoLiked = responseData?.data?.isVideoLiked;
  console.log(isVideoLiked ? "Video liked" : "Video not liked");

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  async function handleLikeElements() {
    // If already processing, skip
    if (isProcessing) return;

    try {
      isProcessing = true;

      const aboveTheFoldElement = document.querySelector(
        "#above-the-fold"
      ) as HTMLElement;
      if (aboveTheFoldElement === null) {
        console.log("aboveTheFoldElement not found");
        return;
      }
      // console.log(aboveTheFoldElement);

      const YtdMenuRenderer = aboveTheFoldElement.querySelector(
        "ytd-menu-renderer"
      ) as HTMLElement;
      if (YtdMenuRenderer === null) {
        console.log("YtdMenuRenderer not found");
        return;
      }
      // console.log(YtdMenuRenderer);

      const topLevelButtonsComputedElement = YtdMenuRenderer.querySelector(
        "#top-level-buttons-computed"
      ) as HTMLElement;
      if (topLevelButtonsComputedElement === null) {
        console.log("topLevelButtonsComputedElement not found");
        return;
      }
      // console.log(topLevelButtonsComputedElement);

      // like count
      let likeCountElement = null;
      let likeCountElementInYtdMenuRenderer = null;
      let likeCount = null;

      likeCountElement = document.querySelector(
        '[aria-label*="likes"]'
      ) as HTMLElement;
      if (likeCountElement === null) {
        console.log("likeCountElement not found");

        // searching like count in YtdMenuRenderer
        likeCountElementInYtdMenuRenderer = YtdMenuRenderer.querySelector(
          ".yt-spec-button-shape-next__button-text-content"
        ) as HTMLElement;
        if (likeCountElementInYtdMenuRenderer === null) {
          console.log("likeCountElementInYtdMenuRenderer not found");
          return;
        }
      }

      if (likeCountElement) {
        likeCount = likeCountElement.querySelector(
          ".ytwFactoidRendererValue"
        ) as HTMLElement;
        if (likeCount === null) {
          console.log("likeCount not found");
          return;
        }
        likeCount = likeCount?.innerText;
      } else {
        likeCount = likeCountElementInYtdMenuRenderer?.innerText;
      }
      // console.log(likeCount);

      const likeDislikeButtonsWrapper = YtdMenuRenderer.querySelector(
        ".ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper"
      ) as HTMLElement;
      if (likeDislikeButtonsWrapper === null) {
        console.log("likeDislikeButtonsWrapper not found");
        return;
      }
      // console.log(likeDislikeButtonsWrapper);

      // remove previous liked btn
      const myCustomLikeButton = document.querySelectorAll(
        "#custom-nologin-yt-like-btn"
      );
      if (myCustomLikeButton.length !== 0) {
        myCustomLikeButton.forEach((button) => button.remove());
        console.log("removed previous like btn");
      } else {
        console.log("no previous like btn found.");
      }

      // create new liked button with icon
      const customLikeButtonWrapper = document.createElement("div");
      customLikeButtonWrapper.id = "custom-nologin-yt-like-btn";
      customLikeButtonWrapper.innerHTML = `
        <div id="custom-nologin-yt-like-btn-icon" data-custom-no-login-yt-btn-icon-liked=${
          isVideoLiked ? "initial-liked" : "initial-not-liked"
        }>${isVideoLiked ? likedIcon : notLikedIcon}
        </div>
        <div id="custom-nologin-yt-like-count">${likeCount}</div>
      `;

      // add click handler
      customLikeButtonWrapper.addEventListener("click", async () => {
        const video = getVideoObj(document, aboveTheFoldElement);
        await toggleLikedVideo(video, customLikeButtonWrapper);
      });

      // insert created btn
      topLevelButtonsComputedElement.insertBefore(
        customLikeButtonWrapper,
        topLevelButtonsComputedElement.firstChild
      );

      if (observer) {
        observer?.disconnect();
        observer = null;
        console.log("video observer disconnected");
      }
    } finally {
      isProcessing = false;
    }
  }

  // Debounce function to limit how often we process mutations
  function debounceHandler() {
    window.clearTimeout(debounceTimeout);
    debounceTimeout = window.setTimeout(handleLikeElements, 100);
  }

  // Create new observer
  observer = new MutationObserver(debounceHandler);
  observer.observe(document.body, { childList: true, subtree: true });
}
