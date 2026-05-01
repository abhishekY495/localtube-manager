import { getChannelDataFromVideoPage } from "@/entrypoints/utils/video/get-channel-data-from-video-page";
import { checkIfChannelSubscribed } from "./channel/check-if-channel-subscribed";
import { addCustomLikeButton } from "./video/add-custom-like-button";
import { checkIfVideoIsLiked } from "./video/check-if-video-liked";
import { addCustomSubscribeButtonVideoPage } from "./channel/add-custom-subscribe-button-video-page";
import { CHANNEL_URL_REGEX } from "@/entrypoints/utils/constants";
import { fetchChannelIdFromUrl } from "@/entrypoints/utils/fetch-channel-id-from-url";
import { addCustomSubscribeButtonChannelPage } from "./channel/add-custom-subscribe-button-channel-page";
import { checkIfYoutubePlaylistIsSaved } from "./youtube-playlist/check-if-youtube-playlist-is-saved";
import { addCustomSavePlaylistButton } from "./youtube-playlist/add-custom-save-playlist-button";
import { addCustomAddToLocalPlaylistButton } from "./local-playlist/add-custom-add-to-local-playlist-button";

export const init = async () => {
  const url = new URL(window.location.href);

  const params = new URLSearchParams(url.search);
  const videoId = params.get("v");
  const listId = params.get("list");

  // videoId i.e we are on a video page
  if (videoId) {
    // check if video liked from video page
    const checkIfVideoLikedResponse = await checkIfVideoIsLiked(videoId);
    if (checkIfVideoLikedResponse.success) {
      const isLiked = checkIfVideoLikedResponse.data.isLiked;
      await addCustomLikeButton({ videoId, isLiked });
    }

    // get channel data from video page
    const { id: channelId } = await getChannelDataFromVideoPage();

    // check if channel subscribed by id
    if (channelId) {
      const checkIfChannelSubscribedResponse =
        await checkIfChannelSubscribed(channelId);
      if (checkIfChannelSubscribedResponse.success) {
        const isSubscribed = checkIfChannelSubscribedResponse.data.isSubscribed;
        await addCustomSubscribeButtonVideoPage({
          channelId,
          isSubscribed,
        });
      }
    }

    // add "Add to" button for local playlist
    await addCustomAddToLocalPlaylistButton();
  }

  // check if url is a channel page using regex
  const match = url.href.match(CHANNEL_URL_REGEX);
  if (match) {
    const channelId = await fetchChannelIdFromUrl(url.href);
    // check if channel subscribed by id
    if (channelId) {
      const checkIfChannelSubscribedResponse =
        await checkIfChannelSubscribed(channelId);
      if (checkIfChannelSubscribedResponse.success) {
        const isSubscribed = checkIfChannelSubscribedResponse.data.isSubscribed;
        await addCustomSubscribeButtonChannelPage({
          channelId,
          isSubscribed,
        });
      }
    }
  }

  // listId i.e we are on a playlist page
  if (listId) {
    // check if playlist saved by id
    const checkIfPlaylistSavedResponse =
      await checkIfYoutubePlaylistIsSaved(listId);
    if (checkIfPlaylistSavedResponse.success) {
      const isSaved = checkIfPlaylistSavedResponse.data.isSaved;
      await addCustomSavePlaylistButton({ listId, isSaved });
    }
  }
};
