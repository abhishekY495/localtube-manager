import "./css/dashboard.css";
import "./css/likedVideos.css";
import "./css/subscribedChannels.css";
import "./css/playlist.css";
import "notyf/notyf.min.css";
import numeral from "numeral";
import { Notyf } from "notyf";
import {
  LocalPlaylist,
  Video,
  YoutubeChannel,
  YoutubePlaylist,
} from "../types";
import { getSubscribedChannels } from "../indexedDB/channel";
import { getLikedVideos } from "../indexedDB/video";
import {
  getLocalPlaylistsDetailed,
  getYoutubePlaylists,
} from "../indexedDB/playlist";
import { clearDB } from "../indexedDB/clearDB";
import { renderLikedVideos } from "./functions/renderLikedVideos";
import { renderSubscribedChannels } from "./functions/renderSubscribedChannels";
import { renderYoutubePlaylists } from "./functions/renderplaylists/renderYoutubePlaylists";
import { renderLocalPlaylists } from "./functions/renderplaylists/renderLocalPlaylists";

const notyf = new Notyf();
let likedVideosArr: Video[] = [];
let subscribedChannelsArr: YoutubeChannel[] = [];
let youtubePlaylistsArr: YoutubePlaylist[] = [];
let localPlaylistsArr: LocalPlaylist[] = [];
let selectedPlaylistType: "youtube" | "local" = "youtube";

