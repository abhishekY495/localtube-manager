import "./content.css";
import "notyf/notyf.min.css";
import { getVideoUrlSlug } from "../helpers/video/getVideoUrlSlug";
import { getCurrentUrl } from "../helpers/getCurrentUrl";
import { checkIfVideoLiked } from "../functions/video/checkIfVideoLiked";
import { checkIfChannelSubscribedFromVideoPage } from "../functions/channel/checkIfChannelSubscribedFromVideoPage";
import { checkIfChannelSubscribedFromChannelPage } from "../functions/channel/checkIfChannelSubscribedFromChannelPage";
import { checkIfYoutubePlaylistExistsFromVideoPage } from "../functions/playlist/checkIfYoutubePlaylistExistsFromVideoPage";
import { checkIfYoutubePlaylistExistsFromPlaylistPage } from "../functions/playlist/checkIfYoutubePlaylistExistsFromPlaylistPage";
import { toggleLocalPlaylist } from "../functions/playlist/local/toggleLocalPlaylist";

const videoUrlSlug = getVideoUrlSlug();
const currentUrl = getCurrentUrl();

if (videoUrlSlug.length > 0) {
  checkIfVideoLiked(String(videoUrlSlug));
  toggleLocalPlaylist();
  checkIfChannelSubscribedFromVideoPage();
  if (currentUrl.includes("list=")) {
    checkIfYoutubePlaylistExistsFromVideoPage(currentUrl);
  }
} else if (currentUrl.includes("playlist?list=")) {
  checkIfYoutubePlaylistExistsFromPlaylistPage(currentUrl);
} else {
  checkIfChannelSubscribedFromChannelPage(currentUrl);
}

let lastUrl = location.href;
new MutationObserver(async () => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(async () => {
      const videoUrlSlug = getVideoUrlSlug();
      const currentUrl = getCurrentUrl();
      if (videoUrlSlug.length > 0) {
        const tasks = [
          checkIfVideoLiked(String(videoUrlSlug)),
          checkIfChannelSubscribedFromVideoPage(),
          toggleLocalPlaylist(),
        ];
        if (currentUrl.includes("list=")) {
          tasks.push(checkIfYoutubePlaylistExistsFromVideoPage(currentUrl));
        }
        await Promise.all(tasks);
      } else if (currentUrl.includes("playlist?list=")) {
        checkIfYoutubePlaylistExistsFromPlaylistPage(currentUrl);
      } else {
        await checkIfChannelSubscribedFromChannelPage(currentUrl);
      }
    }, 1000);
  }
}).observe(document, { subtree: true, childList: true });
