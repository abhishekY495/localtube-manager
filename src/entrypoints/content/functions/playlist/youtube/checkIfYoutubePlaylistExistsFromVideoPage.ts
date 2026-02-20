import { getPlaylistObjFromVideoPage } from "@/entrypoints/content/helpers/playlist/getPlaylistObjFromVideoPage";
import {
  notSavedPlaylistIcon,
  savedPlaylistIcon,
} from "@/entrypoints/content/helpers/playlist/savedNotsavedPlaylistIcon";
import { waitForAllElements } from "@/entrypoints/content/helpers/waitForAllElements";
import { ResponseData } from "@/entrypoints/types";
import { toggleYoutubePlaylist } from "./toggleYoutubePlaylist";

const selectors = [
  "#columns",
  "ytd-playlist-panel-renderer",
  "#container",
  "#playlist-actions",
];

export async function checkIfYoutubePlaylistExistsFromVideoPage(
  playlistUrlSlug: string,
) {
  console.log("🎬 Starting checkIfYoutubePlaylistExistsFromVideoPage");
  console.log(`🎵 Playlist ID: ${playlistUrlSlug}`);

  // Check playlist saved status
  console.log("📡 Checking if playlist is saved...");
  const responseData: ResponseData = await browser.runtime.sendMessage({
    task: "checkIfYoutubePlaylistSaved",
    data: { playlistUrlSlug },
  });
  const isYoutubePlaylistSaved = responseData?.data?.isYoutubePlaylistSaved;
  console.log(
    `💾 Playlist saved status: ${
      isYoutubePlaylistSaved ? "Saved" : "Not saved"
    }`,
  );

  // Wait for all elements to be loaded
  await waitForAllElements(selectors);
  console.log("✨ All elements are ready");

  const columnsElement = document.querySelector(selectors[0]) as HTMLElement;
  const ytdPlaylistPanelRendererElement = columnsElement.querySelector(
    selectors[1],
  ) as HTMLElement;
  const containerElement = ytdPlaylistPanelRendererElement.querySelector(
    selectors[2],
  ) as HTMLElement;
  const playlistActionsElement = containerElement.querySelector(
    selectors[3],
  ) as HTMLElement;

  // Remove any existing buttons
  const mycustomSavePlaylistButtonWrapper = document.querySelectorAll(
    "#custom-ltm-save-playlist-btn-wrapper",
  );
  if (mycustomSavePlaylistButtonWrapper.length > 0) {
    mycustomSavePlaylistButtonWrapper.forEach((button) => button.remove());
    console.log(
      `🗑️ Removing ${mycustomSavePlaylistButtonWrapper.length} existing button(s)`,
    );
  }

  // Create and append new button
  console.log("🎨 Creating new save playlist button");
  const customSavePlaylistButtonWrapper = document.createElement("div");
  customSavePlaylistButtonWrapper.id = "custom-ltm-save-playlist-btn-wrapper";
  customSavePlaylistButtonWrapper.innerHTML = `
        <div class="custom-ltm-save-playlist-btn">
          ${isYoutubePlaylistSaved ? savedPlaylistIcon : notSavedPlaylistIcon}
          <p>${isYoutubePlaylistSaved ? "Saved" : "Save"} Playlist</p>
        </div>`;

  playlistActionsElement.append(customSavePlaylistButtonWrapper);
  console.log("✅ Save playlist button added to page");

  customSavePlaylistButtonWrapper.addEventListener("click", async (e) => {
    console.log("👆 Save playlist button clicked");
    e.stopPropagation();
    const playlist = getPlaylistObjFromVideoPage(containerElement);
    await toggleYoutubePlaylist(playlist, customSavePlaylistButtonWrapper);
  });

  console.log("🎉 Setup completed successfully");
}
