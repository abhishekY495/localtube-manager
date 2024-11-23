import { DotLottie } from "@lottiefiles/dotlottie-web";
import { YoutubeChannel } from "../../types";
import { initializeYoutubeDB } from "../initializeYoutubeDB";

export async function toggleSubscribedChannel(
  channel: YoutubeChannel,
  customSubscribeButton: HTMLElement
) {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("subscribedChannels", "readwrite");
  const subscribedChannelsStore = tx.objectStore("subscribedChannels");

  try {
    const subscribedChannel: YoutubeChannel = await subscribedChannelsStore.get(
      channel.handle
    );
    if (subscribedChannel) {
      await subscribedChannelsStore.delete(channel.handle);
      console.log("unsubscribed from", subscribedChannel.name);
      customSubscribeButton.classList.remove("custom-yt-channel-subscribed");
      customSubscribeButton.innerText = "Subscribe";
    } else {
      await subscribedChannelsStore.add(channel);
      customSubscribeButton.innerHTML = "";

      // subscribe animation
      const canvasElement = document.createElement("canvas");
      customSubscribeButton.appendChild(canvasElement);
      canvasElement.width = 140;
      canvasElement.height = 140;
      canvasElement.style.position = "absolute";
      canvasElement.style.top = "-52px";
      canvasElement.style.left = "-17px";
      new DotLottie({
        autoplay: true,
        loop: false,
        canvas: canvasElement,
        src: chrome.runtime.getURL("./subscribe-animation.json"),
      });
      console.log("subscribed to", channel.name);
      customSubscribeButton.classList.add("custom-yt-channel-subscribed");
      customSubscribeButton.classList.add(
        "custom-yt-channel-subscribed-animate-bg"
      );

      setTimeout(() => {
        customSubscribeButton.classList.remove(
          "custom-yt-channel-subscribed-animate-bg"
        );
      }, 300);

      const subscribedText = document.createElement("p");
      subscribedText.innerText = "Subscribed";
      customSubscribeButton.appendChild(subscribedText);
    }
    await tx.done;
  } catch (error) {
    console.error("Error toggling subscribed channel:", error);
  }
}
