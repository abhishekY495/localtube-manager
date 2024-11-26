import { YoutubeChannel } from "../../types";
import { initializeYoutubeDB } from "../initializeYoutubeDB";

let observer: MutationObserver | null = null;
let isProcessing = false;
let debounceTimeout: number | undefined;

export async function checkIfChannelSubscribedFromChannelPage(
  channelUrl: string
) {
  const db = await initializeYoutubeDB();
  let isSubscribed: boolean = false;
  let isSubscribedFromId: boolean = false;
  let isSubscribedFromHandle: boolean = false;

  // Clean up existing observer
  if (observer) {
    observer.disconnect();
    observer = null;
    isProcessing = false;
  }

  async function handleChannelElements() {
    // If already processing, skip
    if (isProcessing) return;

    try {
      isProcessing = true;

      // Disconnect observer after successful processing
      if (observer) {
        observer.disconnect();
        observer = null;
        isProcessing = false;
        console.log("channel observer disconnected");
      }

      const pageHeaderElement = document.querySelector(
        "#page-header"
      ) as HTMLElement;
      if (pageHeaderElement === null) {
        console.log("pageHeaderElement not found");
        return;
      }
      // console.log(pageHeaderElement);

      const channelActionsViewModal = pageHeaderElement.querySelector(
        "yt-flexible-actions-view-model"
      ) as HTMLElement;
      if (channelActionsViewModal === null) {
        console.log("channelActionsViewModal not found");
        return;
      }
      // console.log(channelActionsViewModal);

      const contentMetadataViewModel = pageHeaderElement.querySelector(
        "yt-content-metadata-view-model"
      ) as HTMLElement;
      if (contentMetadataViewModel === null) {
        console.log("contentMetadataViewModel not found");
        return;
      }
      // console.log(contentMetadataViewModel);

      const channelHandleElement = contentMetadataViewModel.querySelector(
        "span"
      ) as HTMLElement;
      if (channelHandleElement === null) {
        console.log("channelHandleElement not found");
        return;
      }
      const channelHandle = channelHandleElement.innerText;
      console.log(channelHandle);

      const channel: YoutubeChannel = await db.get(
        "subscribedChannels",
        `https://www.youtube.com/${channelHandle}`
      );
      if (channel) {
        isSubscribedFromHandle = true;
        console.log("subscribed from handle");
        if (!isSubscribedFromHandle) {
          console.log("not subscribed from handle, checking id");
          isSubscribedFromId = channel.id === channelUrl;
        }
      }

      // final subscription check
      if (isSubscribedFromHandle || isSubscribedFromId) {
        isSubscribed = true;
      } else {
        isSubscribed = false;
      }

      // remove previous created button
      const myCustomSubscribeButton = document.querySelectorAll(
        ".custom-nologin-yt-subscribe-btn-2"
      );
      if (myCustomSubscribeButton.length !== 0) {
        console.log("previous subscribe btn found, removing it");
        console.log(myCustomSubscribeButton);
        myCustomSubscribeButton.forEach((button) => button.remove());
      } else {
        console.log("No previous subscribe btn found.");
      }

      // Create new subscribe button
      const customSubscribeButton = document.createElement("div");
      customSubscribeButton.classList.add("custom-nologin-yt-subscribe-btn-2");

      if (isSubscribed) {
        customSubscribeButton.innerText = "Subscribed";
        customSubscribeButton.classList.add("custom-yt-channel-subscribed");
      } else {
        customSubscribeButton.innerText = "Subscribe";
        customSubscribeButton.classList.remove("custom-yt-channel-subscribed");
      }
      customSubscribeButton.style.visibility = "visible";
      channelActionsViewModal.prepend(customSubscribeButton);
    } finally {
      isProcessing = false;
    }
  }

  // Debounce function to limit how often we process mutations
  function debounceHandler() {
    console.log("searching");
    window.clearTimeout(debounceTimeout);
    debounceTimeout = window.setTimeout(handleChannelElements, 100);
  }

  // Create new observer
  observer = new MutationObserver(debounceHandler);
  observer.observe(document.body, { childList: true, subtree: true });
}
