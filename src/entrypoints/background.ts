import { fetchSubscribedChannelLatestVideos } from "./helpers/subscribedChannelVideosHelper";
import {
  addChannelToSubscribedChannelStore,
  checkIfChannelSubscribed,
  removeChannelFromSubscribedChannelStore,
} from "./indexedDB/channel";
import {
  addPlaylistToLocalPlaylistStore,
  addPlaylistToYoutubePlaylistStore,
  addVideoToLocalPlaylist,
  checkIfYoutubePlaylistSaved,
  getLocalPlaylistsNotDetailed,
  removePlaylistFromLocalPlaylistStore,
  removePlaylistFromYoutubePlaylistStore,
  removeVideoFromLocalPlaylist,
} from "./indexedDB/playlist";
import {
  addVideoToLikedStore,
  checkIfVideoLiked,
  removeVideoFromLikedStore,
} from "./indexedDB/video";
import {
  LocalPlaylist,
  RequestData,
  Video,
  YoutubeChannel,
  YoutubePlaylist,
} from "./types";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  // Initial fetch on startup (without notifications to avoid spam on extension load)
  fetchSubscribedChannelLatestVideos().then((newVideos) => {
    if (newVideos && newVideos.length > 0) {
      // Set badge with the number of new videos
      browser.action.setBadgeText({ text: newVideos.length.toString() });
      browser.action.setBadgeBackgroundColor({ color: "#ffffff" });

      browser.notifications.create({
        type: "basic",
        iconUrl: browser.runtime.getURL("/icon/128.png"),
        title: "LocalTube Manager",
        message: `${newVideos.length} new videos`,
        priority: 2,
      });
    }
  });

  // Create an alarm to fetch subscribed channel videos every 20 minute
  browser.alarms.create("fetchSubscribedChannelVideos", {
    periodInMinutes: 1,
  });

  // Listen for alarm events
  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "fetchSubscribedChannelVideos") {
      console.log("Running scheduled fetch for subscribed channel videos...");
      const newVideos = await fetchSubscribedChannelLatestVideos();

      // Send notifications for new videos
      if (newVideos && newVideos.length > 0) {
        // Get current badge text to accumulate count
        const currentBadge = await browser.action.getBadgeText({});
        const currentCount = currentBadge ? parseInt(currentBadge) || 0 : 0;
        const totalNewVideos = currentCount + newVideos.length;

        // Update badge with accumulated count
        browser.action.setBadgeText({ text: totalNewVideos.toString() });
        browser.action.setBadgeBackgroundColor({ color: "#ffffff" });

        // If there's only one new video, show detailed notification
        if (newVideos.length === 1) {
          browser.notifications.create({
            type: "image",
            iconUrl: browser.runtime.getURL("/icon/128.png"),
            imageUrl: newVideos[0].thumbnailUrl,
            title: newVideos[0].channelName,
            message: newVideos[0].title,
            priority: 2,
          });
        } else {
          browser.notifications.create({
            type: "basic",
            iconUrl: browser.runtime.getURL("/icon/128.png"),
            title: `${newVideos.length} New Videos`,
            message: newVideos.map((video) => video.title).join("\n"),
            priority: 2,
          });
        }
      }
    }
  });

  browser.runtime.onMessage.addListener(
    (request: RequestData, _sender, sendResponse) => {
      console.log(request);

      if (request.task === "clearBadge") {
        (async () => {
          try {
            await browser.action.setBadgeText({ text: "" });
          } catch (error) {
            console.error(error);
          }
        })();
      }

      // video
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
                message:
                  error instanceof Error ? error?.message : String(error),
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
                message:
                  error instanceof Error ? error?.message : String(error),
                name: error instanceof Error ? error?.name : "Unknown Error",
              },
            });
          }
        })();
        return true;
      }

      // channel
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
                message:
                  error instanceof Error ? error?.message : String(error),
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
                message:
                  error instanceof Error ? error?.message : String(error),
                name: error instanceof Error ? error?.name : "Unknown Error",
              },
            });
          }
        })();
        return true;
      }

      // youtube playlist
      if (request.task === "checkIfYoutubePlaylistSaved") {
        const urlSlug = request?.data?.playlistUrlSlug;
        (async () => {
          try {
            const playlist = await checkIfYoutubePlaylistSaved(urlSlug);
            // @ts-ignore
            sendResponse({
              success: true,
              data: { isYoutubePlaylistSaved: playlist ? true : false },
            });
          } catch (error) {
            // @ts-ignore
            sendResponse({
              success: false,
              error: {
                message:
                  error instanceof Error ? error?.message : String(error),
                name: error instanceof Error ? error?.name : "Unknown Error",
              },
            });
          }
        })();
        return true;
      }
      if (request.task === "toggleYoutubePlaylist") {
        const playlistData: YoutubePlaylist = request?.data?.playlist;
        (async () => {
          try {
            // check if youtube playlist exists
            const urlSlug = playlistData.urlSlug;
            const playlist = await checkIfYoutubePlaylistSaved(urlSlug);
            if (playlist) {
              await removePlaylistFromYoutubePlaylistStore(urlSlug);
              // @ts-ignore
              sendResponse({
                success: true,
                data: { isYoutubePlaylistSaved: false },
              });
            } else {
              await addPlaylistToYoutubePlaylistStore(playlistData);
              // @ts-ignore
              sendResponse({
                success: true,
                data: { isYoutubePlaylistSaved: true },
              });
            }
          } catch (error) {
            // @ts-ignore
            sendResponse({
              success: false,
              error: {
                message:
                  error instanceof Error ? error?.message : String(error),
                name: error instanceof Error ? error?.name : "Unknown Error",
              },
            });
          }
        })();
        return true;
      }

      // local playlist
      if (request.task === "getLocalPlaylists") {
        (async () => {
          try {
            const playlists = await getLocalPlaylistsNotDetailed();
            // @ts-ignore
            sendResponse({
              success: true,
              data: { playlists },
            });
          } catch (error) {
            // @ts-ignore
            sendResponse({
              success: false,
              error: {
                message:
                  error instanceof Error ? error?.message : String(error),
                name: error instanceof Error ? error?.name : "Unknown Error",
              },
            });
          }
        })();
        return true;
      }
      if (request.task === "createLocalPlaylist") {
        const localPlaylist: LocalPlaylist = request?.data?.playlist;
        (async () => {
          try {
            await addPlaylistToLocalPlaylistStore(localPlaylist);
            // @ts-ignore
            sendResponse({
              success: true,
              data: { isLocalPlaylistCreated: true },
            });
          } catch (error) {
            // @ts-ignore
            sendResponse({
              success: false,
              error: {
                message:
                  error instanceof Error ? error?.message : String(error),
                name: error instanceof Error ? error?.name : "Unknown Error",
              },
            });
          }
        })();
        return true;
      }
      if (request.task === "removeLocalPlaylist") {
        const localPlaylist: LocalPlaylist = request?.data?.playlist;
        (async () => {
          try {
            await removePlaylistFromLocalPlaylistStore(localPlaylist.name);
            // @ts-ignore
            sendResponse({
              success: true,
              data: { isLocalPlaylistRemoved: true },
            });
          } catch (error) {
            // @ts-ignore
            sendResponse({
              success: false,
              error: {
                message:
                  error instanceof Error ? error?.message : String(error),
                name: error instanceof Error ? error?.name : "Unknown Error",
              },
            });
          }
        })();
        return true;
      }
      if (request.task === "addVideoToLocalPlaylist") {
        const playlistName: string = request?.data?.playlistName;
        const videoData: Video = request?.data?.videoData;
        (async () => {
          try {
            await addVideoToLocalPlaylist(playlistName, videoData);
            // @ts-ignore
            sendResponse({
              success: true,
              data: { isVideoAddedToLocalPlaylist: true },
            });
          } catch (error) {
            // @ts-ignore
            sendResponse({
              success: false,
              error: {
                message:
                  error instanceof Error ? error?.message : String(error),
                name: error instanceof Error ? error?.name : "Unknown Error",
              },
            });
          }
        })();
        return true;
      }
      if (request.task === "removeVideoFromLocalPlaylist") {
        const playlistName: string = request?.data?.playlistName;
        const videoData: Video = request?.data?.videoData;
        (async () => {
          try {
            const updatedPlaylist = await removeVideoFromLocalPlaylist(
              playlistName,
              videoData
            );
            // @ts-ignore
            sendResponse({
              success: true,
              data: { isVideoRemovedFromLocalPlaylist: true, updatedPlaylist },
            });
          } catch (error) {
            // @ts-ignore
            sendResponse({
              success: false,
              error: {
                message:
                  error instanceof Error ? error?.message : String(error),
                name: error instanceof Error ? error?.name : "Unknown Error",
              },
            });
          }
        })();
        return true;
      }
    }
  );

  browser.runtime.onInstalled.addListener(() => {
    browser.tabs.create({ url: "./welcome.html" });
  });
});
