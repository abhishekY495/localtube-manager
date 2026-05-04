import type { Subscription } from "../utils/types";
import { db } from "./db";

export const getAllSubscriptions = async () => {
  const subscriptions = await db.subscriptions.toArray();
  return subscriptions;
};

export const addSubscription = async (subscription: Subscription) => {
  await db.subscriptions.add(subscription);
};

export const syncSubscriptionsWithLatestVideos = async (
  latestVideos: Subscription[],
) => {
  const latestVideosByUrlSlug = new Map(
    latestVideos.map((video) => [video.urlSlug, video]),
  );
  let addedVideos: Subscription[] = [];

  await db.transaction("rw", db.subscriptions, async () => {
    const existingSubscriptions = await db.subscriptions.toArray();
    const existingUrlSlugs = new Set(
      existingSubscriptions.map((subscription) => subscription.urlSlug),
    );

    const videosToAdd = [...latestVideosByUrlSlug.values()].filter(
      (video) => !existingUrlSlugs.has(video.urlSlug),
    );
    addedVideos = videosToAdd;

    const urlSlugsToDelete = existingSubscriptions
      .filter(
        (subscription) => !latestVideosByUrlSlug.has(subscription.urlSlug),
      )
      .map((subscription) => subscription.urlSlug);

    if (videosToAdd.length > 0) {
      await db.subscriptions.bulkAdd(videosToAdd);
    }

    if (urlSlugsToDelete.length > 0) {
      await db.subscriptions.bulkDelete(urlSlugsToDelete);
    }
  });

  return addedVideos;
};
