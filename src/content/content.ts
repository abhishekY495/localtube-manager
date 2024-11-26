import "./content.css";

import { checkIfVideoLiked } from "../indexedDB/video/checkIfVideoLiked";
import { checkIfChannelSubscribed } from "../indexedDB/channel/checkIfChannelSubscribed";
import { getVideoUrlSlug } from "../helpers/video/getVideoUrlSlug";
import { getChannelUrl } from "../helpers/channel/getChannelUrl";
import { getSubscribedChannels } from "../indexedDB/channel/getSubscibedChannels";
import { checkIfChannelSubscribedFromChannelPage } from "../indexedDB/channel/checkIfChannelSubscribedFromChannelPage";

const videoUrlSlug = getVideoUrlSlug();

const channelUrl = getChannelUrl();
console.log(channelUrl);

const subscribedChannels = await getSubscribedChannels();
console.log(subscribedChannels);

await checkIfChannelSubscribedFromChannelPage(channelUrl);

if (videoUrlSlug.length > 0) {
  checkIfVideoLiked(String(videoUrlSlug));
  checkIfChannelSubscribed();
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
      }

      const channelUrl = getChannelUrl();
      console.log(channelUrl);

      const subscribedChannels = await getSubscribedChannels();
      console.log(subscribedChannels);

      await checkIfChannelSubscribedFromChannelPage(channelUrl);
    }, 800);
  }
}).observe(document, { subtree: true, childList: true });
