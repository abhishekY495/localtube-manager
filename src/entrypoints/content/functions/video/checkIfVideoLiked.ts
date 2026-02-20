import { ResponseData } from "@/entrypoints/types";
import { waitForAllElements } from "../../helpers/waitForAllElements";
import { likedIcon, notLikedIcon } from "../../helpers/video/likedUnlikedIcons";
import { getVideoObj } from "../../helpers/video/getVideoObj";
import { toggleLikedVideo } from "./toggleLikedVideo";

const selectors = [
  "#above-the-fold",
  "ytd-menu-renderer",
  "#top-level-buttons-computed",
];

export async function checkIfVideoLiked(urlSlug: string) {
  console.log("🎬 Starting checkIfVideoLiked");

  // Check video liked status
  const responseData: ResponseData = await browser.runtime.sendMessage({
    task: "checkIfVideoLiked",
    data: { urlSlug },
  });
  const isVideoLiked = responseData?.data?.isVideoLiked;
  console.log(`💾 Video liked status: ${isVideoLiked ? "Liked" : "Not Liked"}`);

  // Wait for all elements to be loaded
  await waitForAllElements(selectors);
  console.log("✨ All video elements are ready");

  try {
    // Now we can safely get all elements
    const aboveTheFoldElement = document.querySelector(
      selectors[0],
    ) as HTMLElement;
    const YtdMenuRenderer = aboveTheFoldElement.querySelector(
      selectors[1],
    ) as HTMLElement;
    const topLevelButtonsComputedElement = YtdMenuRenderer.querySelector(
      selectors[2],
    ) as HTMLElement;

    // like count
    let likeCount: string = "1K";
    const likeCountElement = document.querySelector(
      '[aria-label*="likes"]',
    ) as HTMLElement;
    const likeCountElementInYtdMenuRenderer = YtdMenuRenderer.querySelector(
      ".yt-spec-button-shape-next__button-text-content",
    ) as HTMLElement;
    if (likeCountElement) {
      const ariaLabelValue = likeCountElement.getAttribute("aria-label");
      likeCount =
        String(ariaLabelValue?.split(" ")[0]) +
        String(
          ariaLabelValue?.split(" ")[1] === "million"
            ? "M"
            : String(ariaLabelValue?.split(" ")[1] === "thousand" ? "K" : ""),
        );
    } else {
      likeCount = likeCountElementInYtdMenuRenderer?.innerText;
    }

    // Remove any existing buttons
    const myCustomLikeButtons = document.querySelectorAll(
      "#custom-ltm-like-btn",
    );
    if (myCustomLikeButtons.length > 0) {
      console.log(
        `🗑️ Removing ${myCustomLikeButtons.length} existing button(s)`,
      );
      myCustomLikeButtons.forEach((button) => button.remove());
    }

    // Create and append new button
    console.log("🎨 Creating new like button");
    const customLikeButtonWrapper = document.createElement("div");
    customLikeButtonWrapper.id = "custom-ltm-like-btn";
    customLikeButtonWrapper.innerHTML = `
        <div id="custom-ltm-like-btn-icon" data-custom-no-login-yt-btn-icon-liked=${
          isVideoLiked ? "initial-liked" : "initial-not-liked"
        }>${isVideoLiked ? likedIcon : notLikedIcon}
        </div>
        <div id="custom-ltm-like-count">${likeCount}</div>
      `;
    topLevelButtonsComputedElement.insertBefore(
      customLikeButtonWrapper,
      topLevelButtonsComputedElement.firstChild,
    );
    console.log("✅ Like button added to page");

    // Add click event listener
    customLikeButtonWrapper.addEventListener("click", async () => {
      console.log("👆 Like button clicked");
      const video = getVideoObj(document, aboveTheFoldElement, urlSlug);
      await toggleLikedVideo(video, customLikeButtonWrapper);
    });
  } catch (error) {
    console.log(error);
  }
}
