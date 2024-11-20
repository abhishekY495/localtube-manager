export type Video = {
  urlSlug: string;
  title: string;
  duration: string;
  channelName: string;
  addedAt: string;
  // https://i.ytimg.com/<urlSlug>/maxresdefault.jpg
};

export type YoutubeChannel = {
  id: string | null;
  handle: string;
  name: string;
  imageUrl: string;
  addedAt: string;
};

export type Playlists = {
  name: string;
  createdBy: string;
  url: string;
  coverImage: string;
  videos: Video[];
  addedAt: string;
};
