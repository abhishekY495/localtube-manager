import { LicenseKey } from "../types";
import { initializeYoutubeDB } from "./initializeYoutubeDB";

export const getLicenseKey = async () => {
  const db = await initializeYoutubeDB();
  const licenseKey = await db.getAll("licenseKey");
  return licenseKey;
};

export const clearLicenseKey = async () => {
  const db = await initializeYoutubeDB();
  await db.clear("licenseKey");
};

export const addLicenseKey = async (key: LicenseKey) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("licenseKey", "readwrite");
  const licenseKeyStore = tx.objectStore("licenseKey");
  await licenseKeyStore.put(key);
  await tx.done;
};
