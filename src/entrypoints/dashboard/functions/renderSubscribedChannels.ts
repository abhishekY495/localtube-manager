import numeral from "numeral";
import { Notyf } from "notyf";
import { ResponseData, YoutubeChannel } from "../../types";
import defaultChannelImage from "../assets/default-channel-image.jpg";

const notyf = new Notyf();
const BATCH_SIZE = 20;
let allSortedChannels: YoutubeChannel[] = [];
let currentIndex = 0;
let isLoading = false;
let observer: IntersectionObserver | null = null;

function createChannelElement(channel: YoutubeChannel): HTMLElement {
  const channelDiv = document.createElement("div");
  channelDiv.className = "subscribed-channel";
  channelDiv.innerHTML = `
    <a href=${channel?.handle}>
        ${
          channel?.imageUrl.length === 0
            ? `
          <img 
              class="subscribed-channel-image"
              src=${defaultChannelImage}
              alt="${channel?.name}"
          />
          `
            : `
            <img 
                class="subscribed-channel-image"
                src=${channel?.imageUrl} 
                alt="${channel?.name}"
            />
            `
        }
    </a>
    <div class="subscribed-channel-name-handle-container">
        <p 
            class="subscribed-channel-name"
            title="${channel?.name}">${channel?.name}</p>
        <p class="subscribed-channel-handle">${
          channel?.handle.includes("@")
            ? "@" + channel?.handle.split("@")[1]
            : channel?.handle.split("/")[4]
        }</p>
    </div>
    <button class="unsubscribe-btn">Unsubscribe</button>
  `;
  return channelDiv;
}

function renderBatch(
  subscribedChannelsContainer: HTMLElement,
  subscribedChannelsCount: HTMLElement,
  append: boolean = false
): void {
  if (isLoading) return;

  isLoading = true;
  const endIndex = Math.min(
    currentIndex + BATCH_SIZE,
    allSortedChannels.length
  );
  const batch = allSortedChannels.slice(currentIndex, endIndex);

  if (!append) {
    subscribedChannelsContainer.innerHTML = "";
  }

  // Remove sentinel if it exists
  const existingSentinel = subscribedChannelsContainer.querySelector(
    ".subscribed-channels-sentinel"
  );
  if (existingSentinel) {
    existingSentinel.remove();
  }

  // Render batch
  batch.forEach((channel, batchIndex) => {
    const actualIndex = currentIndex + batchIndex; // Capture the correct index before currentIndex changes
    const channelElement = createChannelElement(channel);
    subscribedChannelsContainer.appendChild(channelElement);

    // Add event listener to unsubscribe button
    const unsubscribeBtn = channelElement.querySelector(".unsubscribe-btn");
    unsubscribeBtn?.addEventListener("click", () => {
      showModal(
        allSortedChannels,
        actualIndex,
        subscribedChannelsContainer,
        subscribedChannelsCount
      );
    });
  });

  currentIndex = endIndex;

  // Add sentinel element if there are more channels
  if (currentIndex < allSortedChannels.length) {
    const sentinel = document.createElement("div");
    sentinel.className = "subscribed-channels-sentinel";
    sentinel.style.height = "1px";
    subscribedChannelsContainer.appendChild(sentinel);

    // Observe the sentinel
    if (observer) {
      observer.disconnect();
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          currentIndex < allSortedChannels.length
        ) {
          isLoading = false;
          renderBatch(
            subscribedChannelsContainer,
            subscribedChannelsCount,
            true
          );
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
  }

  isLoading = false;
}

export function renderSubscribedChannels(
  subscribedChannelsArr: YoutubeChannel[],
  subscribedChannelsContainer: HTMLElement,
  subscribedChannelsCount: HTMLElement
) {
  // Reset state
  currentIndex = 0;
  isLoading = false;
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  subscribedChannelsContainer.innerHTML = "";

  if (subscribedChannelsArr.length === 0) {
    subscribedChannelsContainer.innerHTML += `
        <p class="no-video-or-channel-message">
          Visit <a href="https://www.youtube.com" class="youtube">YouTube</a> to Subscribe channels
        </p>
      `;
  } else {
    // Sort all channels once
    allSortedChannels = subscribedChannelsArr.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // Render first batch
    renderBatch(subscribedChannelsContainer, subscribedChannelsCount, false);
  }
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
    const responseData: ResponseData = await browser.runtime.sendMessage({
      task: "toggleSubscribedChannel",
      data: { channel },
    });
    const { success, error } = responseData;

    if (success) {
      const newsubscribedChannelsArr = subscribedChannelsArr.filter(
        (subscribedChannel) => subscribedChannel?.handle !== channel?.handle
      );
      subscribedChannelsCount.innerText = numeral(
        newsubscribedChannelsArr.length
      ).format("0a");
      renderSubscribedChannels(
        newsubscribedChannelsArr,
        subscribedChannelsContainer,
        subscribedChannelsCount
      );
      closeModal(modal);
    } else {
      console.error("Error unsubscribing channel", error);
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
