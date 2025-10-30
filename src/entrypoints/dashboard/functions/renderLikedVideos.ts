import numeral from "numeral";
import { Notyf } from "notyf";
import { ResponseData, Video } from "../../types";
import defaultVideoThumbnail from "../assets/default-video-thumbnail.jpg";

const notyf = new Notyf();
const BATCH_SIZE = 10;
let allSortedVideos: Video[] = [];
let currentIndex = 0;
let isLoading = false;
let observer: IntersectionObserver | null = null;

function createVideoElement(video: Video, index: number): HTMLElement {
  const videoDiv = document.createElement("div");
  videoDiv.className = "liked-video";
  videoDiv.innerHTML = `
    <p class="liked-video-index">${index + 1}</p>
    <div class="liked-video-container-1">
      <a href="https://www.youtube.com/watch?v=${video?.urlSlug}">
        <img 
          class="liked-video-thumbnail"
          src="https://i.ytimg.com/vi/${video?.urlSlug}/mqdefault.jpg"
          alt="${video?.title}"
          onerror="this.onerror=null; this.src='${defaultVideoThumbnail}';"
        />
      </a>
      <span class="liked-video-duration">${video?.duration}</span>
    </div>
    <div class="liked-video-container-2">
      <a 
        class="liked-video-title" 
        href="https://www.youtube.com/watch?v=${video?.urlSlug}"
        title="${video?.title}"
      >${video?.title}</a>
      <div>
        <p class="liked-video-channel-name" title="${video?.channelName}">${
    video?.channelName
  }</p>
        <p class="liked-video-channel-handle" title="${video?.channelHandle}">${
    video?.channelHandle?.includes("@")
      ? "@" + video?.channelHandle?.split("@")[1]
      : video?.channelHandle?.split("/")[4]
  }</p>
      </div>
      <button class="remove-btn">Remove</button>
    </div>
  `;
  return videoDiv;
}

function renderBatch(
  likedVideosContainer: HTMLElement,
  likedVideosCount: HTMLElement,
  append: boolean = false
): void {
  if (isLoading) return;

  isLoading = true;
  const endIndex = Math.min(currentIndex + BATCH_SIZE, allSortedVideos.length);
  const batch = allSortedVideos.slice(currentIndex, endIndex);

  if (!append) {
    likedVideosContainer.innerHTML = "";
  }

  // Remove sentinel if it exists
  const existingSentinel = likedVideosContainer.querySelector(
    ".liked-videos-sentinel"
  );
  if (existingSentinel) {
    existingSentinel.remove();
  }

  // Render batch
  batch.forEach((video, batchIndex) => {
    const actualIndex = currentIndex + batchIndex; // Capture the correct index before currentIndex changes
    const videoElement = createVideoElement(video, actualIndex);
    likedVideosContainer.appendChild(videoElement);

    // Add event listener to remove button
    const removeBtn = videoElement.querySelector(".remove-btn");
    removeBtn?.addEventListener("click", () => {
      showModal(
        allSortedVideos,
        actualIndex,
        likedVideosContainer,
        likedVideosCount
      );
    });
  });

  currentIndex = endIndex;

  // Add sentinel element if there are more videos
  if (currentIndex < allSortedVideos.length) {
    const sentinel = document.createElement("div");
    sentinel.className = "liked-videos-sentinel";
    sentinel.style.height = "1px";
    likedVideosContainer.appendChild(sentinel);

    // Observe the sentinel
    if (observer) {
      observer.disconnect();
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          currentIndex < allSortedVideos.length
        ) {
          isLoading = false;
          renderBatch(likedVideosContainer, likedVideosCount, true);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
  }

  isLoading = false;
}

export function renderLikedVideos(
  likedVideosArr: Video[],
  likedVideosContainer: HTMLElement,
  likedVideosCount: HTMLElement
) {
  // Reset state
  currentIndex = 0;
  isLoading = false;
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  likedVideosContainer.innerHTML = "";

  if (likedVideosArr.length === 0) {
    likedVideosContainer.innerHTML += `
        <p class="no-video-or-channel-message">
          Visit <a href="https://www.youtube.com" class="youtube">YouTube</a> to Like videos
        </p>
      `;
  } else {
    // Sort all videos once
    allSortedVideos = likedVideosArr.sort(
      (a, b) =>
        new Date(b?.addedAt)?.getTime() - new Date(a?.addedAt)?.getTime()
    );

    // Render first batch
    renderBatch(likedVideosContainer, likedVideosCount, false);
  }
}

function showModal(
  likedVideosArr: Video[],
  index: number,
  likedVideosContainer: HTMLElement,
  likedVideosCount: HTMLElement
) {
  // Create modal HTML structure
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <p class="modal-heading">Are you sure?</p>
      <div class="modal-buttons-container">
        <button class="modal-remove-btn">Remove</button>
        <button class="modal-cancel-btn">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Add event listener to "Remove" button
  const removeBtn = modal.querySelector(".modal-remove-btn")!;
  const video = likedVideosArr[index];
  removeBtn.addEventListener("click", async () => {
    const responseData: ResponseData = await browser.runtime.sendMessage({
      task: "toggleLikedVideo",
      data: { video },
    });
    const { success, error } = responseData;

    if (success) {
      const newLikedVideosArr = likedVideosArr.filter(
        (likedVideo) => likedVideo?.urlSlug !== video?.urlSlug
      );
      likedVideosCount.innerText = numeral(newLikedVideosArr.length).format(
        "0a"
      );
      renderLikedVideos(
        newLikedVideosArr,
        likedVideosContainer,
        likedVideosCount
      );
      closeModal(modal);
    } else {
      console.error("Error removing liked video", error);
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
