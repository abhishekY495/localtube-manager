import Dexie, { type EntityTable } from "dexie";
import type {
  Channel,
  LocalPlaylist,
  Setting,
  Subscription,
  Video,
  YoutubePlaylist,
} from "@/entrypoints/utils/types";
import { DB_NAME } from "../utils/constants";

export const db = new Dexie(DB_NAME) as Dexie & {
  likedVideos: EntityTable<Video, "urlSlug">;
  subscribedChannels: EntityTable<Channel, "id">;
  youtubePlaylists: EntityTable<YoutubePlaylist, "urlSlug">;
  localPlaylists: EntityTable<LocalPlaylist, "name">;
  subscriptions: EntityTable<Subscription, "urlSlug">;
  settings: EntityTable<Setting, "key">;
};

db.version(1).stores({
  likedVideos: "urlSlug",
  subscribedChannels: "id",
  youtubePlaylists: "urlSlug",
  localPlaylists: "name",
  subscriptions: "urlSlug",
  settings: "key",
});
