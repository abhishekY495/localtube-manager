import type { Channel } from "../utils/types";
import { db } from "./db";

export const getAllSubscribedChannels = async () => {
  const subscribedChannels = await db.subscribedChannels.toArray();
  return subscribedChannels;
};

export const getSubscribedChannelById = async (channelId: string) => {
  const subscribedChannel = await db.subscribedChannels.get(channelId);
  return subscribedChannel;
};

export const addSubscribedChannel = async (channel: Channel) => {
  await db.subscribedChannels.add(channel);
};

export const deleteSubscribedChannelById = async (channelId: string) => {
  await db.subscribedChannels.delete(channelId);
};

export const addSubscribedChannels = async (channels: Channel[]) => {
  await db.subscribedChannels.bulkAdd(channels);
};
