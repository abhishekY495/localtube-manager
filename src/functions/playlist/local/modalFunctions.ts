import { crossIcon } from "../../../helpers/playlist/crossIcon";
import { LocalPlaylist, ResponseData, Video } from "../../../types";

export function showAddVideoToModal(
  localPlaylists: LocalPlaylist[],
  video: Video
) {
  console.log(localPlaylists);
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
        <div class="modal-header-container">
            <p class="modal-heading">Add video to</p>
            <div class="nologin-yt-cross-icon-container">${crossIcon}</div>
        </div>
        <div class="modal-content">
        <div class="playlists-container">
            ${
              localPlaylists.length === 0
                ? `<p class="no-local-playlist-msg">No Local Playlists</p>`
                : localPlaylists
                    .map((playlist) => {
                      return `
                      <label class="playlist">
                        <input type="checkbox" />
                        ${playlist.name}
                      </label>`;
                    })
                    .join("")
            }
        </div>
        <button class="create-playlist-btn">Create +</button>
        </div>
    </div>
    `;
  document.body.appendChild(modal);

  // Add event listener to cross icon
  const crossIconContainer = modal.querySelector(
    ".nologin-yt-cross-icon-container"
  )!;
  crossIconContainer.addEventListener("click", () => modal.remove());

  // Close modal when clicking outside of it
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Add event listener to create playlist btn
  const createPlaylistBtn = modal.querySelector(".create-playlist-btn")!;
  createPlaylistBtn.addEventListener("click", () => {
    showCreateLocalPlaylist(modal, video, localPlaylists);
  });
}

function showCreateLocalPlaylist(
  modal: HTMLElement,
  video: Video,
  localPlaylists: LocalPlaylist[]
) {
  modal.innerHTML = "";
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header-container">
        <p class="modal-heading">Create Local Playlist</p>
        <div class="nologin-yt-cross-icon-container">${crossIcon}</div>
      </div>
      <form class="modal-content create-local-playlist-form">
        <input type="text" placeholder="Playlist name" class="playlist-name-input" required />
        <button class="create-playlist-btn-real" type="submit">Create and Add video</button>
      </form>
    </div>
    `;
  // Add event listener to cross icon
  const crossIconContainer2 = modal.querySelector(
    ".nologin-yt-cross-icon-container"
  )!;
  crossIconContainer2.addEventListener("click", () => modal.remove());

  // form submission
  const form = modal.querySelector(".create-local-playlist-form")!;
  const playlistNameInput = modal.querySelector(
    ".playlist-name-input"
  )! as HTMLInputElement;
  //
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const playlistName = playlistNameInput.value.trim();
    if (playlistName.length !== 0) {
      const playlist: LocalPlaylist = {
        name: playlistName,
        addedAt: new Date().toISOString(),
        videos: [video],
      };
      const playListNameExists = localPlaylists.some(
        (playlist) => playlist.name.toLowerCase() === playlistName.toLowerCase()
      );

      if (playListNameExists) {
        alert("Playlist name aleady exists");
      } else {
        const responseData: ResponseData = await chrome.runtime.sendMessage({
          task: "createLocalPlaylist",
          data: { playlist },
        });
        console.log(responseData);
        if (responseData?.success) {
          modal.remove();
        } else {
          alert("Something went wrong, Refresh and try again.");
        }
      }
    } else {
      alert("Playlist name cannot be empty");
    }
  });
}
