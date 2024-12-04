import "./popup.css";

console.log("hello from popup.js");

const dashboardBtn = document.querySelector("#dashboard-btn");

const likedVideosCount = document.querySelector("#liked-videos-count");
const subscribedChannelsCount = document.querySelector(
  "#subscribed-channels-count"
);
const playlistsCount = document.querySelector("#playlists-count");

if (dashboardBtn) {
  dashboardBtn.addEventListener("click", async () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/dashboard/dashboard.html"),
    });
  });
}
