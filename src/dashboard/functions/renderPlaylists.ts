import numeral from "numeral";
import defaultChannelImage from "/src/dashboard/assets/default-channel-image.jpg";
import { ResponseData, YoutubePlaylist } from "../../types";

export function renderPlaylists(
  youtubePlaylistsArr: YoutubePlaylist[],
  playlistsContainer: HTMLElement,
  playlistsCount: HTMLElement
) {
  playlistsContainer.innerHTML = "";
  if (youtubePlaylistsArr.length === 0) {
    playlistsContainer.innerHTML += `
        <p class="no-video-or-channel-message">
          No saved playlists
        </p>
      `;
  } else {
    youtubePlaylistsArr
      .sort(
        (a, b) =>
          new Date(b?.addedAt)?.getTime() - new Date(a?.addedAt)?.getTime()
      )
      .map((playlist: YoutubePlaylist) => {
        playlistsContainer.innerHTML += `
          <div class="youtube-playlist">
            <div class="youtube-playlist-container-1">
              <a href="https://www.youtube.com/playlist?list=${
                playlist?.urlSlug
              }">
                ${
                  playlist?.coverImageUrlSlug.length === 0
                    ? `
                    <img 
                        class="youtube-playlist-image"
                        src=${defaultChannelImage}
                        alt="${playlist?.name}"
                    />
                    `
                    : `
                    <img 
                        class="youtube-playlist-image"
                        src="https://i.ytimg.com/vi/${playlist?.coverImageUrlSlug}/mqdefault.jpg" 
                        alt="${playlist?.name}"
                    />
                    `
                }
              </a>
              <span class="youtube-playlist-videos-count">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="12" viewBox="0 0 12 12" width="12" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M1 3h10v1H1V3Zm0 2h6v1H1V5Zm0 2h6v1H1V7Zm7-2 4 2.5L8 10V5Z"></path></svg>${
                playlist.videosCount
              }</span>
            </div>
            <div class="youtube-playlist-container-2">
              <a href="https://www.youtube.com/playlist?list=${
                playlist?.urlSlug
              }" class="youtube-playlist-name" title="${playlist.name}">${
          playlist.name
        }
              </a>
              <p class="youtube-playlist-channelname" title="${
                playlist.channelName
              }">@${playlist.channelName.trim()}</p>
            </div>
            <button class="remove-youtube-playlist-btn">Remove</button>
          </div>
        `;
      });

    // Add event listeners for unsubscribe buttons
    const removeButtons = playlistsContainer.querySelectorAll(
      ".remove-youtube-playlist-btn"
    );
    removeButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        showModal(
          youtubePlaylistsArr,
          index,
          playlistsContainer,
          playlistsCount
        );
      });
    });
  }
}

function showModal(
  youtubePlaylistsArr: YoutubePlaylist[],
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
        <button class="modal-remove-youtube-playlist-btn">Remove</button>
        <button class="modal-cancel-btn">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Add event listener to "Remove" button
  const removeBtn = modal.querySelector(".modal-remove-youtube-playlist-btn")!;
  const playlist = youtubePlaylistsArr[index];
  removeBtn.addEventListener("click", async () => {
    const responseData: ResponseData = await chrome.runtime.sendMessage({
      task: "toggleYoutubePlaylist",
      data: { playlist },
    });
    const success = responseData?.success;

    if (success) {
      const newyoutubePlaylistsArr = youtubePlaylistsArr.filter(
        (youtubePLaylist) => youtubePLaylist?.urlSlug !== playlist?.urlSlug
      );
      playlistsCount.innerText = numeral(newyoutubePlaylistsArr.length).format(
        "0a"
      );
      renderPlaylists(
        newyoutubePlaylistsArr,
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
