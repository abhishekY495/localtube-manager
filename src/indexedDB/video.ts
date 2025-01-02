import { Video } from "../types";
import { initializeYoutubeDB } from "./initializeYoutubeDB";

export const checkIfVideoLiked = async (urlSlug: string) => {
  const db = await initializeYoutubeDB();
  const video = await db.get("likedVideos", urlSlug);
  return video;
};

export const addVideoToLikedStore = async (video: Video) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("likedVideos", "readwrite");
  const likedVideosStore = tx.objectStore("likedVideos");
  await likedVideosStore.add(video);
  await tx.done;
};

export const removeVideoFromLikedStore = async (urlSlug: string) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("likedVideos", "readwrite");
  const likedVideosStore = tx.objectStore("likedVideos");
  await likedVideosStore.delete(urlSlug);
  await tx.done;
};

export const getLikedVideos = async () => {
  const db = await initializeYoutubeDB();
  const likedVideos = await db.getAll("likedVideos");
  return likedVideos;
};
export const getLikedVideosCount = async () => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("likedVideos", "readonly");
  const store = tx.objectStore("likedVideos");
  const count = await store.count();
  return count;
};

export const clearLikedVideos = async () => {
  const db = await initializeYoutubeDB();
  await db.clear("likedVideos");
};
