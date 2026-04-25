import { getAllLikedVideos, getLikedVideoById } from "./indexedDb/video";
import { ACTIONS } from "./utils/constants";
import type {
  CheckIfVideoIsLikedResponse,
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

      if (message.action === ACTIONS.CHECK_IF_VIDEO_IS_LIKED) {
        const { videoId } = message.data;
        (async () => {
          try {
            const video = await getLikedVideoById(videoId);
            sendResponse({
              success: true,
              data: { isLiked: !!video },
            } satisfies Response<CheckIfVideoIsLikedResponse>);
          } catch (error) {
            sendResponse({
              success: false,
              error: "Failed to get liked video by id",
            } satisfies Response<CheckIfVideoIsLikedResponse>);
          }
        })();
        return true;
      }
    },
  );
});
