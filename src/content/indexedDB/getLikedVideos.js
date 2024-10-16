import { initializeLikedVideosDB } from "./initializeLikedVideosDB";

export async function getLikedVideos() {
  const db = await initializeLikedVideosDB();
  return await db.getAll("likedVideos");
}
