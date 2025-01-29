import { Notyf } from "notyf";
import { LocalPlaylistNotDetailed, ResponseData } from "../../../../types";
import { notSavedPlaylistIcon } from "../../../helpers/playlist/savedNotsavedPlaylistIcon";
import { getVideoObj } from "../../../helpers/video/getVideoObj";
import { showAddVideoToModal } from "./modalFunctions";
import { waitForAllElements } from "../../../helpers/waitForAllElements";

const notyf = new Notyf();

const selectors = [
  "#above-the-fold",
  "ytd-menu-renderer",
  "#flexible-item-buttons",
  "yt-button-view-model.ytd-menu-renderer",
];

export async function toggleLocalPlaylist(videoUrlSlug: string) {
  console.log("🎬 Starting toggleLocalPlaylist");

  try {
    // // Wait for all elements to be loaded
    await waitForAllElements(selectors);
    console.log("✨ All elements are ready");

    // Now we can safely get all elements
    const aboveTheFoldElement = document.querySelector(
      selectors[0]
    ) as HTMLElement;
    const YtdMenuRenderer = aboveTheFoldElement.querySelector(
      selectors[1]
    ) as HTMLElement;
    const flexibleItemButtons = YtdMenuRenderer.querySelector(
      selectors[2]
    ) as HTMLElement;

    // Remove any existing buttons
    const prevCustomSaveVideoToLocalPlaylistButtonWrappers =
      document.querySelectorAll(
        "#custom-ltm-save-video-to-local-playlist-btn-wrapper"
      );
    if (prevCustomSaveVideoToLocalPlaylistButtonWrappers.length > 0) {
      console.log(
        `🗑️ Removing ${prevCustomSaveVideoToLocalPlaylistButtonWrappers.length} existing button(s)`
      );
      prevCustomSaveVideoToLocalPlaylistButtonWrappers.forEach((button) =>
        button.remove()
      );
    }

    // Create and append new button
    console.log("🎨 Creating Add to playlist button");
    const customSaveVideoToLocalPlaylistButtonWrapper =
      document.createElement("div");
    customSaveVideoToLocalPlaylistButtonWrapper.id =
      "custom-ltm-save-video-to-local-playlist-btn-wrapper";
    customSaveVideoToLocalPlaylistButtonWrapper.innerHTML = `
        <div class="custom-ltm-save-video-to-local-playlist-btn">
          ${notSavedPlaylistIcon}
          <p>Add to</p>
        </div>`;
    flexibleItemButtons.appendChild(
      customSaveVideoToLocalPlaylistButtonWrapper
    );
    console.log("✅ Add to playlist button added to page");

    // Add click event listener
    customSaveVideoToLocalPlaylistButtonWrapper.addEventListener("click", () =>
      addToLocalPlaylist(aboveTheFoldElement, videoUrlSlug)
    );
  } catch (error) {
    console.log(error);
  }
}

async function addToLocalPlaylist(
  aboveTheFoldElement: HTMLElement,
  videoUrlSlug: string
) {
  const responseData: ResponseData = await chrome.runtime.sendMessage({
    task: "getLocalPlaylists",
  });
  const { success, data, error } = responseData;
  if (success) {
    const localPlaylists: LocalPlaylistNotDetailed[] = data?.playlists;
    const video = getVideoObj(document, aboveTheFoldElement, videoUrlSlug);
    showAddVideoToModal(localPlaylists, video);
  } else {
    console.error("Error getting local playlists:", error);
    notyf.open({
      type: "error",
      message: "Something went wrong <br />Please refresh and try again",
      position: { x: "left", y: "bottom" },
      duration: 3000,
      dismissible: true,
      className: "toast-message",
      icon: false,
    });
  }
}
