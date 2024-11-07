import "./content.css";

import { checkIfVideoIsInLikedDB } from "./indexedDB/checkIfVideoIsInLikedDB";
import { getVideoUrlSlug } from "../helpers/getVideoUrlSlug";

const urlSlug = getVideoUrlSlug();
await checkIfVideoIsInLikedDB(String(urlSlug));

let lastUrl = location.href;
new MutationObserver(async () => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    const urlSlug = getVideoUrlSlug();
    await checkIfVideoIsInLikedDB(String(urlSlug));
  }
}).observe(document, { subtree: true, childList: true });

// if (document.readyState === "complete") {
//   let observer = new MutationObserver((mutations, observer) => {
//     const actionsElement = document.querySelector("#actions-inner");
//     // if (!actionsElement) return;

//     if (actionsElement) {
//       const likeBtn = actionsElement.querySelector(
//         ".YtLikeButtonViewModelHost"
//       );
//       if (likeBtn) {
//         console.log(likeBtn);
//         observer.disconnect();
//       }
//     }

//     console.log("observing");
//   });

//   observer.observe(document.body, {
//     childList: true,
//     subtree: true,
//   });
// }
