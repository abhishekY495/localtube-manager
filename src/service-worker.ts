import {
  addChannelToSubscribedChannelStore,
  checkIfChannelSubscribed,
  removeChannelFromSubscribedChannelStore,
} from "./indexedDB/channel";
import {
  addVideoToLikedStore,
  checkIfVideoLiked,
  removeVideoFromLikedStore,
} from "./indexedDB/video";
import { RequestData, Video, YoutubeChannel } from "./types";

console.log("hello from background script");

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
              data: { isVideoLiked: false },
            });
          } else {
            await addVideoToLikedStore(videoData);
            // @ts-ignore
            sendResponse({
              success: true,
              data: { isVideoLiked: true },
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

    if (request.task === "clearLikedVideos") {
    }

    if (request.task === "checkIfChannelSubscribed") {
      const channelHandle = request?.data?.channelHandle;
      (async () => {
        try {
          const channel = await checkIfChannelSubscribed(channelHandle);
          // @ts-ignore
          sendResponse({
            success: true,
            data: { isChannelSubscribed: channel ? true : false, channel },
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

    if (request.task === "toggleSubscribedChannel") {
      const youtubeChannelData: YoutubeChannel = request?.data?.channel;
      (async () => {
        try {
          // check if channel exists
          const handle = youtubeChannelData?.handle;
          const channel = await checkIfChannelSubscribed(handle);
          if (channel) {
            await removeChannelFromSubscribedChannelStore(handle);
            // @ts-ignore
            sendResponse({
              success: true,
              data: { isChannelSubscribed: false },
            });
          } else {
            await addChannelToSubscribedChannelStore(youtubeChannelData);
            // @ts-ignore
            sendResponse({
              success: true,
              data: { isChannelSubscribed: true },
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
