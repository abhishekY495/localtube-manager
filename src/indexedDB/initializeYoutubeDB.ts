import { openDB } from "idb";

export async function initializeYoutubeDB() {
  return await openDB("YouTubeDB", 2, {
    upgrade(db) {
      // Create licenseKey store
      if (!db.objectStoreNames.contains("licenseKey")) {
        db.createObjectStore("licenseKey", { keyPath: "key" });
      }

      // Create likedVideos store
      if (!db.objectStoreNames.contains("likedVideos")) {
        db.createObjectStore("likedVideos", { keyPath: "urlSlug" });
      }

      // Create subscribedChannels store
      if (!db.objectStoreNames.contains("subscribedChannels")) {
        db.createObjectStore("subscribedChannels", { keyPath: "handle" });
      }

      // Create youtubePlaylists store
      if (!db.objectStoreNames.contains("youtubePlaylists")) {
        db.createObjectStore("youtubePlaylists", { keyPath: "urlSlug" });
      }

      // Create localPlaylists store
      if (!db.objectStoreNames.contains("localPlaylists")) {
        db.createObjectStore("localPlaylists", { keyPath: "name" });
      }
    },
  });
}
