import { openDB } from "idb";

export async function initializeYoutubeDB() {
  // return await openDB("LikedVideosDB", 1, {
  //   upgrade(db) {
  //     if (!db.objectStoreNames.contains("likedVideos")) {
  //       db.createObjectStore("likedVideos", { keyPath: "url" });
  //     }
  //   },
  // });
  return await openDB("YouTubeDB", 1, {
    upgrade(db) {
      // Create likedVideos store
      if (!db.objectStoreNames.contains("likedVideos")) {
        db.createObjectStore("likedVideos", { keyPath: "urlSlug" });
      }

      // Create subscribedChannels store
      if (!db.objectStoreNames.contains("subscribedChannels")) {
        db.createObjectStore("subscribedChannels", { keyPath: "id" });
      }

      // Create playlists store
      if (!db.objectStoreNames.contains("playlists")) {
        db.createObjectStore("playlists", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
}
