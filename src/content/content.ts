import "./content.css";

import { checkIfVideoLiked } from "../indexedDB/video/checkIfVideoLiked";
import { checkIfChannelSubscribed } from "../indexedDB/channel/checkIfChannelSubscribed";
import { getVideoUrlSlug } from "../helpers/video/getVideoUrlSlug";
import { getChannelUrl } from "../helpers/channel/getChannelUrl";
import { checkIfChannelSubscribedFromChannelPage } from "../indexedDB/channel/checkIfChannelSubscribedFromChannelPage";

const videoUrlSlug = getVideoUrlSlug();

if (videoUrlSlug.length > 0) {
  checkIfVideoLiked(String(videoUrlSlug));
  checkIfChannelSubscribed();
} else {
  const channelUrl = getChannelUrl();
  await checkIfChannelSubscribedFromChannelPage(channelUrl);
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
        await checkIfChannelSubscribed();
      } else {
        const channelUrl = getChannelUrl();
        await checkIfChannelSubscribedFromChannelPage(channelUrl);
      }
    }, 800);
  }
}).observe(document, { subtree: true, childList: true });
