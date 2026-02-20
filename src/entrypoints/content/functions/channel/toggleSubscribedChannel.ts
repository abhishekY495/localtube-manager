import { ResponseData, YoutubeChannel } from "@/entrypoints/types";
import { Notyf } from "notyf";

const notyf = new Notyf();

export async function toggleSubscribedChannel(
  channel: YoutubeChannel,
  customSubscribeButton: HTMLElement,
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

        customSubscribeButton.style.transition = "background-color 0.5s ease";
        customSubscribeButton.classList.add("custom-ltm-channel-subscribed");
        customSubscribeButton.classList.add(
          "custom-ltm-channel-subscribed-animate-bg",
        );

        setTimeout(() => {
          customSubscribeButton.classList.remove(
            "custom-ltm-channel-subscribed-animate-bg",
          );
        }, 600);

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
