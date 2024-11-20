import { initializeYoutubeDB } from "../initializeYoutubeDB";

export async function getSubscribedChannels() {
  const db = await initializeYoutubeDB();
  return await db.getAll("subscribedChannels");
}
