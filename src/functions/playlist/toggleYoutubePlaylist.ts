import {
  notSavedPlaylistIcon,
  savedPlaylistIcon,
} from "../../helpers/playlist/savedNotsavedPlaylistIcon";
import { ResponseData, YoutubePlaylist } from "../../types";

export async function toggleYoutubePlaylist(
  playlist: YoutubePlaylist,
  customSavePlaylistButtonWrapper: Element,
  playlistPage?: boolean
) {
  try {
    const responseData: ResponseData = await chrome.runtime.sendMessage({
      task: "toggleYoutubePlaylist",
      data: { playlist },
    });
    const isYoutubePlaylistSaved = responseData?.data?.isYoutubePlaylistSaved;

    if (responseData?.success) {
      if (isYoutubePlaylistSaved) {
        console.log("Playlist saved", playlist);
        customSavePlaylistButtonWrapper.innerHTML = `
          <div class="${
            playlistPage
              ? "custom-nologin-yt-save-playlist-btn-2"
              : "custom-nologin-yt-save-playlist-btn"
          }">
            ${savedPlaylistIcon}
            <p>Saved Playlist</p>
          </div>`;
      } else {
        customSavePlaylistButtonWrapper.innerHTML = `
          <div class="${
            playlistPage
              ? "custom-nologin-yt-save-playlist-btn-2"
              : "custom-nologin-yt-save-playlist-btn"
          }">
            ${notSavedPlaylistIcon}
            <p>Save Playlist</p>
          </div>`;
        console.log("Playlist removed", playlist.name);
      }
    } else {
      console.log("Something went wrong");
      console.log(responseData);
    }
  } catch (error) {
    console.error("Error toggling liked video:", error);
  }
}
