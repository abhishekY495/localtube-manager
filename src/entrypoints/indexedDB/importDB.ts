import {
  LocalPlaylist,
  Video,
  YoutubeChannel,
  YoutubePlaylist,
} from "../types";
import { clearDB } from "./clearDB";
import { initializeYoutubeDB } from "./initializeYoutubeDB";

export type DatabaseExport = {
  likedVideos: Video[];
  subscribedChannels: YoutubeChannel[];
  youtubePlaylists: YoutubePlaylist[];
  localPlaylists: LocalPlaylist[];
};

export async function importDB(jsonData: string) {
  const data: DatabaseExport = JSON.parse(jsonData);
  const db = await initializeYoutubeDB();

  try {
    // clear all data then import new data
    const { success, error } = await clearDB();
    if (success) {
      for (const [storeName, records] of Object.entries(data)) {
        if (db.objectStoreNames.contains(storeName)) {
          const tx = db.transaction(storeName, "readwrite");
          const store = tx.objectStore(storeName);
          for (const record of records) {
            await store.put(record);
          }
          await tx.done;
        } else {
          console.warn(
            `Object store ${storeName} does not exist in the database.`
          );
        }
      }
      return {
        success: true,
        error: null,
      };
    } else {
      return {
        sucess: false,
        error: error,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error?.message : String(error),
        name: error instanceof Error ? error?.name : "Unknown Error",
      },
    };
  }
}
