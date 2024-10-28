import { initializeYoutubeDB } from "./initializeYoutubeDB";

export async function getLikedVideos() {
  const db = await initializeYoutubeDB();
  return await db.getAll("likedVideos");
}
