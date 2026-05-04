import { getCount } from "./indexed-db/get-count";
import {
  addSubscribedChannel,
  deleteSubscribedChannelById,
  getAllSubscribedChannels,
  getSubscribedChannelById,
} from "./indexed-db/subscribed-channels";
import {
  addLikedVideo,
  deleteLikedVideoById,
  getAllLikedVideos,
  getLikedVideoById,
} from "./indexed-db/liked-videos";
import { ACTIONS } from "./utils/constants";
import type {
  Channel,
  CheckIfChannelSubscribedResponse,
  CheckIfVideoLikedResponse,
  CheckIfYoutubePlaylistIsSavedResponse,
  CountResponse,
  LocalPlaylist,
  Message,
  Response,
  Subscription,
  Video,
  YoutubePlaylist,
} from "./utils/types";
import {
  addYoutubePlaylist,
  deleteYoutubePlaylistById,
  getAllYoutubePlaylists,
  getYoutubePlaylistById,
} from "./indexed-db/youtube-playlist";
import {
  addLocalPlaylist,
  addVideoToLocalPlaylist,
  deleteLocalPlaylistByName,
  getAllLocalPlaylists,
  removeVideoFromLocalPlaylist,
} from "./indexed-db/local-playlists";
import Dexie from "dexie";
import { setupYoutubeEmbedReferrer } from "./utils/youtube-embed/setup-youtube-embed-referrer";
import { subscriptionsCronJob } from "./utils/subscriptions/subscriptions-cron-job";
import { getAllSubscriptions } from "./indexed-db/subscriptions";
import { getThumbnailUrl } from "./utils/get-thumbnail-url";

