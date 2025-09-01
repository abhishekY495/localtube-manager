import { Settings } from "../types";
import { initializeYoutubeDB } from "./initializeYoutubeDB";

export const getSettings = async (): Promise<Settings> => {
  const db = await initializeYoutubeDB();
  const settings = await db.get("settings", "freshVideosSettings");
  
  if (!settings) {
    const defaultSettings: Settings = {
      freshVideosFetchInterval: 60, // 1 hour by default
      lastFreshVideosFetch: new Date(0).toISOString()
    };
    await saveSettings(defaultSettings);
    return defaultSettings;
  }
  
  return settings.value;
};

export const saveSettings = async (settings: Settings) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("settings", "readwrite");
  const settingsStore = tx.objectStore("settings");
  await settingsStore.put({ key: "freshVideosSettings", value: settings });
  await tx.done;
};

export const updateLastFetchTime = async () => {
  const settings = await getSettings();
  settings.lastFreshVideosFetch = new Date().toISOString();
  await saveSettings(settings);
};

export const shouldFetchFreshVideos = async (): Promise<boolean> => {
  const settings = await getSettings();
  const lastFetch = new Date(settings.lastFreshVideosFetch);
  const now = new Date();
  const intervalMs = settings.freshVideosFetchInterval * 60 * 1000; // convert minutes to ms
  
  return (now.getTime() - lastFetch.getTime()) >= intervalMs;
};