import Dexie, { type EntityTable } from "dexie";
import type {
  Channel,
  LocalPlaylist,
  Subscriptions,
  Video,
  YoutubePlaylist,
} from "@/entrypoints/utils/types";

export const db = new Dexie("LocalTube-Manager-DB") as Dexie & {
  likedVideos: EntityTable<Video, "urlSlug">;
  subscribedChannels: EntityTable<Channel, "handle">;
  youtubePlaylists: EntityTable<YoutubePlaylist, "urlSlug">;
  localPlaylists: EntityTable<LocalPlaylist, "name">;
  subscriptions: EntityTable<Subscriptions, "urlSlug">;
};

db.version(1).stores({
  likedVideos: "urlSlug",
  subscribedChannels: "id",
  youtubePlaylists: "urlSlug",
  localPlaylists: "name",
  subscriptions: "urlSlug",
});