(async () => {
  likedVideosArr = await getLikedVideos();
  subscribedChannelsArr = await getSubscribedChannels();
  youtubePlaylistsArr = await getYoutubePlaylists();
  localPlaylistsArr = await getLocalPlaylistsDetailed();

  const likedVideosIconCountContainer = document.querySelector(
    ".liked-videos-icon-count-container"
  ) as HTMLElement;
  const subscribedChannelsIconCountContainer = document.querySelector(
    ".subscribed-channels-icon-count-container"
  ) as HTMLElement;
  const playlistsIconCountContainer = document.querySelector(
    ".playlists-icon-count-container"
  ) as HTMLElement;
  const importExportIconContainer = document.querySelector(
    ".import-export-icon-container"
  ) as HTMLElement;
  //
  const likedVideosCount = document.querySelector(
    "#liked-videos-count"
  ) as HTMLElement;
  const subscribedChannelsCount = document.querySelector(
    "#subscribed-channels-count"
  ) as HTMLElement;
  const playlistsCount = document.querySelector(
    "#playlists-count"
  ) as HTMLElement;
  const youtubePlaylistsCount = document.querySelector(
    ".youtube-playlists-count"
  ) as HTMLElement;
  const localPlaylistsCount = document.querySelector(
    ".local-playlists-count"
  ) as HTMLElement;
  //
  const dashboardContainer = document.querySelector(
    "#dashboard-container"
  ) as HTMLElement;
  const likedVideosContainer = document.querySelector(
    "#liked-videos-container"
  ) as HTMLElement;
  const subscribedChannelsContainer = document.querySelector(
    "#subscribed-channels-container"
  ) as HTMLElement;
  const playlistsMainContainer = document.querySelector(
    "#playlists-main-container"
  ) as HTMLElement;
  const youtubePlaylistsBtn = document.querySelector(
    ".youtube-playlists-btn"
  ) as HTMLButtonElement;
  const localPlaylistsBtn = document.querySelector(
    ".local-playlists-btn"
  ) as HTMLButtonElement;
  const playlistsContainer = document.querySelector(
    "#playlists-container"
  ) as HTMLElement;
  const importExportContainer = document.querySelector(
    "#import-export-container"
  ) as HTMLElement;

  //
  //

  //
  //

  // Setting count
  if (likedVideosCount) {
    likedVideosCount.innerText = numeral(likedVideosArr.length).format("0a");
  }
  if (subscribedChannelsCount) {
    subscribedChannelsCount.innerText = numeral(
      subscribedChannelsArr.length
    ).format("0a");
  }
  if (playlistsCount) {
    youtubePlaylistsCount.innerText = numeral(
      youtubePlaylistsArr.length
    ).format("0a");
    localPlaylistsCount.innerText = numeral(localPlaylistsArr.length).format(
      "0a"
    );
    const totalPlaylistCount =
      youtubePlaylistsArr.length + localPlaylistsArr.length;
    playlistsCount.innerText = numeral(totalPlaylistCount).format("0a");
  }
  // Setting option based on url slug
  const location = window.location.href;
  const url = location.split("#")[0];
  const slug = location.split("#")[1];
  if (slug === "liked-videos") {
    likedVideosIconCountContainer?.classList.add(
      "selected-liked-videos-icon-count-container"
    );
    if (likedVideosArr) {
      renderLikedVideos(likedVideosArr, likedVideosContainer, likedVideosCount);
    }
    dashboardContainer.style.display = "none";
    likedVideosContainer.style.display = "flex";
    subscribedChannelsContainer.style.display = "none";
    playlistsMainContainer.style.display = "none";
    playlistsContainer.style.display = "none";
    importExportContainer.style.display = "none";
  } else if (slug === "subscribed-channels") {
    subscribedChannelsIconCountContainer?.classList.add(
      "selected-subscribed-channels-icon-count-container"
    );
    if (subscribedChannelsArr) {
      renderSubscribedChannels(
        subscribedChannelsArr,
        subscribedChannelsContainer,
        subscribedChannelsCount
      );
    }
    dashboardContainer.style.display = "none";
    likedVideosContainer.style.display = "none";
    subscribedChannelsContainer.style.display = "grid";
    playlistsMainContainer.style.display = "none";
    playlistsContainer.style.display = "none";
    importExportContainer.style.display = "none";
  } else if (slug === "playlists") {
    playlistsIconCountContainer?.classList.add(
      "selected-playlists-icon-count-container"
    );
    if (youtubePlaylistsArr) {
      renderYoutubePlaylists(
        youtubePlaylistsArr,
        playlistsContainer,
        playlistsCount
      );
    }
    dashboardContainer.style.display = "none";
    likedVideosContainer.style.display = "none";
    subscribedChannelsContainer.style.display = "none";
    playlistsMainContainer.style.display = "flex";
    playlistsContainer.style.display = "grid";
    importExportContainer.style.display = "none";
  } else if (slug === "import-export") {
    importExportIconContainer?.classList.add(
      "selected-import-export-icon-container"
    );
    likedVideosIconCountContainer?.classList.remove(
      "selected-liked-videos-icon-count-container"
    );
    subscribedChannelsIconCountContainer?.classList.remove(
      "selected-subscribed-channels-icon-count-container"
    );
    playlistsIconCountContainer?.classList.remove(
      "selected-playlists-icon-count-container"
    );
    dashboardContainer.style.display = "none";
    likedVideosContainer.style.display = "none";
    subscribedChannelsContainer.style.display = "none";
    playlistsMainContainer.style.display = "none";
    playlistsContainer.style.display = "none";
    importExportContainer.style.display = "flex";
  } else {
    if (dashboardContainer) {
      dashboardContainer.style.display = "block";
      likedVideosContainer.style.display = "none";
      subscribedChannelsContainer.style.display = "none";
      playlistsMainContainer.style.display = "none";
      playlistsContainer.style.display = "none";
      importExportContainer.style.display = "none";
    }
  }

  //
  //

  //
  //

  // Setting event listeners on options
  likedVideosIconCountContainer?.addEventListener("click", async () => {
    likedVideosIconCountContainer?.classList.add(
      "selected-liked-videos-icon-count-container"
    );
    subscribedChannelsIconCountContainer?.classList.remove(
      "selected-subscribed-channels-icon-count-container"
    );
    playlistsIconCountContainer?.classList.remove(
      "selected-playlists-icon-count-container"
    );
    importExportIconContainer?.classList.remove(
      "selected-import-export-icon-container"
    );
    window.location.href = `${url}#liked-videos`;
    const likedVideosArr = await getLikedVideos();
    if (likedVideosArr) {
      renderLikedVideos(likedVideosArr, likedVideosContainer, likedVideosCount);
    }
    dashboardContainer.style.display = "none";
    likedVideosContainer.style.display = "flex";
    subscribedChannelsContainer.style.display = "none";
    playlistsMainContainer.style.display = "none";
    playlistsContainer.style.display = "none";
    importExportContainer.style.display = "none";
  });

  subscribedChannelsIconCountContainer?.addEventListener("click", async () => {
    subscribedChannelsIconCountContainer?.classList.add(
      "selected-subscribed-channels-icon-count-container"
    );
    likedVideosIconCountContainer?.classList.remove(
      "selected-liked-videos-icon-count-container"
    );
    playlistsIconCountContainer?.classList.remove(
      "selected-playlists-icon-count-container"
    );
    importExportIconContainer?.classList.remove(
      "selected-import-export-icon-container"
    );
    window.location.href = `${url}#subscribed-channels`;
    const subscribedChannelsArr = await getSubscribedChannels();
    if (likedVideosArr) {
      renderSubscribedChannels(
        subscribedChannelsArr,
        subscribedChannelsContainer,
        subscribedChannelsCount
      );
    }
    dashboardContainer.style.display = "none";
    likedVideosContainer.style.display = "none";
    subscribedChannelsContainer.style.display = "grid";
    playlistsMainContainer.style.display = "none";
    playlistsContainer.style.display = "none";
    importExportContainer.style.display = "none";
  });

  playlistsIconCountContainer?.addEventListener("click", async () => {
    playlistsContainer.style.display = "grid";
    playlistsIconCountContainer?.classList.add(
      "selected-playlists-icon-count-container"
    );
    likedVideosIconCountContainer?.classList.remove(
      "selected-liked-videos-icon-count-container"
    );
    subscribedChannelsIconCountContainer?.classList.remove(
      "selected-subscribed-channels-icon-count-container"
    );
    importExportIconContainer?.classList.remove(
      "selected-import-export-icon-container"
    );
    window.location.href = `${url}#playlists`;
    if (selectedPlaylistType === "youtube") {
      const youtubePlaylistsArr = await getYoutubePlaylists();
      if (youtubePlaylistsArr) {
        renderYoutubePlaylists(
          youtubePlaylistsArr,
          playlistsContainer,
          playlistsCount
        );
      }
    }
    if (selectedPlaylistType === "local") {
      const localPlaylistsArr = await getLocalPlaylistsDetailed();
      if (localPlaylistsArr) {
        renderLocalPlaylists(
          localPlaylistsArr,
          playlistsContainer,
          playlistsCount
        );
      }
    }
    dashboardContainer.style.display = "none";
    likedVideosContainer.style.display = "none";
    subscribedChannelsContainer.style.display = "none";
    playlistsMainContainer.style.display = "flex";
    playlistsContainer.style.display = "grid";
    importExportContainer.style.display = "none";
  });

  youtubePlaylistsBtn?.addEventListener("click", async () => {
    playlistsContainer.style.display = "grid";
    localPlaylistsBtn.classList.remove("playlist-type-selected");
    youtubePlaylistsBtn.classList.add("playlist-type-selected");
    selectedPlaylistType = "youtube";
    const youtubePlaylistsArr = await getYoutubePlaylists();
    if (youtubePlaylistsArr) {
      renderYoutubePlaylists(
        youtubePlaylistsArr,
        playlistsContainer,
        playlistsCount
      );
    }
  });
  localPlaylistsBtn?.addEventListener("click", async () => {
    playlistsContainer.style.display = "grid";
    youtubePlaylistsBtn.classList.remove("playlist-type-selected");
    localPlaylistsBtn.classList.add("playlist-type-selected");
    selectedPlaylistType = "local";
    const localPlaylistsArr = await getLocalPlaylistsDetailed();
    if (localPlaylistsArr) {
      renderLocalPlaylists(
        localPlaylistsArr,
        playlistsContainer,
        playlistsCount
      );
    }
  });

  importExportIconContainer?.addEventListener("click", () => {
    importExportIconContainer?.classList.add(
      "selected-import-export-icon-container"
    );
    likedVideosIconCountContainer?.classList.remove(
      "selected-liked-videos-icon-count-container"
    );
    subscribedChannelsIconCountContainer?.classList.remove(
      "selected-subscribed-channels-icon-count-container"
    );
    playlistsIconCountContainer?.classList.remove(
      "selected-playlists-icon-count-container"
    );
    window.location.href = `${url}#import-export`;
    dashboardContainer.style.display = "none";
    likedVideosContainer.style.display = "none";
    subscribedChannelsContainer.style.display = "none";
    playlistsMainContainer.style.display = "none";
    playlistsContainer.style.display = "none";
    importExportContainer.style.display = "flex";
  });
})();

