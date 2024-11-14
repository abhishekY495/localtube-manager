import "./content.css";

import { checkIfVideoIsLiked } from "./indexedDB/checkIfVideoIsLiked";
import { getVideoUrlSlug } from "../helpers/getVideoUrlSlug";
import { checkIfChannelSubscribed } from "./indexedDB/checkIfChannelSubscribed";

const urlSlug = getVideoUrlSlug();

checkIfVideoIsLiked(String(urlSlug));
checkIfChannelSubscribed();

let lastUrl = location.href;
new MutationObserver(async () => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    const urlSlug = getVideoUrlSlug();
    await checkIfVideoIsLiked(String(urlSlug));
    await checkIfChannelSubscribed();
  }
}).observe(document, { subtree: true, childList: true });
