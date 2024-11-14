export type Video = {
  urlSlug: string;
  title: string;
  duration: string;
  channelName: string;
  addedAt: string;
};
// https://i.ytimg.com/<urlSlug>/maxresdefault.jpg

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
