import { initializeYoutubeDB } from "./initializeYoutubeDB";

export async function exportDB() {
  const db = await initializeYoutubeDB();
  const exportData: Record<string, any[]> = {};

  for (const storeName of db.objectStoreNames) {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    exportData[storeName] = await store.getAll();
    await tx.done;
  }

  return JSON.stringify(exportData);
}
