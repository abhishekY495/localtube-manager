import {
  notSavedPlaylistIcon,
  savedPlaylistIcon,
} from "@/entrypoints/content/helpers/playlist/savedNotsavedPlaylistIcon";
import { ResponseData, YoutubePlaylist } from "@/entrypoints/types";
import { Notyf } from "notyf";

const notyf = new Notyf();

export async function toggleYoutubePlaylist(
  playlist: YoutubePlaylist,
  customSavePlaylistButtonWrapper: Element,
  playlistPage?: boolean,
) {
  try {
    const responseData: ResponseData = await browser.runtime.sendMessage({
      task: "toggleYoutubePlaylist",
      data: { playlist },
    });
    const { success, data, error } = responseData;

    if (success) {
      const isYoutubePlaylistSaved = data?.isYoutubePlaylistSaved;
      if (isYoutubePlaylistSaved) {
        customSavePlaylistButtonWrapper.innerHTML = `
            <div class="${
              playlistPage
                ? "custom-ltm-save-playlist-btn-2"
                : "custom-ltm-save-playlist-btn"
            }">
              ${savedPlaylistIcon}
              <p>Saved Playlist</p>
            </div>`;
      } else {
        customSavePlaylistButtonWrapper.innerHTML = `
            <div class="${
              playlistPage
                ? "custom-ltm-save-playlist-btn-2"
                : "custom-ltm-save-playlist-btn"
            }">
              ${notSavedPlaylistIcon}
              <p>Save Playlist</p>
            </div>`;
      }
    } else {
      console.error("Error toggling youtube playlist:", error);
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
  } catch (error) {
    console.error("Error toggling youtube playlist:", error);
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
