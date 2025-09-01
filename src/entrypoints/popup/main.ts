import "./style.css";
import numeral from "numeral";
import { getSubscribedChannelsCount } from "../indexedDB/channel";
import {
  getLocalPlaylistCount,
  getYoutubePlaylistCount,
} from "../indexedDB/playlist";
import { getLikedVideosCount } from "../indexedDB/video";
import { getUnviewedFreshVideosCount, getUnviewedFreshVideos, removeFreshVideo } from "../indexedDB/freshVideo";

const dashboardBtn: HTMLElement | null =
  document.querySelector("#dashboard-btn");
const freshVideosCountContainer: HTMLElement | null = document.querySelector(
  "#fresh-videos-count-container"
);
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
    browser.tabs.create({
      url: browser.runtime.getURL("/dashboard.html"),
    });
  });
}
if (freshVideosCountContainer) {
  freshVideosCountContainer.addEventListener("click", async () => {
    browser.tabs.create({
      url: browser.runtime.getURL("/dashboard.html#fresh-videos"),
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

const removeVideo = async (videoId: string) => {
  try {
    await removeFreshVideo(videoId);
    // Refresh the list and counts
    await loadFreshVideosList();
    await loadCounts();
    // Update badge count
    const { FreshVideosService } = await import("../background/freshVideosService");
    const service = new FreshVideosService();
    await service.updateBadgeCount();
  } catch (error) {
    console.error("Error removing video:", error);
  }
};

const openVideoAndRemove = async (videoId: string) => {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  await browser.tabs.create({ url });
  await removeVideo(videoId);
  window.close();
};

const loadFreshVideosList = async () => {
  const freshVideosList = document.getElementById("fresh-videos-list");
  if (!freshVideosList) return;

  const freshVideos = await getUnviewedFreshVideos();
  
  if (freshVideos.length === 0) {
    freshVideosList.innerHTML = "<p>No fresh videos available</p>";
    return;
  }

  const videosToShow = freshVideos.slice(0, 10); // Show max 10 videos
  
  freshVideosList.innerHTML = videosToShow.map(video => `
    <div class="fresh-video-item" data-video-id="${video.urlSlug}">
      <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" />
      <div class="video-info">
        <h4 class="video-title" title="${video.title}">${video.title}</h4>
        <p class="video-channel">${video.channelName}</p>
        <p class="video-date">${new Date(video.publishedAt).toLocaleDateString()}</p>
      </div>
      <button class="remove-video-btn" data-video-id="${video.urlSlug}" title="Remove video">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      </button>
    </div>
  `).join("");

  // Add event listeners
  freshVideosList.querySelectorAll(".fresh-video-item").forEach(item => {
    const videoId = item.getAttribute("data-video-id");
    if (videoId) {
      item.addEventListener("click", (e) => {
        if (!(e.target as HTMLElement).classList.contains("remove-video-btn")) {
          openVideoAndRemove(videoId);
        }
      });
    }
  });

  freshVideosList.querySelectorAll(".remove-video-btn").forEach(btn => {
    const videoId = btn.getAttribute("data-video-id");
    if (videoId) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeVideo(videoId);
      });
    }
  });
};

const loadCounts = async () => {
  const freshVideosCountElement: HTMLElement | null = document.querySelector(
    "#fresh-videos-count"
  );
  const likedVideosCountElement: HTMLElement | null = document.querySelector(
    "#liked-videos-count"
  );
  const subscribedChannelsCountElement: HTMLElement | null =
    document.querySelector("#subscribed-channels-count");
  const playlistsCountElement: HTMLElement | null =
    document.querySelector("#playlists-count");

  const freshVideosCount = await getUnviewedFreshVideosCount();
  const likedVideosCount = await getLikedVideosCount();
  const subscribedChannelsCount = await getSubscribedChannelsCount();
  const youtubePlaylistsCount = await getYoutubePlaylistCount();
  const localPlaylistsCount = await getLocalPlaylistCount();

  if (freshVideosCountElement) {
    const count = numeral(freshVideosCount).format("0a");
    freshVideosCountElement.innerText = count;
  }
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
      "0a"
    );
    playlistsCountElement.innerText = count;
  }
};

(async () => {
  await loadCounts();
  await loadFreshVideosList();
})();
