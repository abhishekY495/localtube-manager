import { DEFAULT_SETTINGS } from "../utils/constants";
import { db } from "./db";

export const initSettings = async () => {
  const defaultSettings = Object.entries(DEFAULT_SETTINGS).map(
    ([key, value]) => ({
      key: key as keyof typeof DEFAULT_SETTINGS,
      value,
    }),
  );
  const existingSettings = await db.settings.bulkGet(
    defaultSettings.map(({ key }) => key),
  );
  const missingSettings = defaultSettings.filter(
    (_, index) => !existingSettings[index],
  );

  if (missingSettings.length > 0) {
    await db.settings.bulkAdd(missingSettings);
  }
};

export const getAllSettings = async () => {
  const settings = await db.settings.toArray();
  return settings;
};

export const getSetting = async (key: keyof typeof DEFAULT_SETTINGS) => {
  const setting = await db.settings.get(key);
  return setting?.value;
};

export const updateSetting = async (
  key: keyof typeof DEFAULT_SETTINGS,
  value: boolean,
) => {
  await db.settings.put({ key, value });
};

export const exportDatabaseToJson = async () => {
  const [
    likedVideos,
    subscribedChannels,
    youtubePlaylists,
    localPlaylists,
    subscriptions,
    settings,
  ] = await Promise.all([
    db.likedVideos.toArray(),
    db.subscribedChannels.toArray(),
    db.youtubePlaylists.toArray(),
    db.localPlaylists.toArray(),
    db.subscriptions.toArray(),
    db.settings.toArray(),
  ]);

  const data = {
    database: db.name,
    exportedAt: new Date().toISOString(),
    data: {
      likedVideos,
      subscribedChannels,
      youtubePlaylists,
      localPlaylists,
      subscriptions,
      settings,
    },
  };

  return JSON.stringify(data, null, 2);
};
