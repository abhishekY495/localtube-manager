import numeral from "numeral";
import defaultChannelImage from "/src/dashboard/assets/default-playlist-image.jpg";
import { LocalPlaylist, ResponseData } from "../../../types";

export function renderLocalPlaylists(
  localPlaylistArr: LocalPlaylist[],
  playlistsContainer: HTMLElement,
  playlistsCount: HTMLElement
) {
  playlistsContainer.innerHTML = "";
  if (localPlaylistArr.length === 0) {
    playlistsContainer.innerHTML += `
        <p class="no-video-or-channel-message">
          No saved playlists
        </p>
      `;
  } else {
    localPlaylistArr
      .sort(
        (a, b) =>
          new Date(b?.addedAt)?.getTime() - new Date(a?.addedAt)?.getTime()
      )
      .map((playlist: LocalPlaylist) => {
        playlistsContainer.innerHTML += `
          <div class="local-playlist">
            <div class="local-playlist-container-1">
                ${
                  playlist?.videos?.length === 0
                    ? `
                    <img 
                        class="local-playlist-image"
                        src="${defaultChannelImage}"
                        alt="${playlist?.name}"
                    />
                    `
                    : `
                    <img 
                        class="local-playlist-image"
                        src="https://i.ytimg.com/vi/${playlist?.videos[0]?.urlSlug}/mqdefault.jpg" 
                        alt="${playlist?.name}"
                    />
                    `
                }
              <span class="local-playlist-videos-count">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="12" viewBox="0 0 12 12" width="12" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M1 3h10v1H1V3Zm0 2h6v1H1V5Zm0 2h6v1H1V7Zm7-2 4 2.5L8 10V5Z"></path></svg>${
                playlist?.videos?.length
              }</span>
            </div>
            <div class="local-playlist-container-2">
              <p class="local-playlist-name" title="${playlist?.name}">${
          playlist?.name
        }</p>
            </div>
            <button class="remove-local-playlist-btn">Remove</button>
          </div>
        `;
      });

    // Add event listeners for unsubscribe buttons
    const removeButtons = playlistsContainer.querySelectorAll(
      ".remove-local-playlist-btn"
    );
    removeButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        showModal(localPlaylistArr, index, playlistsContainer, playlistsCount);
      });
    });
  }
}

function showModal(
  localPlaylistArr: LocalPlaylist[],
  index: number,
  playlistsContainer: HTMLElement,
  playlistsCount: HTMLElement
) {
  // Create modal HTML structure
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <p class="modal-heading">Are you sure?</p>
      <div class="modal-buttons-container">
        <button class="modal-remove-playlist-btn">Remove</button>
        <button class="modal-cancel-btn">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Add event listener to "Remove" button
  const removeBtn = modal.querySelector(".modal-remove-playlist-btn")!;
  const playlist = localPlaylistArr[index];
  removeBtn.addEventListener("click", async () => {
    const responseData: ResponseData = await chrome.runtime.sendMessage({
      task: "removeLocalPlaylist",
      data: { playlist },
    });
    const success = responseData?.success;

    if (success) {
      const newLocalPlaylistArr = localPlaylistArr.filter(
        (localPlaylist) => localPlaylist?.name !== playlist?.name
      );
      playlistsCount.innerText = numeral(newLocalPlaylistArr.length).format(
        "0a"
      );
      renderLocalPlaylists(
        newLocalPlaylistArr,
        playlistsContainer,
        playlistsCount
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
