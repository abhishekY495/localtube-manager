import { NAV_ITEM_LABELS, type NavItemLabel } from "./constants";
import type { CountResponse } from "./types";

export const getNavItemCount = (
  label: NavItemLabel,
  count: CountResponse | null,
): number | string => {
  if (!count) {
    return "";
  }

  switch (label) {
    case NAV_ITEM_LABELS.SUBSCRIPTIONS:
      return count.subscriptionsCount;
    case NAV_ITEM_LABELS.LIKED_VIDEOS:
      return count.likedVideosCount;
    case NAV_ITEM_LABELS.CHANNELS:
      return count.subscribedChannelsCount;
    case NAV_ITEM_LABELS.PLAYLISTS:
      return count.youtubePlaylistsCount + count.localPlaylistsCount;
    default:
      return "";
  }
};
