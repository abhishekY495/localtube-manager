import { initializeYoutubeDB } from "./initializeYoutubeDB";
import { YoutubeChannel } from "../types";

export const checkIfChannelSubscribed = async (channelHandle: string) => {
  const db = await initializeYoutubeDB();
  const channel = await db.get("subscribedChannels", channelHandle);
  return channel;
};

export const addChannelToSubscribedChannelStore = async (
  channel: YoutubeChannel
) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("subscribedChannels", "readwrite");
  const subscribedChannelsStore = tx.objectStore("subscribedChannels");
  await subscribedChannelsStore.add(channel);
  await tx.done;
};

export const removeChannelFromSubscribedChannelStore = async (
  channelHandle: string
) => {
  const db = await initializeYoutubeDB();
  const tx = db.transaction("subscribedChannels", "readwrite");
  const subscribedChannelsStore = tx.objectStore("subscribedChannels");
  await subscribedChannelsStore.delete(channelHandle);
  await tx.done;
};

export const getSubscribedChannels = async () => {
  const db = await initializeYoutubeDB();
  const subscribedChannels = await db.getAll("subscribedChannels");
  return subscribedChannels;
};

export const clearSubscribedChannels = async () => {
  const db = await initializeYoutubeDB();
  await db.clear("subscribedChannels");
};
