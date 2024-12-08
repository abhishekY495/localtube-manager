import { initializeYoutubeDB } from "./indexedDB/initializeYoutubeDB";
import { RequestData, Video } from "./types";

console.log("hello from background script");

const checkIfVideoLiked = async (urlSlug: string) => {
  const db = await initializeYoutubeDB();
  const video = await db.get("likedVideos", urlSlug);
  return video;
};

const addVideoToLikedStore = async (video: Video) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("likedVideos", "readwrite");
  const likedVideosStore = tx.objectStore("likedVideos");
  await likedVideosStore.add(video);
  await tx.done;
};

const removeVideoFromLikedStore = async (urlSlug: string) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("likedVideos", "readwrite");
  const likedVideosStore = tx.objectStore("likedVideos");
  await likedVideosStore.delete(urlSlug);
  await tx.done;
};

chrome.runtime.onMessage.addListener(
  (request: RequestData, sender, sendResponse) => {
    console.log(request);

    if (request?.task === "checkIfVideoLiked") {
      const urlSlug = request?.data?.urlSlug;
      (async () => {
        try {
          const video = await checkIfVideoLiked(urlSlug);
          // @ts-ignore
          sendResponse({
            success: true,
            data: { isVideoLiked: video ? true : false },
          });
        } catch (error) {
          // @ts-ignore
          sendResponse({
            success: false,
            error: {
              message: error instanceof Error ? error?.message : String(error),
              name: error instanceof Error ? error?.name : "Unknown Error",
            },
          });
        }
      })();
      return true;
    }

    if (request.task === "toggleLikedVideo") {
      const videoData: Video = request?.data?.video;
      (async () => {
        try {
          // check if video exists
          const urlSlug = videoData?.urlSlug;
          const video = await checkIfVideoLiked(urlSlug);
          if (video) {
            await removeVideoFromLikedStore(urlSlug);
            // @ts-ignore
            sendResponse({
              success: true,
              data: { videoUnLiked: true },
            });
          } else {
            await addVideoToLikedStore(videoData);
            // @ts-ignore
            sendResponse({
              success: true,
              data: { videoLiked: true },
            });
          }
        } catch (error) {
          // @ts-ignore
          sendResponse({
            success: false,
            error: {
              message: error instanceof Error ? error?.message : String(error),
              name: error instanceof Error ? error?.name : "Unknown Error",
            },
          });
        }
      })();
      return true;
    }
  }
);
