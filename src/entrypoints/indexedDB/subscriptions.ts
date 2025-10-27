import { SubscribedChannelVideo } from "../types";
import { initializeYoutubeDB } from "./initializeYoutubeDB";

export const getSubscribedChannelVideos = async () => {
  const db = await initializeYoutubeDB();
  const subscribedChannelVideos = await db.getAll("subscribedChannelVideos");
  return subscribedChannelVideos;
};

export const addVideoToSubscribedChannelVideosStore = async (
  video: SubscribedChannelVideo
) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("subscribedChannelVideos", "readwrite");
  const subscribedChannelVideosStore = tx.objectStore(
    "subscribedChannelVideos"
  );
  await subscribedChannelVideosStore.put(video);
  await tx.done;
};

export const removeVideoFromSubscribedChannelVideosStore = async (
  channelHandle: string,
  latestVideos: SubscribedChannelVideo[]
) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("subscribedChannelVideos", "readwrite");
  const store = tx.objectStore("subscribedChannelVideos");

  // Get all videos currently in the store
  const allVideos: SubscribedChannelVideo[] = await store.getAll();

  // Get a list of the latest video slugs
  const latestSlugs = new Set(latestVideos.map((v) => v.urlSlug));

  // Find old videos for this channel
  const oldVideos = allVideos.filter(
    (v) => v.channelHandle === channelHandle && !latestSlugs.has(v.urlSlug)
  );

  // Delete old videos
  for (const video of oldVideos) {
    await store.delete(video.urlSlug);
  }

  await tx.done;
};
