import { getVideoObj } from "../../helpers/video/getVideoObj";
import { likedIcon, notLikedIcon } from "../../helpers/video/likedUnlikedIcons";
import { initializeYoutubeDB } from "../initializeYoutubeDB";
import { toggleLikedVideo } from "./toggleLikedVideo";

let observer: MutationObserver | null = null;

export async function checkIfVideoLiked(urlSlug: string) {
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
      // console.log(aboveTheFoldElement);

      const YtdMenuRenderer = aboveTheFoldElement.querySelector(
        "ytd-menu-renderer"
      ) as HTMLElement;
      if (YtdMenuRenderer === null) {
        console.log("YtdMenuRenderer not found");
        return;
      }
      // console.log(YtdMenuRenderer);

      const likeButtonViewModelHost = YtdMenuRenderer.querySelector(
        "like-button-view-model"
      ) as HTMLElement;
      if (likeButtonViewModelHost === null) {
        console.log("likeButtonViewModelHost not found");
        return;
      }
      // console.log(likeButtonViewModelHost);

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
          ".YtwFactoidRendererValue"
        ) as HTMLElement;
        if (likeCount === null) {
          console.log("likeCount not found");
          return;
        }
        likeCount = likeCount?.innerText;
      } else {
        likeCount = likeCountElementInYtdMenuRenderer?.innerText;
      }
      // console.log(likeCount?.innerText);

      // setting custom liked/notliked icons
      likeButtonViewModelHost.innerHTML = `
      <div id="custom-nologin-yt-like-btn">
        <div id="custom-nologin-yt-like-btn-icon" data-custom-no-login-yt-btn-icon-liked=${
          video ? "initial-liked" : "initial-not-liked"
        }>${video ? likedIcon : notLikedIcon}</div>
        <div id="custom-nologin-yt-like-count">
        ${likeCount}
        </div>
      </div>
      `;
      likeButtonViewModelHost.style.display = "block";

      const likeBtn = document.querySelector(
        "#custom-nologin-yt-like-btn"
      ) as HTMLElement;
      likeBtn.addEventListener("click", async () => {
        const video = getVideoObj(document);
        await toggleLikedVideo(video, likeBtn);
      });

      observer?.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }, 1800);
}
