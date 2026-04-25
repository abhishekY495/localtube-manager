export type Video = {
  title: string;
  urlSlug: string;
  channelHandle: string;
  channelName: string;
  duration: string;
  addedAt: string;
  isShort: boolean;
};

export type Channel = {
  handle: string;
  id: string;
  name: string;
  image: string;
  addedAt: string;
};

export type Subscriptions = {
  title: string;
  urlSlug: string;
  channelHandle: string;
  channelName: string;
  duration: string;
  uploadedAt: string;
  isShort: boolean;
};

export type YoutubePlaylist = {
  name: string;
  channelName: string;
  coverImageUrlSlug: string;
  urlSlug: string;
  videosCount: number;
  addedAt: string;
};

export type LocalPlaylist = {
  name: string;
  addedAt: string;
  videos: Video[];
};

export type Message = {
  action: string;
};

export type Response<T> = {
  success: boolean;
  data: T;
  error?: string;
};
