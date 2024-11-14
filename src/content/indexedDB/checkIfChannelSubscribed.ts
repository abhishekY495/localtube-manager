import { initializeYoutubeDB } from "./initializeYoutubeDB";

let observer: MutationObserver | null = null;

export async function checkIfChannelSubscribed() {
  const db = await initializeYoutubeDB();
  const ytChannnel = await db.get("subscribedChannels", "123aqwe");

  console.log(ytChannnel ? "Subscribed" : "Not subscribed");
}
