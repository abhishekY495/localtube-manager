import { clickTitle } from "../../helpers/clickTitle";
import { getVideoObj } from "../../helpers/getVideoObj";
import { likedIcon, notLikedIcon } from "../../helpers/likedUnlikedIcons";
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

  setTimeout(() => {
    observer = new MutationObserver(() => {
      const aboveTheFoldElement = document.querySelector(
        "#above-the-fold"
      ) as HTMLElement;
      if (aboveTheFoldElement === null) {
        console.log("aboveTheFoldElement not found");
        return;
      }
      console.log(aboveTheFoldElement);

      const YtdMenuRenderer = aboveTheFoldElement.querySelector(
        "ytd-menu-renderer"
      ) as HTMLElement;
      if (YtdMenuRenderer === null) {
        console.log("YtdMenuRenderer not found");
        return;
      }
      console.log(YtdMenuRenderer);

      const likeButtonViewModelHost = YtdMenuRenderer.querySelector(
        "like-button-view-model"
      ) as HTMLElement;
      if (likeButtonViewModelHost === null) {
        console.log("likeButtonViewModelHost not found");
        return;
      }
      console.log(likeButtonViewModelHost);

      const likeCountElement = document.querySelector(
        '[aria-label*="likes"]'
      ) as HTMLElement;
      if (likeCountElement === null) {
        console.log("likeCountElement not found");
        return;
      }
      const likeCount = likeCountElement.querySelector(
        ".YtwFactoidRendererValue"
      ) as HTMLElement;
      if (likeCount === null) {
        console.log("likeCount not found");
        return;
      }
      console.log(likeCount?.innerText);

      likeButtonViewModelHost.innerHTML = `
      <div id="custom-nologin-yt-like-btn">
        <div id="custom-nologin-yt-like-btn-icon" data-custom-no-login-yt-btn-icon-liked=${
          video ? "initial-liked" : "initial-not-liked"
        }>${video ? likedIcon : notLikedIcon}</div>
        <div id="custom-nologin-yt-like-count">
        ${likeCount?.innerText}
        </div>
      </div>
      `;

      const likeBtn = document.querySelector(
        "#custom-nologin-yt-like-btn"
      ) as HTMLElement;
      likeBtn.addEventListener("click", async () => {
        const video = getVideoObj(document);
        await toggleLikeVideo(video, likeBtn);
        clickTitle();
      });

      observer?.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }, 1500);
}
