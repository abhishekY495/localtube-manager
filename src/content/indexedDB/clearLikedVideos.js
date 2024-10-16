import { getLikedVideos } from "./getLikedVideos";
import { initializeLikedVideosDB } from "./initializeLikedVideosDB";

export async function clearLikedVideos() {
  const db = await initializeLikedVideosDB();
  try {
    await db.clear("likedVideos");
    console.log("All liked videos have been removed from IndexedDB");
    await getLikedVideos();
  } catch (error) {
    console.error("Error removing liked videos from IndexedDB:", error);
  }
}
