import { getCount } from "./indexedDb/get-count";
import {
  addSubscribedChannel,
  deleteSubscribedChannelById,
  getAllSubscribedChannels,
  getSubscribedChannelById,
} from "./indexedDb/subscribed-channels";
import {
  addLikedVideo,
  deleteLikedVideoById,
  getAllLikedVideos,
  getLikedVideoById,
} from "./indexedDb/liked-videos";
import { ACTIONS } from "./utils/constants";
import type {
  Channel,
  CheckIfChannelSubscribedResponse,
  CheckIfVideoLikedResponse,
  CheckIfYoutubePlaylistIsSavedResponse,
  CountResponse,
  LocalPlaylist,
  LocalPlaylistWithCount,
  Message,
  Response,
  Video,
  YoutubePlaylist,
} from "./utils/types";
import {
  addYoutubePlaylist,
  deleteYoutubePlaylistById,
  getAllYoutubePlaylists,
  getYoutubePlaylistById,
} from "./indexedDb/youtube-playlist";
import {
  addLocalPlaylist,
  getAllLocalPlaylists,
  getAllLocalPlaylistsWithCount,
} from "./indexedDb/local-playlists";
import Dexie from "dexie";

export default defineBackground(() => {
  const action = browser.action || (browser as any).browserAction;

  action.onClicked.addListener((tab: any) => {
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
      if (message.action === ACTIONS.GET_ALL_LOCAL_PLAYLISTS_WITH_COUNT) {
        (async () => {
          try {
            const localPlaylists = await getAllLocalPlaylistsWithCount();
            sendResponse({
              success: true,
              data: localPlaylists,
            } satisfies Response<LocalPlaylistWithCount[]>);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to get all local playlists with count",
            } satisfies Response<LocalPlaylistWithCount[]>);
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
    },
  );
});
