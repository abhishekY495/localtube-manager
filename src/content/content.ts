import "./content.css";

import { checkIfVideoLiked } from "../functions/video/checkIfVideoLiked";
import { checkIfChannelSubscribedFromVideoPage } from "../functions/channel/checkIfChannelSubscribedFromVideoPage";
import { checkIfChannelSubscribedFromChannelPage } from "../functions/channel/checkIfChannelSubscribedFromChannelPage";
import { getVideoUrlSlug } from "../helpers/video/getVideoUrlSlug";
import { getChannelUrl } from "../helpers/channel/getChannelUrl";

const videoUrlSlug = getVideoUrlSlug();

if (videoUrlSlug.length > 0) {
  checkIfVideoLiked(String(videoUrlSlug));
  checkIfChannelSubscribedFromVideoPage();
} else {
  const channelUrl = getChannelUrl();
  checkIfChannelSubscribedFromChannelPage(channelUrl);
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
        const channelUrl = getChannelUrl();
        await checkIfChannelSubscribedFromChannelPage(channelUrl);
      }
    }, 800);
  }
}).observe(document, { subtree: true, childList: true });
