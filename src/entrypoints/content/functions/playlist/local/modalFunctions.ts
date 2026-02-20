import { Notyf } from "notyf";
import {
  LocalPlaylist,
  LocalPlaylistNotDetailed,
  ResponseData,
  Video,
} from "@/entrypoints/types";
import { crossIcon } from "@/entrypoints/content/helpers/playlist/crossIcon";

const notyf = new Notyf();

export function showAddVideoToModal(
  localPlaylists: LocalPlaylistNotDetailed[],
  video: Video,
) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
        <div class="modal-header-container">
            <p class="modal-heading">Add video to</p>
            <div class="ltm-cross-icon-container">${crossIcon}</div>
        </div>
        <div class="modal-content">
        <div class="playlists-container">
          ${
            localPlaylists.length === 0
              ? `<p class="no-local-playlist-msg">No Local Playlists</p>`
              : localPlaylists
                  .map((playlist) => {
                    const isSlugInPlaylist = playlist.videos.includes(
                      video.urlSlug,
                    );
                    return `
                    <label class="playlist">
                      <input type="checkbox" ${
                        isSlugInPlaylist ? "checked" : ""
                      } data-playlist-name="${playlist.name}" />
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

  // Add event listener to checkboxes
  const checkboxes = modal.querySelectorAll(
    ".playlists-container input[type='checkbox']",
  )!;
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", async (e) => {
      const target = e.target as HTMLInputElement;
      const playlistName = target.dataset.playlistName;
      if (target.checked) {
        const responseData: ResponseData = await browser.runtime.sendMessage({
          task: "addVideoToLocalPlaylist",
          data: { playlistName, videoData: video },
        });
        const { error } = responseData;
        if (error) {
          console.error("Error adding video to local playlists:", error);
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
      } else {
        const responseData: ResponseData = await browser.runtime.sendMessage({
          task: "removeVideoFromLocalPlaylist",
          data: { playlistName, videoData: video },
        });
        const { error } = responseData;
        if (error) {
          console.error("Error removing video from local playlists:", error);
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
    });
  });

  // Add event listener to cross icon
  const crossIconContainer = modal.querySelector(".ltm-cross-icon-container")!;
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
  localPlaylists: LocalPlaylistNotDetailed[],
) {
  modal.innerHTML = "";
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header-container">
        <p class="modal-heading">Create Local Playlist</p>
        <div class="ltm-cross-icon-container">${crossIcon}</div>
      </div>
      <form class="modal-content create-local-playlist-form">
        <input type="text" placeholder="Playlist name" class="playlist-name-input" required />
        <button class="create-playlist-btn-real" type="submit">Create and Add video</button>
      </form>
    </div>
    `;
  // Add event listener to cross icon
  const crossIconContainer2 = modal.querySelector(".ltm-cross-icon-container")!;
  crossIconContainer2.addEventListener("click", () => modal.remove());

  // form submission
  const form = modal.querySelector(".create-local-playlist-form")!;
  const playlistNameInput = modal.querySelector(
    ".playlist-name-input",
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
        (playlist) =>
          playlist.name.toLowerCase() === playlistName.toLowerCase(),
      );

      if (playListNameExists) {
        alert("Playlist name aleady exists");
      } else {
        const responseData: ResponseData = await browser.runtime.sendMessage({
          task: "createLocalPlaylist",
          data: { playlist },
        });
        const { error, success } = responseData;
        if (success) {
          modal.remove();
        } else {
          console.error("Error creating local playlists:", error);
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
    } else {
      alert("Playlist name cannot be empty");
    }
  });
}
