import "./dashboard.css";
import { getSubscribedChannels } from "../indexedDB/channel";
import { getLikedVideos } from "../indexedDB/video";

console.log("hello from dashboard");

const likedVideosIconCountContainer: HTMLElement | null =
  document.querySelector(".liked-videos-icon-count-container");
const subscribedChannelsIconCountContainer: HTMLElement | null =
  document.querySelector(".subscribed-channels-icon-count-container");
const playlistsIconCountContainer: HTMLElement | null = document.querySelector(
  ".playlists-icon-count-container"
);
const importExportIconContainer: HTMLElement | null = document.querySelector(
  ".import-export-icon-container"
);

const location = window.location.href;
const url = location.split("#")[0];
const slug = location.split("#")[1];
if (slug === "liked-videos") {
  likedVideosIconCountContainer?.classList.add(
    "selected-liked-videos-icon-count-container"
  );
} else if (slug === "subscribed-channels") {
  subscribedChannelsIconCountContainer?.classList.add(
    "selected-subscribed-channels-icon-count-container"
  );
} else if (slug === "playlists") {
  playlistsIconCountContainer?.classList.add(
    "selected-playlists-icon-count-container"
  );
}

const likedVideosArr = await getLikedVideos();
const subscribedChannelsArr = await getSubscribedChannels();
console.log(likedVideosArr);
console.log(subscribedChannelsArr);

likedVideosIconCountContainer?.addEventListener("click", () => {
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
});

subscribedChannelsIconCountContainer?.addEventListener("click", () => {
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
});

playlistsIconCountContainer?.addEventListener("click", () => {
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
});
