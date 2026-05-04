import { db } from "./db";
import type { YoutubePlaylist } from "../utils/types";

export const getAllYoutubePlaylists = async () => {
  const youtubePlaylists = await db.youtubePlaylists.toArray();
  return youtubePlaylists;
};

export const getYoutubePlaylistById = async (listId: string) => {
  const playlist = await db.youtubePlaylists.get(listId);
  return playlist;
};

export const addYoutubePlaylist = async (playlist: YoutubePlaylist) => {
  await db.youtubePlaylists.add(playlist);
};

export const deleteYoutubePlaylistById = async (listId: string) => {
  await db.youtubePlaylists.delete(listId);
};
