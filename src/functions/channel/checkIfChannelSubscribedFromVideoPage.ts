import { getChannelObjFromVideoPage } from "../../helpers/channel/getChannelObjFromVideoPage";
import { ResponseData } from "../../types";
import { toggleSubscribedChannel } from "./toggleSubscribedChannel";

let observer: MutationObserver | null = null;
let isProcessing = false;
let debounceTimeout: number | undefined;

export async function checkIfChannelSubscribedFromVideoPage() {
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
      if (aboveTheFoldElement === null) {
        console.log("aboveTheFoldElement not found");
        return;
      }
      // console.log(aboveTheFoldElement);

      const ownerElement = aboveTheFoldElement.querySelector(
        "#owner"
      ) as HTMLElement;
      if (ownerElement === null) {
        console.log("ownerElement not found");
        return;
      }
      // console.log(ownerElement);

      // Remove all existing custom subscribe buttons
      const existingButtons = document.querySelectorAll(
        ".custom-nologin-yt-subscribe-btn-video-page"
      );
      if (existingButtons) {
        existingButtons.forEach((button) => button.remove());
      } else {
        console.log("No previous subscribe btn found.");
      }

      // Get channel info and subscription status
      const youtubeChannel = getChannelObjFromVideoPage(aboveTheFoldElement);
      const responseData: ResponseData = await chrome.runtime.sendMessage({
        task: "checkIfChannelSubscribed",
        data: { channelHandle: youtubeChannel.handle },
      });
      const isChannelSubscribed = responseData?.data?.isChannelSubscribed;
      console.log(isChannelSubscribed ? "Subscribed" : "Not subscribed");

      // Create new subscribe button
      const customSubscribeButton = document.createElement("div");
      customSubscribeButton.classList.add(
        "custom-nologin-yt-subscribe-btn-video-page"
      );

      if (isChannelSubscribed) {
        customSubscribeButton.innerText = "Subscribed";
        customSubscribeButton.classList.add(
          "custom-nologin-yt-channel-subscribed"
        );
      } else {
        customSubscribeButton.innerText = "Subscribe";
        customSubscribeButton.classList.remove(
          "custom-nologin-yt-channel-subscribed"
        );
      }

      // Add click handler
      customSubscribeButton.addEventListener("click", async () => {
        await toggleSubscribedChannel(youtubeChannel, customSubscribeButton);
      });

      // Append button
      ownerElement.appendChild(customSubscribeButton);

      // Disconnect observer after successful processing
      if (observer) {
        observer.disconnect();
        observer = null;
        console.log("channel observer disconnected");
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
