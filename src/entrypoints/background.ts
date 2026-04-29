import { getCount } from "./indexedDb/get-count";
import {
  addSubscribedChannel,
  deleteSubscribedChannelByHandle,
  getSubscribedChannelByHandle,
} from "./indexedDb/subscribed-channel";
import {
  addLikedVideo,
  deleteLikedVideoById,
  getAllLikedVideos,
  getLikedVideoById,
} from "./indexedDb/liked-video";
import { ACTIONS } from "./utils/constants";
import type {
  CheckIfChannelSubscribedResponse,
  CheckIfVideoLikedResponse,
  CountResponse,
  Message,
  Response,
  Video,
} from "./utils/types";

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

      if (message.action === ACTIONS.CHECK_IF_CHANNEL_SUBSCRIBED) {
        const { channelHandle } = message.data;
        (async () => {
          try {
            const subscribedChannel =
              await getSubscribedChannelByHandle(channelHandle);
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

      if (message.action === ACTIONS.DELETE_SUBSCRIBED_CHANNEL_BY_HANDLE) {
        const { channelHandle } = message.data;
        (async () => {
          try {
            await deleteSubscribedChannelByHandle(channelHandle);
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
    },
  );
});
