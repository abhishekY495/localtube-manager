import type { LocalPlaylist, Video } from "../utils/types";
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

export const updateLocalPlaylistName = async (
  playlistName: string,
  newName: string,
) => {
  await db.transaction("rw", db.localPlaylists, async () => {
    const playlist = await db.localPlaylists.get(playlistName);
    if (!playlist) {
      throw new Error("Playlist not found");
    }

    if (playlistName === newName) {
      return;
    }

    const existingPlaylist = await db.localPlaylists.get(newName);
    if (existingPlaylist) {
      throw new Error("Playlist name already exists");
    }

    await db.localPlaylists.add({
      ...playlist,
      name: newName,
    });
    await db.localPlaylists.delete(playlistName);
  });
};

export const addVideoToLocalPlaylist = async (
  playlistName: string,
  video: Video,
) => {
  const playlist = await db.localPlaylists.get(playlistName);
  if (!playlist) {
    throw new Error("Playlist not found");
  }
  if (playlist.videos.some((v) => v.urlSlug === video.urlSlug)) {
    throw new Error("Video already in playlist");
  }
  playlist.videos.push(video);
  await db.localPlaylists.put(playlist);
};

export const removeVideoFromLocalPlaylist = async (
  playlistName: string,
  videoUrlSlug: string,
) => {
  const playlist = await db.localPlaylists.get(playlistName);
  if (!playlist) {
    throw new Error("Playlist not found");
  }
  playlist.videos = playlist.videos.filter((v) => v.urlSlug !== videoUrlSlug);
  await db.localPlaylists.put(playlist);
};
