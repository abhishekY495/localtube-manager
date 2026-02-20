import "./style.css";
import numeral from "numeral";
import { getSubscribedChannelsCount } from "../indexedDB/channel";
import {
  getLocalPlaylistCount,
  getYoutubePlaylistCount,
} from "../indexedDB/playlist";
import { getLikedVideosCount } from "../indexedDB/video";

const dashboardBtn: HTMLElement | null =
  document.querySelector("#dashboard-btn");
const likedVideosCountContainer: HTMLElement | null = document.querySelector(
  "#liked-videos-count-container",
);
const subscribedChannelsCountContainer: HTMLElement | null =
  document.querySelector("#subscribed-channels-count-container");
const playlistsCountContainer: HTMLElement | null = document.querySelector(
  "#playlists-count-container",
);

if (dashboardBtn) {
  dashboardBtn.addEventListener("click", async () => {
    browser.tabs.create({
      url: browser.runtime.getURL("/dashboard.html#subscriptions"),
    });
  });
}
if (likedVideosCountContainer) {
  likedVideosCountContainer.addEventListener("click", async () => {
    browser.tabs.create({
      url: browser.runtime.getURL("/dashboard.html#liked-videos"),
    });
  });
}
if (subscribedChannelsCountContainer) {
  subscribedChannelsCountContainer.addEventListener("click", async () => {
    browser.tabs.create({
      url: browser.runtime.getURL("/dashboard.html#subscribed-channels"),
    });
  });
}
if (playlistsCountContainer) {
  playlistsCountContainer.addEventListener("click", async () => {
    browser.tabs.create({
      url: browser.runtime.getURL("/dashboard.html#playlists"),
    });
  });
}

(async () => {
  const likedVideosCountElement: HTMLElement | null = document.querySelector(
    "#liked-videos-count",
  );
  const subscribedChannelsCountElement: HTMLElement | null =
    document.querySelector("#subscribed-channels-count");
  const playlistsCountElement: HTMLElement | null =
    document.querySelector("#playlists-count");

  const likedVideosCount = await getLikedVideosCount();
  const subscribedChannelsCount = await getSubscribedChannelsCount();
  const youtubePlaylistsCount = await getYoutubePlaylistCount();
  const localPlaylistsCount = await getLocalPlaylistCount();

  if (likedVideosCountElement) {
    const count = numeral(likedVideosCount).format("0a");
    likedVideosCountElement.innerText = count;
  }
  if (subscribedChannelsCountElement) {
    const count = numeral(subscribedChannelsCount).format("0a");
    subscribedChannelsCountElement.innerText = count;
  }
  if (playlistsCountElement) {
    const count = numeral(youtubePlaylistsCount + localPlaylistsCount).format(
      "0a",
    );
    playlistsCountElement.innerText = count;
  }
})();
