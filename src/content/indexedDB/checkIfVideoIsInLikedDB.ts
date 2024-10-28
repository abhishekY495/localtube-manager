import { initializeYoutubeDB } from "./initializeYoutubeDB";

export async function checkIfVideoIsInLikedDB(urlSlug: string) {
  const db = await initializeYoutubeDB();
  const video = await db.get("likedVideos", urlSlug);
  return video ? true : false;
}
