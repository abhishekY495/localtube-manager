import { openDB } from "idb";

export const clearDB = async () => {
  try {
    const db = await openDB("YouTubeDB");
    await db.clear("likedVideos");
    await db.clear("subscribedChannels");
    await db.clear("youtubePlaylists");
    await db.clear("localPlaylists");
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error?.message : String(error),
        name: error instanceof Error ? error?.name : "Unknown Error",
      },
    };
  }
};
