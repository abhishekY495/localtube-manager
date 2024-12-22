import "./css/dashboard.css";
import "./css/likedVideos.css";
import "./css/subscribedChannels.css";
import "./css/youtubePlaylist.css";
import numeral from "numeral";
import { getSubscribedChannels } from "../indexedDB/channel";
import { getLikedVideos } from "../indexedDB/video";
import { getYoutubePlaylists } from "../indexedDB/playlist";
import { renderLikedVideos } from "./functions/renderLikedVideos";
import { renderSubscribedChannels } from "./functions/renderSubscribedChannels";
import { renderPlaylists } from "./functions/renderPlaylists";
import { Video, YoutubeChannel, YoutubePlaylist } from "../types";

console.log("hello from dashboard");

let likedVideosArr: Video[] = [];
let subscribedChannelsArr: YoutubeChannel[] = [];
let youtubePlaylistsArr: YoutubePlaylist[] = [];

(async () => {
  likedVideosArr = await getLikedVideos();
  subscribedChannelsArr = await getSubscribedChannels();
  youtubePlaylistsArr = await getYoutubePlaylists();

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
    playlistsCount.innerText = numeral(youtubePlaylistsArr.length).format("0a");
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
    playlistsContainer.style.display = "none";
    importExportContainer.style.display = "none";
  } else if (slug === "playlists") {
    playlistsIconCountContainer?.classList.add(
      "selected-playlists-icon-count-container"
    );
    if (youtubePlaylistsArr) {
      renderPlaylists(youtubePlaylistsArr, playlistsContainer, playlistsCount);
    }
    dashboardContainer.style.display = "none";
    likedVideosContainer.style.display = "none";
    subscribedChannelsContainer.style.display = "none";
    playlistsContainer.style.display = "grid";
    importExportContainer.style.display = "none";
  } else {
    if (dashboardContainer) {
      dashboardContainer.style.display = "block";
      likedVideosContainer.style.display = "none";
      subscribedChannelsContainer.style.display = "none";
      playlistsContainer.style.display = "none";
      importExportContainer.style.display = "none";
      renderLikedVideos(likedVideosArr, likedVideosContainer, likedVideosCount);
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
    playlistsContainer.style.display = "none";
    importExportContainer.style.display = "none";
  });

  playlistsIconCountContainer?.addEventListener("click", async () => {
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
    const youtubePlaylistsArr = await getYoutubePlaylists();
    if (youtubePlaylistsArr) {
      renderPlaylists(youtubePlaylistsArr, playlistsContainer, playlistsCount);
    }
    dashboardContainer.style.display = "none";
    likedVideosContainer.style.display = "none";
    subscribedChannelsContainer.style.display = "none";
    playlistsContainer.style.display = "grid";
    importExportContainer.style.display = "none";
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
    playlistsContainer.style.display = "none";
    importExportContainer.style.display = "block";
  });
})();
