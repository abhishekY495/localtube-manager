import { YoutubePlaylist } from "../types";
import { initializeYoutubeDB } from "./initializeYoutubeDB";

export const checkIfYoutubePlaylistSaved = async (urlSLug: string) => {
  const db = await initializeYoutubeDB();
  const playlist = await db.get("youtubePlaylists", urlSLug);
  return playlist;
};

export const addPlaylistToYoutubePlaylistStore = async (
  playlist: YoutubePlaylist
) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("youtubePlaylists", "readwrite");
  const youtubePlaylistsStore = tx.objectStore("youtubePlaylists");
  await youtubePlaylistsStore.add(playlist);
  await tx.done;
};

export const removePlaylistToYoutubePlaylistStore = async (urlSLug: string) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("youtubePlaylists", "readwrite");
  const youtubePlaylistsStore = tx.objectStore("youtubePlaylists");
  await youtubePlaylistsStore.delete(urlSLug);
  await tx.done;
};

export const getYoutubePlaylist = async () => {
  const db = await initializeYoutubeDB();
  const playlists = await db.getAll("youtubePlaylists");
  return playlists;
};
export const getYoutubePlaylistCount = async () => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("youtubePlaylists", "readonly");
  const store = tx.objectStore("youtubePlaylists");
  const count = await store.count();
  return count;
};

export const clearYoutubePlaylist = async () => {
  const db = await initializeYoutubeDB();
  await db.clear("youtubePlaylists");
};
