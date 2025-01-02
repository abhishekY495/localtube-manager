import { getPlaylistObjFromPlaylistPage } from "../../../helpers/playlist/getPlaylistObjFromPlaylistPage";
import {
  notSavedPlaylistIcon,
  savedPlaylistIcon,
} from "../../../helpers/playlist/savedNotsavedPlaylistIcon";
import { ResponseData } from "../../../types";
import { toggleYoutubePlaylist } from "./toggleYoutubePlaylist";

let observer: MutationObserver | null = null;
let isProcessing = false;
let debounceTimeout: number | undefined;

export async function checkIfYoutubePlaylistExistsFromPlaylistPage(
  url: string
) {
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
      ? "youtube playlist saved from playlist page"
      : "youtube playlist not saved from playlist page"
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

      const pageManagerElement = document.querySelector(
        "#page-manager"
      ) as HTMLElement;
      if (pageManagerElement === null) {
        console.log("pageManagerElement not found");
        return;
      }
      // console.log(pageManagerElement);

      const ytdBrowseElement = pageManagerElement.querySelector(
        "ytd-browse"
      ) as HTMLElement;
      if (ytdBrowseElement === null) {
        console.log("ytdBrowseElement not found");
        return;
      }
      // console.log(ytdBrowseElement);

      const ytPageHeaderRenderer = ytdBrowseElement.querySelector(
        "yt-page-header-renderer.page-header-sidebar"
      ) as HTMLElement;
      if (ytPageHeaderRenderer === null) {
        console.log("ytPageHeaderRenderer not found");
        return;
      }
      // console.log(ytPageHeaderRenderer);

      const pageHeaderViewModel = ytPageHeaderRenderer.querySelector(
        ".page-header-view-model-wiz__page-header-content"
      ) as HTMLElement;
      if (pageHeaderViewModel === null) {
        console.log("pageHeaderViewModel not found");
        return;
      }
      // console.log(pageHeaderViewModel);

      const ytFlexibleActionViewModel = pageHeaderViewModel.querySelector(
        "yt-flexible-actions-view-model"
      ) as HTMLElement;
      if (ytFlexibleActionViewModel === null) {
        console.log("ytFlexibleActionViewModel not found");
        return;
      }
      // console.log(ytFlexibleActionViewModel);

      // const ytFlexibleActionsRow = ytFlexibleActionViewModel.querySelector(
      //   ".yt-flexible-actions-view-model-wiz__action-row"
      // ) as HTMLElement;
      // if (ytFlexibleActionsRow === null) {
      //   console.log("ytFlexibleActionsRow not found");
      //   return;
      // }
      // console.log(ytFlexibleActionsRow);

      // remove previous save playlist btn
      const mycustomSavePlaylistButtonWrapper = document.querySelectorAll(
        "#custom-nologin-yt-save-playlist-btn-wrapper-2"
      );
      if (mycustomSavePlaylistButtonWrapper.length !== 0) {
        mycustomSavePlaylistButtonWrapper.forEach((button) => button.remove());
        console.log("removed previous save playlist btn");
      } else {
        console.log("no previous save playlist btn found.");
      }

      // create and append custom save platlist btn
      const customSavePlaylistButtonWrapper = document.createElement("div");
      customSavePlaylistButtonWrapper.id =
        "custom-nologin-yt-save-playlist-btn-wrapper-2";
      customSavePlaylistButtonWrapper.innerHTML = `
        <div class="custom-nologin-yt-save-playlist-btn-2">
          ${isYoutubePlaylistSaved ? savedPlaylistIcon : notSavedPlaylistIcon}
          <p>${isYoutubePlaylistSaved ? "Saved" : "Save"} Playlist</p>
        </div>`;
      ytFlexibleActionViewModel.append(customSavePlaylistButtonWrapper);

      customSavePlaylistButtonWrapper.addEventListener("click", async () => {
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

      if (observer) {
        observer?.disconnect();
        observer = null;
        console.log("playlist page observer disconnected");
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
