export type Video = {
  urlSlug: string;
  title: string;
  duration: string;
  channelName: string;
  channelHandle: string;
  addedAt: string;
  // video-thumbnail -> https://i.ytimg.com/vi/<urlSlug>/mqdefault.jpg
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

export type RequestData = {
  task: string;
  data: Record<string, any>;
};

export type ResponseData = {
  success: boolean;
  data: Record<string, any>;
};
