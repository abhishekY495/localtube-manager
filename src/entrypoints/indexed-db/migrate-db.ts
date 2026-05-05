import Dexie from "dexie";
import { OLD_DB_NAME } from "../utils/constants";
import type {
  Channel,
  LocalPlaylist,
  Video,
  YoutubePlaylist,
} from "../utils/types";
import { db } from "./db";

type OldRecord = Record<string, unknown>;
type WritableTable<T> = {
  toArray: () => Promise<T[]>;
  bulkPut: (records: T[]) => Promise<unknown>;
};

const asString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const asNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const toUrl = (value: string | null) => {
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const extractVideoId = (...values: unknown[]) => {
  for (const value of values) {
    const text = asString(value);
    if (!text) continue;

    const url = toUrl(text);
    const videoId =
      url?.searchParams.get("v") ||
      url?.pathname.match(/\/(?:shorts|embed)\/([^/?]+)/)?.[1] ||
      text.match(/(?:v=|\/shorts\/|\/embed\/)([A-Za-z0-9_-]{11})/)?.[1] ||
      text.match(/^[A-Za-z0-9_-]{11}$/)?.[0];

    if (videoId) return videoId;
  }

  return null;
};

const extractPlaylistId = (...values: unknown[]) => {
  for (const value of values) {
    const text = asString(value);
    if (!text) continue;

    const url = toUrl(text);
    const playlistId =
      url?.searchParams.get("list") ||
      text.match(/[?&]list=([^&]+)/)?.[1] ||
      text.match(/^[A-Za-z0-9_-]+$/)?.[0];

    if (playlistId) return playlistId;
  }

  return null;
};

const extractChannelId = (...values: unknown[]) => {
  for (const value of values) {
    const text = asString(value);
    if (!text) continue;

    const channelId =
      text.match(/UC[A-Za-z0-9_-]{22}/)?.[0] ||
      text.match(/^UC[A-Za-z0-9_-]{22}$/)?.[0];

    if (channelId) return channelId;
  }

  return null;
};

const normalizeChannelHandle = (...values: unknown[]) => {
  for (const value of values) {
    const text = asString(value);
    if (!text) continue;

    const url = toUrl(text);
    const handle =
      url?.pathname.match(/\/@([^/?]+)/)?.[1] ||
      url?.pathname.match(/\/channel\/([^/?]+)/)?.[1] ||
      url?.pathname.match(/\/(?:c|user)\/([^/?]+)/)?.[1] ||
      text.match(/@([\w.-]+)/)?.[1] ||
      (text.startsWith("@") ? text.slice(1) : text);

    if (handle) return handle.replace(/^@/, "");
  }

  return null;
};

const normalizeChannelImage = (...values: unknown[]) => {
  for (const value of values) {
    const image = asString(value);
    if (image) return image.replace("=s176", "=s160");
  }

  return null;
};

const normalizeVideo = (record: OldRecord): Video | null => {
  const urlSlug = extractVideoId(
    record.urlSlug,
    record.id,
    record.videoId,
    record.url,
    record.videoUrl,
  );

  if (!urlSlug) return null;

  const videoUrl = asString(record.url) ?? asString(record.videoUrl);

  return {
    title: asString(record.title) ?? "",
    urlSlug,
    channelHandle: normalizeChannelHandle(
      record.channelHandle,
      record.channelUrl,
    ),
    channelName: asString(record.channelName),
    duration: asString(record.duration),
    addedAt: asString(record.addedAt) ?? new Date().toISOString(),
    isShort: Boolean(record.isShort) || Boolean(videoUrl?.includes("/shorts/")),
  };
};

const normalizeChannel = (record: OldRecord): Channel | null => {
  const id = extractChannelId(record.id, record.channelId, record.url);

  if (!id) return null;

  return {
    id,
    name: asString(record.name) ?? asString(record.channelName),
    handle: normalizeChannelHandle(record.handle, record.channelHandle),
    image: normalizeChannelImage(record.image, record.imageUrl),
    addedAt: asString(record.addedAt) ?? new Date().toISOString(),
  };
};

const normalizeYoutubePlaylist = (record: OldRecord): YoutubePlaylist | null => {
  const urlSlug = extractPlaylistId(
    record.urlSlug,
    record.id,
    record.playlistId,
    record.url,
    record.playlistUrl,
  );

  if (!urlSlug) return null;

  return {
    name: asString(record.name) ?? asString(record.title) ?? "",
    channelName: asString(record.channelName),
    coverImageUrlSlug: extractVideoId(
      record.coverImageUrlSlug,
      record.coverImageUrl,
      record.coverImage,
      record.thumbnailUrl,
    ),
    urlSlug,
    videosCount: asNumber(record.videosCount),
    addedAt: asString(record.addedAt) ?? new Date().toISOString(),
  };
};

const normalizeLocalPlaylist = (record: OldRecord): LocalPlaylist | null => {
  const name = asString(record.name);
  if (!name) return null;

  const videos = Array.isArray(record.videos)
    ? record.videos.flatMap((video) => {
        const normalizedVideo = normalizeVideo(video as OldRecord);
        return normalizedVideo ? [normalizedVideo] : [];
      })
    : [];

  return {
    name,
    addedAt: asString(record.addedAt) ?? new Date().toISOString(),
    videos,
  };
};

const readOldTable = async <T>(
  oldDb: Dexie,
  tableName: string,
  normalize: (record: OldRecord) => T | null,
) => {
  if (!oldDb.tables.some((table) => table.name === tableName)) return [];

  const records = (await oldDb.table(tableName).toArray()) as OldRecord[];
  return records.flatMap((record) => {
    const normalizedRecord = normalize(record);
    return normalizedRecord ? [normalizedRecord] : [];
  });
};

const uniqueBy = <T>(records: T[], getKey: (record: T) => string | null) => {
  const recordsByKey = new Map<string, T>();

  for (const record of records) {
    const key = getKey(record);
    if (key && !recordsByKey.has(key)) {
      recordsByKey.set(key, record);
    }
  }

  return [...recordsByKey.values()];
};

const putMissing = async <T>(
  table: WritableTable<T>,
  records: T[],
  getKey: (record: T) => string | null,
) => {
  const existingKeys = new Set((await table.toArray()).map(getKey));
  const missingRecords = uniqueBy(records, getKey).filter((record) => {
    const key = getKey(record);
    return key && !existingKeys.has(key);
  });

  if (missingRecords.length > 0) {
    await table.bulkPut(missingRecords);
  }
};

const mergeLocalPlaylists = async (playlists: LocalPlaylist[]) => {
  for (const playlist of uniqueBy(playlists, (record) => record.name)) {
    const existingPlaylist = await db.localPlaylists.get(playlist.name);

    if (!existingPlaylist) {
      await db.localPlaylists.put(playlist);
      continue;
    }

    const existingVideoIds = new Set(
      existingPlaylist.videos.map((video) => video.urlSlug),
    );
    const missingVideos = playlist.videos.filter(
      (video) => !existingVideoIds.has(video.urlSlug),
    );

    if (missingVideos.length > 0) {
      await db.localPlaylists.put({
        ...existingPlaylist,
        videos: [...existingPlaylist.videos, ...missingVideos],
      });
    }
  }
};

export const migrateDb = async () => {
  const oldDbExists = await Dexie.exists(OLD_DB_NAME);
  if (!oldDbExists) return;

  const oldDb = new Dexie(OLD_DB_NAME);

  try {
    await oldDb.open();

    const [
      likedVideos,
      subscribedChannels,
      youtubePlaylists,
      localPlaylists,
    ] = await Promise.all([
      readOldTable(oldDb, "likedVideos", normalizeVideo),
      readOldTable(oldDb, "subscribedChannels", normalizeChannel),
      readOldTable(oldDb, "youtubePlaylists", normalizeYoutubePlaylist),
      readOldTable(oldDb, "localPlaylists", normalizeLocalPlaylist),
    ]);

    await db.transaction(
      "rw",
      [
        db.likedVideos,
        db.subscribedChannels,
        db.youtubePlaylists,
        db.localPlaylists,
      ],
      async () => {
        await putMissing(
          db.likedVideos,
          likedVideos,
          (record) => record.urlSlug ?? null,
        );
        await putMissing(db.subscribedChannels, subscribedChannels, (record) =>
          record.id,
        );
        await putMissing(db.youtubePlaylists, youtubePlaylists, (record) =>
          record.urlSlug ?? null,
        );
        await mergeLocalPlaylists(localPlaylists);
      },
    );
  } catch (error) {
    console.error(`Failed to migrate old IndexedDB "${OLD_DB_NAME}"`, error);
    return;
  } finally {
    oldDb.close();
  }

  try {
    await Dexie.delete(OLD_DB_NAME);
  } catch (error) {
    console.warn(`Failed to delete old IndexedDB "${OLD_DB_NAME}"`, error);
  }
};
