import { getLikedVideos } from "./getLikedVideos";
import { initializeYoutubeDB } from "./initializeYoutubeDB";

export async function clearLikedVideos() {
  const db = await initializeYoutubeDB();
  try {
    await db.clear("likedVideos");
    console.log("All liked videos have been removed from IndexedDB");
    await getLikedVideos();
  } catch (error) {
    console.error("Error removing liked videos from IndexedDB:", error);
  }
}