// ClearDB
let countdown: number = 9;

const clearAllBtn = document.getElementById(
  "clear-all-btn"
)! as HTMLButtonElement;
clearAllBtn.addEventListener("click", async () => {
  const { success, error } = await clearDB();
  if (success) {
    notyf.open({
      type: "success",
      message: "Data Cleared Successfully",
      position: { x: "left", y: "top" },
      duration: 3000,
      dismissible: true,
      className: "toast-message",
      icon: false,
    });
    showModal();
    const counter = document.querySelector(".counter")! as HTMLSpanElement;
    const intervalId = setInterval(() => {
      counter.innerText = String(countdown);
      countdown--;

      if (countdown < 0) {
        clearInterval(intervalId);
        const currentLocation = window.location;
        window.location.href =
          currentLocation.origin + "/src/dashboard/dashboard.html#liked-videos";
        location.reload();
      }
    }, 1000);
  } else if (error) {
    notyf.open({
      type: "error",
      message: "No File Selected",
      position: { x: "left", y: "bottom" },
      duration: 4000,
      dismissible: true,
      className: "toast-message",
      icon: false,
    });
  }
});

function showModal() {
  // Create modal HTML structure
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <p class="modal-heading">Successful</p>
      <div class="import-modal-buttons-container">
        <p>Data cleared successfully. The page will automatically reload in <span class="counter">${countdown}</span> seconds</p>
        <button class="modal-reload-btn">Reload</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Add event listener to "Reload" button
  const reloadBtn = modal.querySelector(".modal-reload-btn")!;
  reloadBtn.addEventListener("click", async () => {
    const currentLocation = window.location;
    window.location.href =
      currentLocation.origin + "/src/dashboard/dashboard.html#liked-videos";
    location.reload();
  });
}
