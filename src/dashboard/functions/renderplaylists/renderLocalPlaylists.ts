import numeral from "numeral";
import { Notyf } from "notyf";
import { LocalPlaylist, ResponseData } from "../../../types";
import defaultChannelImage from "/src/dashboard/assets/default-playlist-image.jpg";
import defaultVideoThumbnail from "/src/dashboard/assets/default-video-thumbnail.jpg";

const notyf = new Notyf();

export function renderLocalPlaylists(
  localPlaylistArr: LocalPlaylist[],
  playlistsContainer: HTMLElement,
  playlistsCount: HTMLElement
) {
  playlistsContainer.innerHTML = "";
  if (localPlaylistArr.length === 0) {
    playlistsContainer.innerHTML += `
        <p class="no-video-or-channel-message">
          No Local playlists
        </p>
      `;
  } else {
    localPlaylistArr
      .sort(
        (a, b) =>
          new Date(b?.addedAt)?.getTime() - new Date(a?.addedAt)?.getTime()
      )
      .map((playlist: LocalPlaylist, index) => {
        playlistsContainer.innerHTML += `
          <div class="local-playlist" data-index="${index}">
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

    // Add event listener for unsubscribe buttons
    const removeButtons = playlistsContainer.querySelectorAll(
      ".remove-local-playlist-btn"
    );
    removeButtons.forEach((btn, index) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        showRemovePlaylistModal(
          localPlaylistArr,
          index,
          playlistsContainer,
          playlistsCount
        );
      });
    });

    // Add event listener for on click of a local-playlist
    playlistsContainer.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      // Find the closest element with the class "local-playlist"
      const playlistDiv = target.closest(".local-playlist");

      if (playlistDiv) {
        // Get the index of the clicked playlist from the dataset
        const playlistIndex = playlistDiv.getAttribute("data-index");
        if (playlistIndex !== null) {
          const selectedPlaylist = localPlaylistArr[Number(playlistIndex)];
          showSelectedPlaylistVideos(playlistsContainer, selectedPlaylist);
        }
      }
    });
  }
}

function showRemovePlaylistModal(
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
    const { success, error } = responseData;

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
      closeModal(modal);
    } else {
      console.error("Error removing local playlist", error);
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

function showSelectedPlaylistVideos(
  playlistsContainer: HTMLElement,
  selectedPlaylist: LocalPlaylist
) {
  playlistsContainer.style.display = "block";
  playlistsContainer.innerHTML = "";
  playlistsContainer.innerHTML = `
    <div class="selected-playlist">
      <div class="selected-playlist-container-1">
        <p class="selected-playlist-name">${selectedPlaylist?.name}</p>
        <div class="selected-playlist-videos-container">
          ${selectedPlaylist?.videos
            .map((video, index) => {
              return `
              <div class="selected-playlist-video ${
                index === 0 && "selected-video"
              }" data-index="${index}">
                <div class="selected-playlist-video-container-1">
                  <img
                    class="video-thumbnail" 
                    src="https://i.ytimg.com/vi/${video?.urlSlug}/mqdefault.jpg"
                    alt="${video?.title}"
                    onerror="this.onerror=null; this.src='${defaultVideoThumbnail}';"
                  />
                  <span class="video-duration">${video?.duration}</span>
                </div>
                <div class="selected-playlist-video-container-2">
                  <p class="video-title">${video?.title}</p>
                  <p class="channel-name">${video?.channelName}</p>
                  <button class="remove-video-from-playlist-btn">Remove</button>
                </div>
              </div>
            `;
            })
            .join("")}               
        </div>
      </div>
      <div class="selected-playlist-container-2">
        <iframe class="video-iframe" allowfullscreen width="100%" height="100%" src="https://www.youtube.com/embed/${
          selectedPlaylist?.videos[0]?.urlSlug
        }"></iframe>
      </div>
    </div>
  `;

  // Add event listener to each video div
  const videoDivs = playlistsContainer.querySelectorAll(
    ".selected-playlist-video"
  );
  const iframe = playlistsContainer.querySelector(
    ".video-iframe"
  )! as HTMLIFrameElement;
  videoDivs.forEach((videoDiv) => {
    videoDiv.addEventListener("click", () => {
      videoDivs.forEach((div) => div.classList.remove("selected-video"));
      videoDiv.classList.add("selected-video");
      const videoIndex = videoDiv.getAttribute("data-index");
      const clickedVideo = selectedPlaylist?.videos[Number(videoIndex)];

      if (clickedVideo) {
        iframe.src = `https://www.youtube.com/embed/${clickedVideo.urlSlug}`;
      }
    });
  });

  // Add event listener to remove btns
  const removeBtns = playlistsContainer.querySelectorAll(
    ".remove-video-from-playlist-btn"
  )! as NodeList;
  if (removeBtns.length !== 0) {
    removeBtns.forEach((removeBtn, index) => {
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showRemoveVideoFromPlaylistModal(
          selectedPlaylist,
          index,
          playlistsContainer
        );
      });
    });
  }
}

function showRemoveVideoFromPlaylistModal(
  selectedPlaylist: LocalPlaylist,
  index: number,
  playlistsContainer: HTMLElement
) {
  // Create modal HTML structure
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <p class="modal-heading">Are you sure?</p>
      <div class="modal-buttons-container">
        <button class="modal-remove-video-from-playlist-btn">Remove</button>
        <button class="modal-cancel-btn">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Add event listener to "Remove" button
  const removeBtn = modal.querySelector(
    ".modal-remove-video-from-playlist-btn"
  )!;
  const video = selectedPlaylist.videos[index];
  removeBtn.addEventListener("click", async () => {
    const responseData: ResponseData = await chrome.runtime.sendMessage({
      task: "removeVideoFromLocalPlaylist",
      data: { playlistName: selectedPlaylist.name, videoData: video },
    });
    const { success, data, error } = responseData;

    if (success) {
      const updatedPlaylist = data?.updatedPlaylist;
      showSelectedPlaylistVideos(playlistsContainer, updatedPlaylist);
      closeModal(modal);
    } else {
      console.error("Error removing video from local playlist", error);
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
