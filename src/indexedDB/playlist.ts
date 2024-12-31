import { LocalPlaylist, Video, YoutubePlaylist } from "../types";
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
export const removePlaylistFromLocalPlaylistStore = async (
  playlistName: string
) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("localPlaylists", "readwrite");
  const localPlaylistsStore = tx.objectStore("localPlaylists");
  await localPlaylistsStore.delete(playlistName);
  await tx.done;
};

export const addVideoToLocalPlaylist = async (
  playlistName: string,
  video: Video
) => {
  const db = await initializeYoutubeDB();
  const playlist: LocalPlaylist = await db.get("localPlaylists", playlistName);
  if (playlist) {
    playlist.videos.push(video);
    await db.put("localPlaylists", playlist);
  } else {
    throw new Error(`${playlistName} playlist not found.`);
  }
  return playlist;
};
export const removeVideoFromLocalPlaylist = async (
  playlistName: string,
  video: Video
) => {
  const db = await initializeYoutubeDB();
  const playlist: LocalPlaylist = await db.get("localPlaylists", playlistName);
  if (playlist) {
    playlist.videos = playlist.videos.filter(
      (existingVideo) => existingVideo.urlSlug !== video.urlSlug
    );
    await db.put("localPlaylists", playlist);
  } else {
    throw new Error(`${playlistName} playlist not found.`);
  }
  return playlist;
};

export const getLocalPlaylistsDetailed = async () => {
  const db = await initializeYoutubeDB();
  const localPlaylists = await db.getAll("localPlaylists");
  return localPlaylists;
};
export const getLocalPlaylistsNotDetailed = async () => {
  const db = await initializeYoutubeDB();
  const localPlaylists = await db.getAll("localPlaylists");
  const newLocalPlaylists = localPlaylists.map((playlist) => {
    return {
      name: playlist.name,
      addedAt: playlist.addedAt,
      videos: playlist.videos.map((video: Video) => video.urlSlug),
    };
  });
  return newLocalPlaylists;
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
