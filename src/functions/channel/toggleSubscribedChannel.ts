import { DotLottie } from "@lottiefiles/dotlottie-web";
import { ResponseData, YoutubeChannel } from "../../types";

export async function toggleSubscribedChannel(
  channel: YoutubeChannel,
  customSubscribeButton: HTMLElement
) {
  try {
    const responseData: ResponseData = await chrome.runtime.sendMessage({
      task: "toggleSubscribedChannel",
      data: { channel },
    });
    const isChannelSubscribed = responseData?.data?.isChannelSubscribed;

    if (isChannelSubscribed) {
      customSubscribeButton.innerHTML = "";

      // subscribe animation
      const canvasElement = document.createElement("canvas");
      customSubscribeButton.appendChild(canvasElement);
      canvasElement.width = 140;
      canvasElement.height = 140;
      canvasElement.style.position = "absolute";
      canvasElement.style.top = "-52px";
      canvasElement.style.left = "-17px";
      canvasElement.style.visibility = "visible";
      new DotLottie({
        autoplay: true,
        loop: false,
        canvas: canvasElement,
        src: chrome.runtime.getURL("./subscribe-animation.json"),
      });
      console.log("subscribed to", channel.name);
      customSubscribeButton.style.transition = "background-color 0.5s ease";
      customSubscribeButton.classList.add(
        "custom-nologin-yt-channel-subscribed"
      );
      customSubscribeButton.classList.add(
        "custom-nologin-yt-channel-subscribed-animate-bg"
      );

      setTimeout(() => {
        customSubscribeButton.classList.remove(
          "custom-nologin-yt-channel-subscribed-animate-bg"
        );
      }, 600);
      setTimeout(() => {
        customSubscribeButton.style.transition = "none";
        canvasElement.remove();
      }, 800);

      const subscribedText = document.createElement("p");
      subscribedText.style.visibility = "visible";
      subscribedText.innerText = "Subscribed";
      customSubscribeButton.appendChild(subscribedText);
    } else {
      console.log("unsubscribed from", channel.name);
      customSubscribeButton.classList.remove(
        "custom-nologin-yt-channel-subscribed"
      );
      customSubscribeButton.innerText = "Subscribe";
    }
  } catch (error) {
    console.error("Error toggling subscribed channel:", error);
  }
}
