import numeral from "numeral";
import { ResponseData, Video } from "../../types";

export function renderLikedVideos(
  likedVideosArr: Video[],
  likedVideosContainer: HTMLElement,
  likedVideosCount: HTMLElement
) {
  likedVideosContainer.innerHTML = "";
  likedVideosArr
    .sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    )
    .map((video: Video, index: number) => {
      likedVideosContainer.innerHTML += `
      <div class="liked-video">
        <p class="liked-video-index">${index}</p>
        <div class="liked-video-container-1">
          <a href="https://www.youtube.com/watch?v=${video.urlSlug}">
            <img 
              class="liked-video-thumbnail"
              src="https://i.ytimg.com/vi/${video.urlSlug}/mqdefault.jpg"
              alt="${video.title}"
            />
          </a>
          <span class="liked-video-duration">${video.duration}</span>
        </div>
        <div class="liked-video-container-2">
          <a 
            class="liked-video-title" 
            href="https://www.youtube.com/watch?v=${video.urlSlug}"
          >
            ${video.title}
          </a>
          <p class="liked-video-channel-name">${video.channelName}</p>
          <button class="remove-btn">Remove</button>
        </div>
      </div>
    `;
    });

  // Add event listeners for remove buttons
  const removeButtons = likedVideosContainer.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      showModal(likedVideosArr, index, likedVideosContainer, likedVideosCount);
    });
  });
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
    const responseData: ResponseData = await chrome.runtime.sendMessage({
      task: "toggleLikedVideo",
      data: { video },
    });
    const success = responseData?.success;

    if (success) {
      const newLikedVideosArr = likedVideosArr.filter(
        (likedVideo) => likedVideo.urlSlug !== video.urlSlug
      );
      likedVideosCount.innerText = numeral(newLikedVideosArr.length).format(
        "0a"
      );
      renderLikedVideos(
        newLikedVideosArr,
        likedVideosContainer,
        likedVideosCount
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
