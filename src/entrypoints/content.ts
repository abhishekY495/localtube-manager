import "./content/content.css";
import { checkIfChannelSubscribedFromChannelPage } from "./content/functions/channel/checkIfChannelSubscribedFromChannelPage";
import { checkIfChannelSubscribedFromVideoPage } from "./content/functions/channel/checkIfChannelSubscribedFromVideoPage";
import { toggleLocalPlaylist } from "./content/functions/playlist/local/toggleLocalPlaylist";
import { checkIfYoutubePlaylistExistsFromPlaylistPage } from "./content/functions/playlist/youtube/checkIfYoutubePlaylistExistsFromPlaylistPage";
import { checkIfYoutubePlaylistExistsFromVideoPage } from "./content/functions/playlist/youtube/checkIfYoutubePlaylistExistsFromVideoPage";
import { checkIfVideoLiked } from "./content/functions/video/checkIfVideoLiked";
import { getCurrentUrl } from "./content/helpers/getCurrentUrl";

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  main() {
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
  },
});
