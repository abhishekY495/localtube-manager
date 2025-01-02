import { Notyf } from "notyf";
import { LocalPlaylistNotDetailed, ResponseData } from "../../../types";
import { notSavedPlaylistIcon } from "../../../helpers/playlist/savedNotsavedPlaylistIcon";
import { getVideoObj } from "../../../helpers/video/getVideoObj";
import { showAddVideoToModal } from "./modalFunctions";

let observer: MutationObserver | null = null;
let isProcessing = false;
let debounceTimeout: number | undefined;
const notyf = new Notyf();

export async function toggleLocalPlaylist() {
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

      const flexibleItemButtons = YtdMenuRenderer.querySelector(
        "#flexible-item-buttons"
      ) as HTMLElement;
      if (flexibleItemButtons === null) {
        console.log("flexibleItemButtons not found");
        return;
      }
      // console.log(flexibleItemButtons);

      const savePlayListBtn = flexibleItemButtons.querySelector(
        "yt-button-view-model.ytd-menu-renderer"
      ) as HTMLElement;
      if (savePlayListBtn === null) {
        console.log("savePlayListBtn not found");
        return;
      }
      // console.log(savePlayListBtn);

      // remove previous save playlist btn
      const mycustomSaveVideoToLocalPlaylistButtonWrapper =
        document.querySelectorAll(
          "#custom-nologin-yt-save-video-to-local-playlist-btn-wrapper"
        );
      if (mycustomSaveVideoToLocalPlaylistButtonWrapper.length !== 0) {
        mycustomSaveVideoToLocalPlaylistButtonWrapper.forEach((button) =>
          button.remove()
        );
        console.log("removed previous save playlist btn");
      } else {
        console.log("no previous save playlist btn found.");
      }

      // create and append custom save platlist btn
      const customSaveVideoToLocalPlaylistButtonWrapper =
        document.createElement("div");
      customSaveVideoToLocalPlaylistButtonWrapper.id =
        "custom-nologin-yt-save-video-to-local-playlist-btn-wrapper";
      customSaveVideoToLocalPlaylistButtonWrapper.innerHTML = `
        <div class="custom-nologin-yt-save-video-to-local-playlist-btn">
            ${notSavedPlaylistIcon}
            <p>Add to</p>
        </div>`;
      flexibleItemButtons.appendChild(
        customSaveVideoToLocalPlaylistButtonWrapper
      );

      customSaveVideoToLocalPlaylistButtonWrapper.addEventListener(
        "click",
        async () => {
          const responseData: ResponseData = await chrome.runtime.sendMessage({
            task: "getLocalPlaylists",
          });
          const { success, data, error } = responseData;
          if (success) {
            const localPlaylists: LocalPlaylistNotDetailed[] = data?.playlists;
            const video = getVideoObj(document, aboveTheFoldElement);
            showAddVideoToModal(localPlaylists, video);
          } else {
            console.error("Error getting local playlists:", error);
            notyf.open({
              type: "error",
              message:
                "Something went wrong <br />Please refresh and try again",
              position: { x: "left", y: "bottom" },
              duration: 3000,
              dismissible: true,
              className: "toast-message",
              icon: false,
            });
          }
        }
      );

      if (observer) {
        observer?.disconnect();
        observer = null;
        console.log("addVideoToLocalPlaylist observer disconnected");
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
