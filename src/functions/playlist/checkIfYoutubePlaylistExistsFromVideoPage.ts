import { getPlaylistObj } from "../../helpers/playlist/getPlaylistObj";
import {
  notSavedPlaylistIcon,
  savedPlaylistIcon,
} from "../../helpers/playlist/savedNotsavedPlaylistIcon";
import { ResponseData } from "../../types";
import { toggleYoutubePlaylist } from "./toggleYoutubePlaylist";

let observer: MutationObserver | null = null;
let isProcessing = false;
let debounceTimeout: number | undefined;

export async function checkIfYoutubePlaylistExistsFromVideoPage(url: string) {
  // Extract the playlist Id from the URL
  const params = new URL(url).searchParams;
  const playlistUrlSlug = params.get("list");

  const responseData: ResponseData = await chrome.runtime.sendMessage({
    task: "checkIfYoutubePlaylistSaved",
    data: { playlistUrlSlug },
  });
  const isYoutubePlaylistSaved = responseData?.data?.isYoutubePlaylistSaved;
  console.log(
    isYoutubePlaylistSaved
      ? "youtube playlist saved"
      : "youtube playlist not saved"
  );

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  async function handleLikeElements() {
    // If already processing, skip
    if (isProcessing) return;

    try {
      isProcessing = true;

      const columnsElement = document.querySelector("#columns") as HTMLElement;
      if (columnsElement === null) {
        console.log("columnsElement not found");
        return;
      }
      // console.log(columnsElement);

      const secondaryElement = columnsElement.querySelector(
        "#secondary"
      ) as HTMLElement;
      if (secondaryElement === null) {
        console.log("secondaryElement not found");
        return;
      }
      // console.log(secondaryElement);

      const ytdPlaylistPanelRendererElement = columnsElement.querySelector(
        "ytd-playlist-panel-renderer"
      ) as HTMLElement;
      if (ytdPlaylistPanelRendererElement === null) {
        console.log("ytdPlaylistPanelRendererElement not found");
        return;
      }
      // console.log(ytdPlaylistPanelRendererElement);

      const containerElement = ytdPlaylistPanelRendererElement.querySelector(
        "#container"
      ) as HTMLElement;
      if (containerElement === null) {
        console.log("containerElement not found");
        return;
      }
      // console.log(containerElement);

      const playlistActionsElement = containerElement.querySelector(
        "#playlist-actions"
      ) as HTMLElement;
      if (playlistActionsElement === null) {
        console.log("playlistActionsElement not found");
        return;
      }
      // console.log(playlistActionsElement);

      // remove previous liked btn
      const mycustomSavePlaylistButtonWrapper = document.querySelectorAll(
        "#custom-nologin-yt-save-playlist-btn-wrapper"
      );
      if (mycustomSavePlaylistButtonWrapper.length !== 0) {
        mycustomSavePlaylistButtonWrapper.forEach((button) => button.remove());
        console.log("removed previous save playlist btn");
      } else {
        console.log("no previous save playlist btn found.");
      }

      const customSavePlaylistButtonWrapper = document.createElement("div");
      customSavePlaylistButtonWrapper.id =
        "custom-nologin-yt-save-playlist-btn-wrapper";
      customSavePlaylistButtonWrapper.innerHTML = `
        <div class="custom-nologin-yt-save-playlist-btn">
          ${isYoutubePlaylistSaved ? savedPlaylistIcon : notSavedPlaylistIcon}
          <p>${isYoutubePlaylistSaved ? "Saved" : "Save"} Playlist</p>
        </div>`;
      playlistActionsElement.append(customSavePlaylistButtonWrapper);

      customSavePlaylistButtonWrapper.addEventListener("click", async (e) => {
        e.stopPropagation();
        const playlist = getPlaylistObj(containerElement);
        await toggleYoutubePlaylist(playlist, customSavePlaylistButtonWrapper);
      });

      if (observer) {
        observer?.disconnect();
        observer = null;
        console.log("playlist observer disconnected");
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
