export type Video = {
  urlSlug: string;
  title: string;
  duration: string;
  channelName: string;
  channelHandle: string;
  addedAt: string;
};

export type YoutubeChannel = {
  id: string | null;
  handle: string;
  name: string;
  imageUrl: string;
  addedAt: string;
};

export type YoutubePlaylist = {
  name: string;
  urlSlug: string;
  coverImageUrlSlug: string;
  videosCount: number;
  channelName: string;
  addedAt: string;
};

export type LocalPlaylist = {
  name: string;
  videos: Video[];
  addedAt: string;
};

export type LocalPlaylistNotDetailed = {
  name: string;
  videos: string[];
  addedAt: string;
};

export type RequestData = {
  task: string;
  data: Record<string, any>;
};

export type ResponseData = {
  success: boolean;
  data: Record<string, any>;
  error: { message: string; name: string };
};



// ✅ Create an object that exports all types as the default export
const types = {
  Video: {} as Video,
  YoutubeChannel: {} as YoutubeChannel,
  YoutubePlaylist: {} as YoutubePlaylist,
  LocalPlaylist: {} as LocalPlaylist,
  LocalPlaylistNotDetailed: {} as LocalPlaylistNotDetailed,
  RequestData: {} as RequestData,
  ResponseData: {} as ResponseData,
};

export default types;
