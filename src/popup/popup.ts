import "./popup.css";
import { getSubscribedChannelsCount } from "../indexedDB/channel";
import { getLikedVideosCount } from "../indexedDB/video";
import { getYoutubePlaylistCount } from "../indexedDB/playlist";
import numeral from "numeral";

console.log("hello from popup.js");

const dashboardBtn: HTMLElement | null =
  document.querySelector("#dashboard-btn");
const likedVideosCountContainer: HTMLElement | null = document.querySelector(
  "#liked-videos-count-container"
);
const subscribedChannelsCountContainer: HTMLElement | null =
  document.querySelector("#subscribed-channels-count-container");
const playlistsCountContainer: HTMLElement | null = document.querySelector(
  "#playlists-count-container"
);

if (dashboardBtn) {
  dashboardBtn.addEventListener("click", async () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/dashboard/dashboard.html"),
    });
  });
}
if (likedVideosCountContainer) {
  likedVideosCountContainer.addEventListener("click", async () => {
    console.log(123123);
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/dashboard/dashboard.html#liked-videos"),
    });
  });
}
if (subscribedChannelsCountContainer) {
  subscribedChannelsCountContainer.addEventListener("click", async () => {
    console.log(123123);
    chrome.tabs.create({
      url: chrome.runtime.getURL(
        "src/dashboard/dashboard.html#subscribed-channels"
      ),
    });
  });
}
if (playlistsCountContainer) {
  playlistsCountContainer.addEventListener("click", async () => {
    console.log(123123);
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/dashboard/dashboard.html#playlists"),
    });
  });
}

(async () => {
  const likedVideosCountElement: HTMLElement | null = document.querySelector(
    "#liked-videos-count"
  );
  const subscribedChannelsCountElement: HTMLElement | null =
    document.querySelector("#subscribed-channels-count");
  const playlistsCountElement: HTMLElement | null =
    document.querySelector("#playlists-count");

  const likedVideosCount = await getLikedVideosCount();
  const subscribedChannelsCount = await getSubscribedChannelsCount();
  const playlistsCount = await getYoutubePlaylistCount();

  if (likedVideosCountElement) {
    const count = numeral(likedVideosCount).format("0a");
    likedVideosCountElement.innerText = count;
  }
  if (subscribedChannelsCountElement) {
    const count = numeral(subscribedChannelsCount).format("0a");
    subscribedChannelsCountElement.innerText = count;
  }
  if (playlistsCountElement) {
    const count = numeral(playlistsCount).format("0a");
    playlistsCountElement.innerText = count;
  }
})();
