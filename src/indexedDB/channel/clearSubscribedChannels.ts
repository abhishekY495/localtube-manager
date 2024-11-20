import { initializeYoutubeDB } from "../initializeYoutubeDB";

export async function clearSubscribedChannels() {
  const db = await initializeYoutubeDB();
  try {
    await db.clear("subscribedChannels");
    console.log("All channels have been removed from IndexedDB");
  } catch (error) {
    console.error("Error removing channels from IndexedDB:", error);
  }
}
