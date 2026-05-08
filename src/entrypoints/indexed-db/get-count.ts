import { db } from "./db";

export const getCount = async () => {
  const likedVideosCount = await db.likedVideos.count();
  const subscribedChannelsCount = await db.subscribedChannels.count();
  const youtubePlaylistsCount = await db.youtubePlaylists.count();
  const localPlaylistsCount = await db.localPlaylists.count();
  const subscriptionsCount = await db.subscriptions.count();

  return {
    likedVideosCount,
    subscribedChannelsCount,
    youtubePlaylistsCount,
    localPlaylistsCount,
    subscriptionsCount,
  };
};
