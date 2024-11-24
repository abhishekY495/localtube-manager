// import { getChannelObj } from "../../helpers/channel/getChannelObj";
// import { initializeYoutubeDB } from "../initializeYoutubeDB";
// import { getSubscribedChannels } from "./getSubscibedChannels";
// import { toggleSubscribedChannel } from "./toggleSubscribedChannel";

// let observer: MutationObserver | null = null;

// export async function checkIfChannelSubscribed() {
//   const db = await initializeYoutubeDB();

//   if (observer) {
//     observer.disconnect();
//     observer = null;
//   }

//   setTimeout(() => {
//     observer = new MutationObserver(async () => {
//       const aboveTheFoldElement = document.querySelector(
//         "#above-the-fold"
//       ) as HTMLElement;
//       if (aboveTheFoldElement === null) {
//         console.log("aboveTheFoldElement not found");
//         return;
//       }
//       // console.log(aboveTheFoldElement)

//       const ownerElement = aboveTheFoldElement.querySelector(
//         "#owner"
//       ) as HTMLElement;
//       if (ownerElement === null) {
//         console.log("ownerElement not found");
//         return;
//       }
//       // console.log(ownerElement)

//       // clearing previous custom subscribe button
//       const myCustomSubscribeButton = document.querySelector(
//         ".custom-nologin-yt-subscribe-btn"
//       ) as HTMLElement;
//       if (myCustomSubscribeButton) {
//         myCustomSubscribeButton.remove();
//         console.log("myCustomSubscribeButton found, removing it");
//       } else {
//         console.log("myCustomSubscribeButton not found");
//       }

//       // creating custom subscribe button
//       const customSubscribeButton = document.createElement(
//         "div"
//       ) as HTMLElement;
//       customSubscribeButton.classList.add("custom-nologin-yt-subscribe-btn");

//       // Check is channel subscribed or not
//       const youtubeChannel = getChannelObj(aboveTheFoldElement);
//       const isSubscribed = await db.get(
//         "subscribedChannels",
//         youtubeChannel.handle
//       );
//       console.log(youtubeChannel.handle);
//       console.log(isSubscribed ? "Subscribed" : "Not subscribed");

//       if (isSubscribed) {
//         customSubscribeButton.innerText = "Subscribed";
//         customSubscribeButton.classList.add("custom-yt-channel-subscribed");
//       } else {
//         customSubscribeButton.innerText = "Subscribe";
//         customSubscribeButton.classList.remove("custom-yt-channel-subscribed");
//       }
//       ownerElement.appendChild(customSubscribeButton);

//       customSubscribeButton.addEventListener("click", async () => {
//         await toggleSubscribedChannel(youtubeChannel, customSubscribeButton);
//         const subscribedChannels = await getSubscribedChannels();
//         console.log(subscribedChannels);
//       });

//       console.log(1, "searching");
//       observer?.disconnect();
//       console.log("observer disconnected");
//     });
//     console.log("searching");
//     observer.observe(document.body, { childList: true, subtree: true });
//   }, 1800);
// }

import { getChannelObj } from "../../helpers/channel/getChannelObj";
import { initializeYoutubeDB } from "../initializeYoutubeDB";
import { getSubscribedChannels } from "./getSubscibedChannels";
import { toggleSubscribedChannel } from "./toggleSubscribedChannel";

let observer: MutationObserver | null = null;
let isProcessing = false;
let debounceTimeout: number | undefined;

export async function checkIfChannelSubscribed() {
  const db = await initializeYoutubeDB();

  // Clean up existing observer
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  async function handleChannelElements() {
    // If already processing, skip
    if (isProcessing) return;

    try {
      isProcessing = true;

      const aboveTheFoldElement = document.querySelector(
        "#above-the-fold"
      ) as HTMLElement;
      if (!aboveTheFoldElement) {
        console.log("aboveTheFoldElement not found");
        return;
      }

      const ownerElement = aboveTheFoldElement.querySelector(
        "#owner"
      ) as HTMLElement;
      if (!ownerElement) {
        console.log("ownerElement not found");
        return;
      }

      // Remove all existing custom subscribe buttons
      const existingButtons = document.querySelectorAll(
        ".custom-nologin-yt-subscribe-btn"
      );
      existingButtons.forEach((button) => button.remove());

      // Get channel info and subscription status
      const youtubeChannel = getChannelObj(aboveTheFoldElement);
      const isSubscribed = await db.get(
        "subscribedChannels",
        youtubeChannel.handle
      );

      console.log(youtubeChannel.handle);
      console.log(isSubscribed ? "Subscribed" : "Not subscribed");

      // Create new subscribe button
      const customSubscribeButton = document.createElement("div");
      customSubscribeButton.classList.add("custom-nologin-yt-subscribe-btn");

      if (isSubscribed) {
        customSubscribeButton.innerText = "Subscribed";
        customSubscribeButton.classList.add("custom-yt-channel-subscribed");
      } else {
        customSubscribeButton.innerText = "Subscribe";
        customSubscribeButton.classList.remove("custom-yt-channel-subscribed");
      }

      // Add click handler
      customSubscribeButton.addEventListener("click", async () => {
        await toggleSubscribedChannel(youtubeChannel, customSubscribeButton);
        const subscribedChannels = await getSubscribedChannels();
        console.log(subscribedChannels);
      });

      // Append button
      ownerElement.appendChild(customSubscribeButton);

      // Disconnect observer after successful processing
      if (observer) {
        observer.disconnect();
        observer = null;
        console.log("observer disconnected");
      }
    } finally {
      isProcessing = false;
    }
  }

  // Debounce function to limit how often we process mutations
  function debounceHandler() {
    window.clearTimeout(debounceTimeout);
    debounceTimeout = window.setTimeout(handleChannelElements, 100);
  }

  // Create new observer
  observer = new MutationObserver(debounceHandler);
  observer.observe(document.body, { childList: true, subtree: true });
}
