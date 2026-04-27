import { ACTIONS } from "./constants";

export type Video = {
  title: string;
  urlSlug: string;
  channelHandle: string | null;
  channelName: string | null;
  duration: string | null;
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

type MessageWithoutData<TAction extends string> = {
  action: TAction;
};

type MessageWithData<TAction extends string, TData> = {
  action: TAction;
  data: TData;
};

export type Message =
  | MessageWithoutData<typeof ACTIONS.TOGGLE_SIDEBAR>
  | MessageWithoutData<typeof ACTIONS.OPEN_DASHBOARD>
  | MessageWithoutData<typeof ACTIONS.GET_ALL_LIKED_VIDEOS>
  | MessageWithData<
      typeof ACTIONS.CHECK_IF_VIDEO_IS_LIKED,
      CheckIfVideoIsLikedRequest
    >
  | MessageWithData<typeof ACTIONS.ADD_LIKED_VIDEO, AddLikedVideoRequest>
  | MessageWithData<
      typeof ACTIONS.DELETE_LIKED_VIDEO_BY_ID,
      RemoveLikedVideoRequest
    >;

export type MessageAction = Message["action"];

export type Response<T = void> =
  | ({ success: true } & ([T] extends [void] ? {} : { data: T }))
  | {
      success: false;
      error: string;
    };

export type CheckIfVideoIsLikedRequest = {
  videoId: string;
};
export type CheckIfVideoIsLikedResponse = {
  isLiked: boolean;
};

export type AddLikedVideoRequest = {
  video: Video;
};

export type RemoveLikedVideoRequest = {
  videoId: string;
};
