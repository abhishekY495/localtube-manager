import { LocalPlaylist, YoutubePlaylist } from "../types";
import { initializeYoutubeDB } from "./initializeYoutubeDB";

// Youtube
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
export const removePlaylistFromYoutubePlaylistStore = async (
  urlSLug: string
) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("youtubePlaylists", "readwrite");
  const youtubePlaylistsStore = tx.objectStore("youtubePlaylists");
  await youtubePlaylistsStore.delete(urlSLug);
  await tx.done;
};
export const getYoutubePlaylists = async () => {
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

// Local
export const checkIfLocalPlaylistSaved = async (urlSLug: string) => {
  const db = await initializeYoutubeDB();
  const playlist = await db.get("localPlaylists", urlSLug);
  return playlist;
};
export const addPlaylistToLocalPlaylistStore = async (
  playlist: LocalPlaylist
) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("localPlaylists", "readwrite");
  const localPlaylistsStore = tx.objectStore("localPlaylists");
  await localPlaylistsStore.add(playlist);
  await tx.done;
};
export const removePlaylistFromLocalPlaylistStore = async (urlSLug: string) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("localPlaylists", "readwrite");
  const localPlaylistsStore = tx.objectStore("localPlaylists");
  await localPlaylistsStore.delete(urlSLug);
  await tx.done;
};
export const getLocalPlaylists = async () => {
  const db = await initializeYoutubeDB();
  const localPlaylists = await db.getAll("localPlaylists");
  return localPlaylists;
};
export const getLocalPlaylistCount = async () => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("localPlaylists", "readonly");
  const store = tx.objectStore("localPlaylists");
  const count = await store.count();
  return count;
};
export const clearLocalPlaylist = async () => {
  const db = await initializeYoutubeDB();
  await db.clear("localPlaylists");
};
