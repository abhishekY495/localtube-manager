import "./content.css";
import "notyf/notyf.min.css";
import { getCurrentUrl } from "./helpers/getCurrentUrl";
import { checkIfVideoLiked } from "./functions/video/checkIfVideoLiked";
import { checkIfChannelSubscribedFromVideoPage } from "./functions/channel/checkIfChannelSubscribedFromVideoPage";
import { checkIfChannelSubscribedFromChannelPage } from "./functions/channel/checkIfChannelSubscribedFromChannelPage";
import { checkIfYoutubePlaylistExistsFromVideoPage } from "./functions/playlist/youtube/checkIfYoutubePlaylistExistsFromVideoPage";
import { checkIfYoutubePlaylistExistsFromPlaylistPage } from "./functions/playlist/youtube/checkIfYoutubePlaylistExistsFromPlaylistPage";
import { toggleLocalPlaylist } from "./functions/playlist/local/toggleLocalPlaylist";

const processPage = (url: string) => {
  if (!url) return;

  const params = new URL(url).searchParams;
  const videoUrlSlug = params.get("v");

  if (videoUrlSlug) {
    checkIfVideoLiked(videoUrlSlug);
    checkIfChannelSubscribedFromVideoPage();
    toggleLocalPlaylist(videoUrlSlug);

    if (params.get("list")) {
      const playlistUrlSlug = params.get("list")!;
      checkIfYoutubePlaylistExistsFromVideoPage(playlistUrlSlug);
    }
  } else if (url.includes("playlist?list=")) {
    const playlistUrlSlug = params.get("list")!;
    checkIfYoutubePlaylistExistsFromPlaylistPage(playlistUrlSlug);
  } else if (url.length > "https://www.youtube.com/".length) {
    checkIfChannelSubscribedFromChannelPage(url);
  }
};

// Initial page load
(function init() {
  const currentUrl = getCurrentUrl();
  processPage(currentUrl);
})();

// URL change observer
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(() => processPage(getCurrentUrl()), 1000);
  }
}).observe(document, { subtree: true, childList: true });
