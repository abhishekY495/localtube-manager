import { FreshVideo } from "../types";
import { initializeYoutubeDB } from "./initializeYoutubeDB";

export const getFreshVideos = async () => {
  const db = await initializeYoutubeDB();
  const freshVideos = await db.getAll("freshVideos");
  return freshVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getUnviewedFreshVideos = async () => {
  const db = await initializeYoutubeDB();
  const freshVideos = await db.getAll("freshVideos");
  return freshVideos
    .filter(video => !video.isViewed)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const getFreshVideosCount = async () => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("freshVideos", "readonly");
  const store = tx.objectStore("freshVideos");
  const count = await store.count();
  return count;
};

export const getUnviewedFreshVideosCount = async () => {
  const unviewedVideos = await getUnviewedFreshVideos();
  return unviewedVideos.length;
};

export const addFreshVideo = async (video: FreshVideo) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("freshVideos", "readwrite");
  const freshVideosStore = tx.objectStore("freshVideos");
  await freshVideosStore.put(video);
  await tx.done;
};

export const addFreshVideos = async (videos: FreshVideo[]) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("freshVideos", "readwrite");
  const freshVideosStore = tx.objectStore("freshVideos");
  for (const video of videos) {
    await freshVideosStore.put(video);
  }
  await tx.done;
};

export const markFreshVideoAsViewed = async (urlSlug: string) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("freshVideos", "readwrite");
  const freshVideosStore = tx.objectStore("freshVideos");
  const video = await freshVideosStore.get(urlSlug);
  if (video) {
    video.isViewed = true;
    await freshVideosStore.put(video);
  }
  await tx.done;
};

export const removeFreshVideo = async (urlSlug: string) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("freshVideos", "readwrite");
  const freshVideosStore = tx.objectStore("freshVideos");
  await freshVideosStore.delete(urlSlug);
  await tx.done;
  
  // Add to blacklist so it doesn't reappear
  await addToRemovedVideos(urlSlug);
};

// Blacklist system to prevent removed videos from reappearing
export const addToRemovedVideos = async (urlSlug: string) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("settings", "readwrite");
  const settingsStore = tx.objectStore("settings");
  
  const existingBlacklist = await settingsStore.get("removedVideos");
  const removedVideos = existingBlacklist?.value || [];
  
  if (!removedVideos.includes(urlSlug)) {
    removedVideos.push(urlSlug);
    await settingsStore.put({ key: "removedVideos", value: removedVideos });
  }
  await tx.done;
};

export const getRemovedVideos = async (): Promise<string[]> => {
  const db = await initializeYoutubeDB();
  const settings = await db.get("settings", "removedVideos");
  return settings?.value || [];
};

export const isVideoRemoved = async (urlSlug: string): Promise<boolean> => {
  const removedVideos = await getRemovedVideos();
  return removedVideos.includes(urlSlug);
};

export const clearFreshVideos = async () => {
  const db = await initializeYoutubeDB();
  await db.clear("freshVideos");
};

export const cleanupRemovedVideos = async (currentVideoIds: string[]) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("settings", "readwrite");
  const settingsStore = tx.objectStore("settings");
  
  const existingBlacklist = await settingsStore.get("removedVideos");
  const removedVideos = existingBlacklist?.value || [];
  
  // Keep only removed videos that are still in current RSS feeds
  const stillRelevantRemovedVideos = removedVideos.filter((videoId: string) => 
    currentVideoIds.includes(videoId)
  );
  
  if (stillRelevantRemovedVideos.length !== removedVideos.length) {
    await settingsStore.put({ key: "removedVideos", value: stillRelevantRemovedVideos });
    console.log(`🧹 Cleaned up ${removedVideos.length - stillRelevantRemovedVideos.length} old removed videos from blacklist`);
  }
  await tx.done;
};

export const removeFreshVideosByChannelId = async (channelId: string) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("freshVideos", "readwrite");
  const freshVideosStore = tx.objectStore("freshVideos");
  const index = freshVideosStore.index("channelId");
  const videos = await index.getAll(channelId);
  
  for (const video of videos) {
    await freshVideosStore.delete(video.urlSlug);
  }
  await tx.done;
};

export const cleanupOldFreshVideos = async (validVideoIds: string[]) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("freshVideos", "readwrite");
  const freshVideosStore = tx.objectStore("freshVideos");
  const allVideos = await freshVideosStore.getAll();
  
  for (const video of allVideos) {
    if (!validVideoIds.includes(video.urlSlug)) {
      await freshVideosStore.delete(video.urlSlug);
    }
  }
  await tx.done;
};