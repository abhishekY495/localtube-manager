import type { Channel } from "../utils/types";
import { db } from "./db";

export const getAllSubscribedChannels = async () => {
  const subscribedChannels = await db.subscribedChannels.toArray();
  return subscribedChannels;
};

export const getSubscribedChannelById = async (id: string) => {
  const subscribedChannel = await db.subscribedChannels.get(id);
  return subscribedChannel;
};

export const addSubscribedChannel = async (channel: Channel) => {
  await db.subscribedChannels.add(channel);
};

export const deleteSubscribedChannelById = async (id: string) => {
  await db.subscribedChannels.delete(id);
};
