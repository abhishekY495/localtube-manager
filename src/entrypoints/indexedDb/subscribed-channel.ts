import { Channel } from "../utils/types";
import { db } from "./db";

export const getAllSubscribedChannels = async () => {
  const subscribedChannels = await db.subscribedChannels.toArray();
  return subscribedChannels;
};

export const getSubscribedChannelByHandle = async (channelHandle: string) => {
  const subscribedChannel = await db.subscribedChannels.get(channelHandle);
  return subscribedChannel;
};

export const addSubscribedChannel = async (channel: Channel) => {
  await db.subscribedChannels.add(channel);
};

export const deleteSubscribedChannelByHandle = async (
  channelHandle: string,
) => {
  await db.subscribedChannels.delete(channelHandle);
};
