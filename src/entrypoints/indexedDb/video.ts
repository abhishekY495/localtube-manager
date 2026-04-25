import type { Video } from "../utils/types";
import { db } from "./db";

export const getAllLikedVideos = async () => {
  const likedVideos = await db.likedVideos.toArray();
  return likedVideos;
};

export const getLikedVideoById = async (videoId: string) => {
  const video = await db.likedVideos.get(videoId);
  return video;
};

export const addLikedVideo = async (video: Video) => {
  await db.likedVideos.add(video);
};

export const deleteLikedVideo = async (videoId: string) => {
  await db.likedVideos.delete(videoId);
};
