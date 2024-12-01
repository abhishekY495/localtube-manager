import "./content.css";

import { checkIfVideoLiked } from "../indexedDB/video/checkIfVideoLiked";
import { checkIfChannelSubscribedFromVideoPage } from "../indexedDB/channel/checkIfChannelSubscribedFromVideoPage";
import { getVideoUrlSlug } from "../helpers/video/getVideoUrlSlug";
import { getChannelUrl } from "../helpers/channel/getChannelUrl";
import { checkIfChannelSubscribedFromChannelPage } from "../indexedDB/channel/checkIfChannelSubscribedFromChannelPage";

const videoUrlSlug = getVideoUrlSlug();

if (videoUrlSlug.length > 0) {
  checkIfVideoLiked(String(videoUrlSlug));
  checkIfChannelSubscribedFromVideoPage();
} else {
  const url = location.href;
  if (url !== "https://www.youtube.com/") {
    const channelUrl = getChannelUrl();
    await checkIfChannelSubscribedFromChannelPage(channelUrl);
  }
}

let lastUrl = location.href;
new MutationObserver(async () => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(async () => {
      const videoUrlSlug = getVideoUrlSlug();
      if (videoUrlSlug.length > 0) {
        await checkIfVideoLiked(String(videoUrlSlug));
        await checkIfChannelSubscribedFromVideoPage();
      } else {
        if (url !== "https://www.youtube.com/") {
          const channelUrl = getChannelUrl();
          await checkIfChannelSubscribedFromChannelPage(channelUrl);
        }
      }
    }, 800);
  }
}).observe(document, { subtree: true, childList: true });