export default defineBackground(() => {
  const action = browser.action || (browser as any).browserAction;

  setupYoutubeEmbedReferrer().catch(console.error);
  browser.runtime.onInstalled.addListener(setupYoutubeEmbedReferrer);
  browser.runtime.onStartup.addListener(setupYoutubeEmbedReferrer);

  // run subscriptions cron job on startup
  subscriptionsCronJob();

  browser.alarms.create(ACTIONS.SUBSCRIPTIONS_CRON_JOB, {
    periodInMinutes: 15,
  });
  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === ACTIONS.SUBSCRIPTIONS_CRON_JOB) {
      console.log("Fetching subscribed channels latest videos");
      const newVideos = await subscriptionsCronJob();

      if (newVideos.length === 0) {
        return;
      }

      if (newVideos.length === 1) {
        const thumbnailUrl = getThumbnailUrl(
          newVideos[0].urlSlug,
          newVideos[0].isShort,
        );
        browser.notifications.create({
          type: "image",
          iconUrl: browser.runtime.getURL("/icon/128.png"),
          imageUrl: thumbnailUrl,
          title: newVideos[0].channelName,
          message: newVideos[0].title,
        });
      } else {
        browser.notifications.create({
          type: "basic",
          iconUrl: browser.runtime.getURL("/icon/128.png"),
          title: "LocalTube Manager",
          message: `${newVideos.length} new videos`,
        });
      }
    }
  });

  action.onClicked.addListener((tab: any) => {
    if (tab.url?.startsWith(browser.runtime.getURL("/dashboard.html"))) {
      browser.runtime.sendMessage({ action: ACTIONS.TOGGLE_SIDEBAR });
      return;
    }

    if (tab.id) {
      browser.tabs.sendMessage(tab.id, { action: ACTIONS.TOGGLE_SIDEBAR });
    }
  });

  browser.runtime.onMessage.addListener(
    (message: Message, _sender, sendResponse) => {
      if (message.action === ACTIONS.OPEN_DASHBOARD) {
        browser.tabs.create({
          url: browser.runtime.getURL("/dashboard.html"),
        });
      }

      if (message.action === ACTIONS.OPEN_LOCAL_PLAYLIST) {
        const { playlistName } = message.data;
        browser.tabs.create({
          url: `dashboard.html#local-playlists?name=${encodeURIComponent(playlistName)}`,
        });
      }

      // get count
      if (message.action === ACTIONS.GET_COUNT) {
        (async () => {
          try {
            const count = await getCount();
            sendResponse({
              success: true,
              data: count,
            } satisfies Response<CountResponse>);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to get count",
            } satisfies Response<CountResponse>);
          }
        })();
        return true;
      }

      // get all
      if (message.action === ACTIONS.GET_ALL_LIKED_VIDEOS) {
        (async () => {
          try {
            const likedVideos = await getAllLikedVideos();
            sendResponse({
              success: true,
              data: likedVideos,
            } satisfies Response<Video[]>);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to get all liked videos",
            } satisfies Response<Video[]>);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.GET_ALL_SUBSCRIBED_CHANNELS) {
        (async () => {
          try {
            const subscribedChannels = await getAllSubscribedChannels();
            sendResponse({
              success: true,
              data: subscribedChannels,
            } satisfies Response<Channel[]>);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to get all subscribed channels",
            } satisfies Response<Channel[]>);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.GET_ALL_YOUTUBE_PLAYLISTS) {
        (async () => {
          try {
            const youtubePlaylists = await getAllYoutubePlaylists();
            sendResponse({
              success: true,
              data: youtubePlaylists,
            } satisfies Response<YoutubePlaylist[]>);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to get all youtube playlists",
            } satisfies Response<YoutubePlaylist[]>);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.GET_ALL_LOCAL_PLAYLISTS) {
        (async () => {
          try {
            const localPlaylists = await getAllLocalPlaylists();
            sendResponse({
              success: true,
              data: localPlaylists,
            } satisfies Response<LocalPlaylist[]>);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to get all local playlists",
            } satisfies Response<LocalPlaylist[]>);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.GET_ALL_SUBSCRIPTIONS) {
        (async () => {
          try {
            const subscriptions = await getAllSubscriptions();
            sendResponse({
              success: true,
              data: subscriptions,
            } satisfies Response<Subscription[]>);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to get all subscriptions",
            } satisfies Response<Subscription[]>);
          }
        })();
        return true;
      }

      // check if
      if (message.action === ACTIONS.CHECK_IF_VIDEO_LIKED) {
        const { videoId } = message.data;
        (async () => {
          try {
            const video = await getLikedVideoById(videoId);
            sendResponse({
              success: true,
              data: { isLiked: !!video },
            } satisfies Response<CheckIfVideoLikedResponse>);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to get liked video by id",
            } satisfies Response<CheckIfVideoLikedResponse>);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.CHECK_IF_CHANNEL_SUBSCRIBED) {
        const { channelId } = message.data;
        (async () => {
          try {
            const subscribedChannel = await getSubscribedChannelById(channelId);
            sendResponse({
              success: true,
              data: { isSubscribed: !!subscribedChannel },
            } satisfies Response<CheckIfChannelSubscribedResponse>);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to get subscribed channel by handle",
            } satisfies Response<CheckIfChannelSubscribedResponse>);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.CHECK_IF_YOUTUBE_PLAYLIST_IS_SAVED) {
        const { listId } = message.data;
        (async () => {
          try {
            const playlist = await getYoutubePlaylistById(listId);
            sendResponse({
              success: true,
              data: { isSaved: !!playlist },
            } satisfies Response<CheckIfYoutubePlaylistIsSavedResponse>);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to get youtube playlist by id",
            } satisfies Response<CheckIfYoutubePlaylistIsSavedResponse>);
          }
        })();
        return true;
      }

      // add
      if (message.action === ACTIONS.ADD_LIKED_VIDEO) {
        const { video } = message.data;
        (async () => {
          try {
            await addLikedVideo(video);
            sendResponse({
              success: true,
            } satisfies Response);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to add video to liked videos",
            } satisfies Response);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.ADD_SUBSCRIBED_CHANNEL) {
        const { channel } = message.data;
        (async () => {
          try {
            await addSubscribedChannel(channel);
            sendResponse({
              success: true,
            } satisfies Response);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to add subscribed channel",
            } satisfies Response);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.ADD_YOUTUBE_PLAYLIST) {
        const { playlist } = message.data;
        (async () => {
          try {
            await addYoutubePlaylist(playlist);
            sendResponse({
              success: true,
            } satisfies Response);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to add youtube playlist",
            } satisfies Response);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.ADD_LOCAL_PLAYLIST) {
        const { playlist } = message.data;
        (async () => {
          try {
            await addLocalPlaylist(playlist);
            sendResponse({
              success: true,
            } satisfies Response);
          } catch (error) {
            if (
              error instanceof Dexie.ConstraintError &&
              error.name === "ConstraintError"
            ) {
              sendResponse({
                success: false,
                error: "Playlist name already exists",
              } satisfies Response);
            } else {
              sendResponse({
                success: false,
                error: "Failed to add local playlist",
              } satisfies Response);
            }
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.ADD_VIDEO_TO_LOCAL_PLAYLIST) {
        const { playlistName, video } = message.data;
        (async () => {
          try {
            await addVideoToLocalPlaylist(playlistName, video);
            sendResponse({
              success: true,
            } satisfies Response);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to add video to local playlist",
            } satisfies Response);
          }
        })();
        return true;
      }

      // delete
      if (message.action === ACTIONS.DELETE_LIKED_VIDEO_BY_ID) {
        const { videoId } = message.data;
        (async () => {
          try {
            await deleteLikedVideoById(videoId);
            sendResponse({
              success: true,
            } satisfies Response);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to remove video from liked videos",
            } satisfies Response);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.DELETE_SUBSCRIBED_CHANNEL_BY_ID) {
        const { channelId } = message.data;
        (async () => {
          try {
            await deleteSubscribedChannelById(channelId);
            sendResponse({
              success: true,
            } satisfies Response);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to delete subscribed channel by handle",
            } satisfies Response);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.DELETE_YOUTUBE_PLAYLIST_BY_ID) {
        const { playlistId } = message.data;
        (async () => {
          try {
            await deleteYoutubePlaylistById(playlistId);
            sendResponse({
              success: true,
            } satisfies Response);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to delete youtube playlist by id",
            } satisfies Response);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.DELETE_LOCAL_PLAYLIST_BY_NAME) {
        const { playlistName } = message.data;
        (async () => {
          try {
            await deleteLocalPlaylistByName(playlistName);
            sendResponse({
              success: true,
            } satisfies Response);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to delete local playlist by name",
            } satisfies Response);
          }
        })();
        return true;
      }
      if (message.action === ACTIONS.REMOVE_VIDEO_FROM_LOCAL_PLAYLIST) {
        const { playlistName, videoId } = message.data;
        (async () => {
          try {
            await removeVideoFromLocalPlaylist(playlistName, videoId);
            sendResponse({
              success: true,
            } satisfies Response);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to remove video from local playlist",
            } satisfies Response);
          }
        })();
        return true;
      }
    },
  );

  // keep service worker active
  const keepAlive = () => setInterval(browser.runtime.getPlatformInfo, 20e3);
  browser.runtime.onStartup.addListener(keepAlive);
  keepAlive();
});
