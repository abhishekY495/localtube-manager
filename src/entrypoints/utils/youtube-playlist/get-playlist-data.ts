import { CHANNEL_VIDEO_COUNT_REGEX, SELECTORS } from "../constants";
import { findElementBySelectors } from "../find-element-by-selectors";
import { YoutubePlaylist } from "../types";

export const getPlaylistData = async (
  listId: string,
): Promise<YoutubePlaylist> => {
  let playlistChannelName, playlistCoverImageUrlSlug, playlistVideoCount;

  const playlistName = document.title.replace(" - YouTube", "");

  const playlistChannelNameElement = await findElementBySelectors(
    SELECTORS.PLAYLIST_CHANNEL_NAME_ELEMENTS,
  );
  playlistChannelName =
    playlistChannelNameElement?.textContent?.replace("by ", "") ?? null;

  const playlistCoverImageUrlSlugElement = await findElementBySelectors(
    SELECTORS.PLAYLIST_COVER_IMAGE_ELEMENTS,
  );
  const playlistCoverImageUrlLink =
    playlistCoverImageUrlSlugElement?.getAttribute("href");
  if (playlistCoverImageUrlLink) {
    const params = new URLSearchParams(playlistCoverImageUrlLink.split("?")[1]);
    playlistCoverImageUrlSlug = params.get("v") ?? null;
  } else {
    playlistCoverImageUrlSlug = null;
  }

  const playlistVideoCountElement = await findElementBySelectors(
    SELECTORS.PLAYLIST_VIDEOS_COUNT_ELEMENTS,
  );
  if (playlistVideoCountElement) {
    const spans = playlistVideoCountElement.querySelectorAll("span");
    let result = [...spans].find((el) =>
      CHANNEL_VIDEO_COUNT_REGEX.test(el.textContent ?? ""),
    );
    playlistVideoCount =
      Number(result?.textContent?.replace(" videos", "")) ?? 0;
  } else {
    playlistVideoCount = 0;
  }

  return {
    name: playlistName,
    channelName: playlistChannelName,
    coverImageUrlSlug: playlistCoverImageUrlSlug,
    urlSlug: listId,
    videosCount: playlistVideoCount,
    addedAt: new Date().toISOString(),
  };
};
