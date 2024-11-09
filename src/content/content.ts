import "./content.css";

import { checkIfVideoIsInLikedDB } from "./indexedDB/checkIfVideoIsInLikedDB";
import { getVideoUrlSlug } from "../helpers/getVideoUrlSlug";

const urlSlug = getVideoUrlSlug();
checkIfVideoIsInLikedDB(String(urlSlug));

let lastUrl = location.href;
new MutationObserver(async () => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    const urlSlug = getVideoUrlSlug();
    await checkIfVideoIsInLikedDB(String(urlSlug));
  }
}).observe(document, { subtree: true, childList: true });
