import { initializeLikedVideosDB } from "./initializeLikedVideosDB";

export async function toggleLikeVideo(videoURL) {
  const db = await initializeLikedVideosDB();
  const tx = db.transaction("likedVideos", "readwrite");
  const store = tx.objectStore("likedVideos");

  try {
    const existingVideo = await store.get(videoURL);
    if (existingVideo) {
      await store.delete(videoURL);
      console.log("Video removed from liked videos:", videoURL);
    } else {
      await store.add({ url: videoURL });
      console.log("Video added to liked videos:", videoURL);
    }
    await tx.done;
  } catch (error) {
    console.error("Error toggling liked video:", error);
  }
}
