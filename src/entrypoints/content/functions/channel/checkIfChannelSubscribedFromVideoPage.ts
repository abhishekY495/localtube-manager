import { ResponseData } from "@/entrypoints/types";
import { waitForAllElements } from "../../helpers/waitForAllElements";
import { getChannelObjFromVideoPage } from "../../helpers/channel/getChannelObjFromVideoPage";
import { toggleSubscribedChannel } from "./toggleSubscribedChannel";

const selectors = ["#above-the-fold", "#owner"];

export async function checkIfChannelSubscribedFromVideoPage() {
  console.log("🎬 Starting checkIfChannelSubscribedFromVideoPage");

  try {
    // Wait for all elements to be loaded
    await waitForAllElements(selectors);
    console.log("✨ All elements are ready");

    // Now we can safely get all elements
    const aboveTheFoldElement = document.querySelector(
      selectors[0],
    ) as HTMLElement;
    const ownerElement = aboveTheFoldElement.querySelector(
      selectors[1],
    ) as HTMLElement;

    // Remove any existing buttons
    const existingButtons = document.querySelectorAll(
      ".custom-ltm-subscribe-btn-video-page",
    );
    if (existingButtons.length > 0) {
      console.log(`🗑️ Removing ${existingButtons.length} existing button(s)`);
      existingButtons.forEach((button) => button.remove());
    }

    // Get channel info and subscription status
    const youtubeChannel = await getChannelObjFromVideoPage(ownerElement);
    const responseData: ResponseData = await browser.runtime.sendMessage({
      task: "checkIfChannelSubscribed",
      data: { channelHandle: youtubeChannel.handle },
    });
    const isChannelSubscribed = responseData?.data?.isChannelSubscribed;
    console.log(
      `💾 Subscription status: ${
        isChannelSubscribed ? "Subscribed" : "Not subscribed"
      }`,
    );

    // Create and append new button
    const customSubscribeButton = document.createElement("div");
    customSubscribeButton.classList.add("custom-ltm-subscribe-btn-video-page");
    if (isChannelSubscribed) {
      customSubscribeButton.innerText = "Subscribed";
      customSubscribeButton.classList.add("custom-ltm-channel-subscribed");
    } else {
      customSubscribeButton.innerText = "Subscribe";
      customSubscribeButton.classList.remove("custom-ltm-channel-subscribed");
    }
    ownerElement.appendChild(customSubscribeButton);

    // Add click event listener
    customSubscribeButton.addEventListener("click", async () => {
      console.log("👆 Subscribe button clicked");
      await toggleSubscribedChannel(youtubeChannel, customSubscribeButton);
    });
  } catch (error) {
    console.log(error);
  }
}
