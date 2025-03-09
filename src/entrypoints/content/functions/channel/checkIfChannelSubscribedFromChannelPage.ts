import { ResponseData, YoutubeChannel } from "@/entrypoints/types";
import { waitForAllElements } from "../../helpers/waitForAllElements";
import { getChannelObjFromChannelPage } from "../../helpers/channel/getChannelObjFromChannelPage";
import { toggleSubscribedChannel } from "./toggleSubscribedChannel";

const selectors1 = ["#page-header", "yt-flexible-actions-view-model"];
const selectors2 = ["#page-header", "yt-content-metadata-view-model"];

export async function checkIfChannelSubscribedFromChannelPage(
  channelUrl: string
) {
  console.log("🎬 Starting checkIfChannelSubscribedFromChannelPage");
  let isSubscribed: boolean = false;
  let isSubscribedFromId: boolean = false;
  let isSubscribedFromHandle: boolean = false;

  try {
    // Wait for all elements to be loaded
    await waitForAllElements(selectors1);
    await waitForAllElements(selectors2);
    console.log("✨ All elements are ready");

    // Now we can safely get all elements
    const pageHeaderElement = document.querySelector(
      selectors1[0]
    ) as HTMLElement;
    const channelActionsViewModal = pageHeaderElement.querySelector(
      selectors1[1]
    ) as HTMLElement;
    const contentMetadataViewModel = pageHeaderElement.querySelector(
      selectors2[1]
    ) as HTMLElement;

    const channelHandleElement = contentMetadataViewModel.querySelector(
      "span"
    ) as HTMLElement;
    const channelHandle = channelHandleElement.innerText;

    // Get channel info and subscription status
    const responseData: ResponseData = await browser.runtime.sendMessage({
      task: "checkIfChannelSubscribed",
      data: { channelHandle: `https://www.youtube.com/${channelHandle}` },
    });
    const channel: YoutubeChannel = responseData?.data?.channel;
    if (channel) {
      isSubscribedFromHandle = true;
      console.log("subscribed from handle");
      if (!isSubscribedFromHandle) {
        console.log("not subscribed from handle, checking id");
        isSubscribedFromId = channel?.id === channelUrl;
      }
    }
    // final subscription check
    if (isSubscribedFromHandle || isSubscribedFromId) {
      isSubscribed = true;
      console.log("subscribed to", channelHandle);
    } else {
      isSubscribed = false;
      console.log("not subscribed to", channelHandle);
    }

    // Remove any existing buttons
    const myCustomSubscribeButtons = document.querySelectorAll(
      ".custom-ltm-subscribe-btn-channel-page"
    );
    if (myCustomSubscribeButtons.length > 0) {
      console.log(
        `🗑️ Removing ${myCustomSubscribeButtons.length} existing button(s)`
      );
      myCustomSubscribeButtons.forEach((button) => button.remove());
    }

    // Create and append new button
    const customSubscribeButton = document.createElement("div");
    customSubscribeButton.classList.add(
      "custom-ltm-subscribe-btn-channel-page"
    );
    if (isSubscribed) {
      customSubscribeButton.innerText = "Subscribed";
      customSubscribeButton.classList.add("custom-ltm-channel-subscribed");
    } else {
      customSubscribeButton.innerText = "Subscribe";
      customSubscribeButton.classList.remove("custom-ltm-channel-subscribed");
    }
    customSubscribeButton.style.visibility = "visible";
    channelActionsViewModal.prepend(customSubscribeButton);

    // Add click event listener
    customSubscribeButton.addEventListener("click", async () => {
      console.log("👆 Subscribe button clicked");
      const youtubeChannel = getChannelObjFromChannelPage(pageHeaderElement);
      await toggleSubscribedChannel(youtubeChannel, customSubscribeButton);
    });
  } catch (error) {
    console.log(error);
  }
}
