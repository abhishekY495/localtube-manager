import { ResponseData, YoutubeChannel } from "@/entrypoints/types";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import { Notyf } from "notyf";

const notyf = new Notyf();

export async function toggleSubscribedChannel(
  channel: YoutubeChannel,
  customSubscribeButton: HTMLElement
) {
  try {
    const responseData: ResponseData = await browser.runtime.sendMessage({
      task: "toggleSubscribedChannel",
      data: { channel },
    });
    const { success, data, error } = responseData;

    if (success) {
      const isChannelSubscribed = data?.isChannelSubscribed;
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
          src: browser.runtime.getURL("/animation/subscribe-animation.json"),
        });
        customSubscribeButton.style.transition = "background-color 0.5s ease";
        customSubscribeButton.classList.add("custom-ltm-channel-subscribed");
        customSubscribeButton.classList.add(
          "custom-ltm-channel-subscribed-animate-bg"
        );

        setTimeout(() => {
          customSubscribeButton.classList.remove(
            "custom-ltm-channel-subscribed-animate-bg"
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
        customSubscribeButton.classList.remove("custom-ltm-channel-subscribed");
        customSubscribeButton.innerText = "Subscribe";
      }
    } else {
      console.error("Error toggling subscribed channel:", error);
      notyf.open({
        type: "error",
        message: "Something went wrong <br />Please refresh and try again",
        position: { x: "left", y: "bottom" },
        duration: 3000,
        dismissible: true,
        className: "toast-message",
        icon: false,
      });
    }
  } catch (error) {
    console.error("Error toggling subscribed channel:", error);
    notyf.open({
      type: "error",
      message: "Something went wrong <br />Please refresh and try again",
      position: { x: "left", y: "bottom" },
      duration: 3000,
      dismissible: true,
      className: "toast-message",
      icon: false,
    });
  }
}
