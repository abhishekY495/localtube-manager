import type { LocalPlaylist } from "../utils/types";
import { db } from "./db";

export const getAllLocalPlaylists = async () => {
  const localPlaylists = await db.localPlaylists.toArray();
  return localPlaylists;
};

export const getLocalPlaylistByName = async (playlistName: string) => {
  const playlist = await db.localPlaylists.get(playlistName);
  return playlist;
};

export const addLocalPlaylist = async (playlist: LocalPlaylist) => {
  await db.localPlaylists.add(playlist);
};

export const deleteLocalPlaylistByName = async (playlistName: string) => {
  await db.localPlaylists.delete(playlistName);
};

export const getAllLocalPlaylistsWithCount = async () => {
  const localPlaylists = await db.localPlaylists.toArray();
  return localPlaylists.map((playlist) => ({
    name: playlist.name,
    addedAt: playlist.addedAt,
    videoCount: playlist.videos.length,
  }));
};
