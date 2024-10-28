export type Video = {
  urlSlug: string;
  title: string;
  duration: string;
  channelName: string;
};

export type SubscribedChannels = {
  id: string;
  name: string;
  imageUrl: string;
};

export type Playlists = {
  name: string;
  createdBy: string;
  url: string;
  coverImage: string;
  videos: Video[];
};
