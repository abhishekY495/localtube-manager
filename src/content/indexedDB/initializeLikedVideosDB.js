import { openDB } from "idb";

export async function initializeLikedVideosDB() {
  return await openDB("LikedVideosDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("likedVideos")) {
        db.createObjectStore("likedVideos", { keyPath: "url" });
      }
    },
  });
}
