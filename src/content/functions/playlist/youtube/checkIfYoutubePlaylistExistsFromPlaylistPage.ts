import { getPlaylistObjFromPlaylistPage } from "../../../helpers/playlist/getPlaylistObjFromPlaylistPage";
import {
  notSavedPlaylistIcon,
  savedPlaylistIcon,
} from "../../../helpers/playlist/savedNotsavedPlaylistIcon";
import { waitForAllElements } from "../../../helpers/waitForAllElements";
import { ResponseData } from "../../../../types";
import { toggleYoutubePlaylist } from "./toggleYoutubePlaylist";

const selectors = [
  "#page-manager",
  "ytd-browse[page-subtype='playlist']",
  "yt-page-header-renderer.page-header-sidebar",
  ".page-header-view-model-wiz__page-header-content",
  "yt-flexible-actions-view-model",
];

export async function checkIfYoutubePlaylistExistsFromPlaylistPage(
  playlistUrlSlug: string
) {
  console.log("🎬 Starting checkIfYoutubePlaylistExistsFromPlaylistPage");
  console.log(`🎵 Playlist ID: ${playlistUrlSlug}`);

  // Check playlist saved status
  console.log("📡 Checking if playlist is saved...");
  const responseData: ResponseData = await chrome.runtime.sendMessage({
    task: "checkIfYoutubePlaylistSaved",
    data: { playlistUrlSlug },
  });
  const isYoutubePlaylistSaved = responseData?.data?.isYoutubePlaylistSaved;
  console.log(
    `💾 Playlist saved status: ${
      isYoutubePlaylistSaved ? "Saved" : "Not saved"
    }`
  );

  // Wait for all elements to be loaded
  await waitForAllElements(selectors);
  console.log("✨ All elements are ready");

  // Now we can safely get all elements
  const pageManagerElement = document.querySelector(
    selectors[0]
  ) as HTMLElement;
  const ytdBrowseElement = pageManagerElement.querySelector(
    selectors[1]
  ) as HTMLElement;
  const ytPageHeaderRenderer = ytdBrowseElement.querySelector(
    selectors[2]
  ) as HTMLElement;
  const pageHeaderViewModel = ytPageHeaderRenderer.querySelector(
    selectors[3]
  ) as HTMLElement;
  const ytFlexibleActionViewModel = pageHeaderViewModel.querySelector(
    selectors[4]
  ) as HTMLElement;

  // Remove any existing buttons
  const existingButtons = document.querySelectorAll(
    "#custom-nologin-yt-save-playlist-btn-wrapper-2"
  );
  if (existingButtons.length > 0) {
    console.log(`🗑️ Removing ${existingButtons.length} existing button(s)`);
    existingButtons.forEach((button) => button.remove());
  }

  // Create and append new button
  console.log("🎨 Creating new save playlist button");
  const customSavePlaylistButtonWrapper = document.createElement("div");
  customSavePlaylistButtonWrapper.id =
    "custom-nologin-yt-save-playlist-btn-wrapper-2";
  customSavePlaylistButtonWrapper.innerHTML = `
    <div class="custom-nologin-yt-save-playlist-btn-2">
      ${isYoutubePlaylistSaved ? savedPlaylistIcon : notSavedPlaylistIcon}
      <p>${isYoutubePlaylistSaved ? "Saved" : "Save"} Playlist</p>
    </div>`;

  ytFlexibleActionViewModel.append(customSavePlaylistButtonWrapper);
  console.log("✅ Save playlist button added to page");

  // Add click event listener
  customSavePlaylistButtonWrapper.addEventListener("click", async () => {
    console.log("👆 Save playlist button clicked");
    const playlist = getPlaylistObjFromPlaylistPage(
      pageHeaderViewModel,
      playlistUrlSlug || ""
    );
    await toggleYoutubePlaylist(
      playlist,
      customSavePlaylistButtonWrapper,
      true
    );
  });

  console.log("🎉 Setup completed successfully");
}
