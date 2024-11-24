import "./content.css";

import { checkIfVideoLiked } from "../indexedDB/video/checkIfVideoLiked";
import { checkIfChannelSubscribed } from "../indexedDB/channel/checkIfChannelSubscribed";
import { getVideoUrlSlug } from "../helpers/video/getVideoUrlSlug";

const urlSlug = getVideoUrlSlug();

if (urlSlug.length > 0) {
  await checkIfVideoLiked(String(urlSlug));
  await checkIfChannelSubscribed();
}

let lastUrl = location.href;
new MutationObserver(async () => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(async () => {
      const urlSlug = getVideoUrlSlug();
      if (urlSlug.length > 0) {
        await checkIfVideoLiked(String(urlSlug));
        await checkIfChannelSubscribed();
      }
    }, 800);
  }
}).observe(document, { subtree: true, childList: true });
