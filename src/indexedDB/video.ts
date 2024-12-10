import { initializeYoutubeDB } from "./initializeYoutubeDB";
import { Video } from "../types";

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

export const clearLikedVideos = async () => {
  const db = await initializeYoutubeDB();
  await db.clear("likedVideos");
};
