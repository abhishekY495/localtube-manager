import type { Subscription } from "../utils/types";
import { db } from "./db";

export const getAllSubscriptions = async () => {
  const subscriptions = await db.subscriptions.toArray();
  return subscriptions;
};

export const addSubscription = async (subscription: Subscription) => {
  await db.subscriptions.add(subscription);
};
