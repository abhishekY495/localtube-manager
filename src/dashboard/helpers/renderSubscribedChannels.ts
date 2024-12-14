import numeral from "numeral";
import { ResponseData, YoutubeChannel } from "../../types";

export function renderSubscribedChannels(
  subscribedChannelsArr: YoutubeChannel[],
  subscribedChannelsContainer: HTMLElement,
  subscribedChannelsCount: HTMLElement
) {
  subscribedChannelsContainer.innerHTML = "";
  subscribedChannelsArr
    .sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    )
    .map((channel: YoutubeChannel) => {
      subscribedChannelsContainer.innerHTML += `
      <div class="subscribed-channel">
        <a href=${channel.handle}>
            <img 
                class="subscribed-channel-image"
                src=${channel.imageUrl} 
                alt="${channel.name}"
            />
        </a>
        <div class="subscribed-channel-name-handle-container">
            <p 
                class="subscribed-channel-name"
                title="${channel.name}">${channel.name}</p>
            <p class="subscribed-channel-handle">@${
              channel.handle.split("@")[1]
            }</p>
        </div>
        <button class="unsubscribe-btn">Unsubscribe</button>
      </div>
    `;
    });

  // Add event listeners for unsubscribe buttons
  const removeButtons =
    subscribedChannelsContainer.querySelectorAll(".unsubscribe-btn");
  removeButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      showModal(
        subscribedChannelsArr,
        index,
        subscribedChannelsContainer,
        subscribedChannelsCount
      );
    });
  });
}

function showModal(
  subscribedChannelsArr: YoutubeChannel[],
  index: number,
  subscribedChannelsContainer: HTMLElement,
  subscribedChannelsCount: HTMLElement
) {
  // Create modal HTML structure
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <p class="modal-heading">Are you sure?</p>
      <div class="modal-buttons-container">
        <button class="modal-unsubscribe-btn">Unsubscribe</button>
        <button class="modal-cancel-btn">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Add event listener to "Unsubscribe" button
  const unsubscribeBtn = modal.querySelector(".modal-unsubscribe-btn")!;
  const channel = subscribedChannelsArr[index];
  unsubscribeBtn.addEventListener("click", async () => {
    const responseData: ResponseData = await chrome.runtime.sendMessage({
      task: "toggleSubscribedChannel",
      data: { channel },
    });
    const success = responseData?.success;

    if (success) {
      const newsubscribedChannelsArr = subscribedChannelsArr.filter(
        (subscribedChannel) => subscribedChannel.handle !== channel.handle
      );
      subscribedChannelsCount.innerText = numeral(
        newsubscribedChannelsArr.length
      ).format("0a");
      renderSubscribedChannels(
        newsubscribedChannelsArr,
        subscribedChannelsContainer,
        subscribedChannelsCount
      );
    }

    closeModal(modal);
  });

  // Add event listener to "Cancel" button
  const cancelBtn = modal.querySelector(".modal-cancel-btn")!;
  cancelBtn.addEventListener("click", () => closeModal(modal));

  // Close modal when clicking outside of it
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
}

function closeModal(modal: HTMLElement) {
  modal.remove();
}
