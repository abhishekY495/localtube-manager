import { ACTIONS, DEFAULT_SETTINGS } from "./constants";

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
  id: string | null;
  handle: string | null;
  name: string | null;
  image: string | null;
  addedAt: string;
};

export type Subscription = {
  title: string;
  urlSlug: string;
  channelName: string;
  uploadedAt: string;
  isShort: boolean;
};

export type YoutubePlaylist = {
  name: string;
  channelName: string | null;
  coverImageUrlSlug: string | null;
  urlSlug: string;
  videosCount: number;
  addedAt: string;
};

export type LocalPlaylist = {
  name: string;
  addedAt: string;
  videos: Video[];
};

export type Setting = {
  key: keyof typeof DEFAULT_SETTINGS;
  value: boolean;
};

export type SubscriptionsActiveTab = "videos" | "shorts";

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
  | MessageWithoutData<typeof ACTIONS.GET_ALL_SUBSCRIBED_CHANNELS>
  | MessageWithoutData<typeof ACTIONS.GET_ALL_YOUTUBE_PLAYLISTS>
  | MessageWithoutData<typeof ACTIONS.GET_ALL_LOCAL_PLAYLISTS>
  | MessageWithoutData<typeof ACTIONS.GET_ALL_SUBSCRIPTIONS>
  | MessageWithoutData<typeof ACTIONS.GET_ALL_SETTINGS>
  | MessageWithoutData<typeof ACTIONS.GET_COUNT>
  | MessageWithoutData<typeof ACTIONS.EXPORT_DATABASE_TO_JSON>
  | MessageWithoutData<typeof ACTIONS.SYNC_SUBSCRIPTIONS>
  | MessageWithData<
      typeof ACTIONS.OPEN_LOCAL_PLAYLIST,
      OpenLocalPlaylistRequest
    >
  | MessageWithData<
      typeof ACTIONS.CHECK_IF_VIDEO_LIKED,
      CheckIfVideoIsLikedRequest
    >
  | MessageWithData<typeof ACTIONS.ADD_LIKED_VIDEO, AddLikedVideoRequest>
  | MessageWithData<
      typeof ACTIONS.DELETE_LIKED_VIDEO_BY_ID,
      RemoveLikedVideoRequest
    >
  | MessageWithData<
      typeof ACTIONS.CHECK_IF_CHANNEL_SUBSCRIBED,
      CheckIfChannelSubscribedRequest
    >
  | MessageWithData<
      typeof ACTIONS.ADD_SUBSCRIBED_CHANNEL,
      AddSubscribedChannelRequest
    >
  | MessageWithData<
      typeof ACTIONS.DELETE_SUBSCRIBED_CHANNEL_BY_ID,
      DeleteSubscribedChannelByHandleRequest
    >
  | MessageWithData<
      typeof ACTIONS.CHECK_IF_YOUTUBE_PLAYLIST_IS_SAVED,
      CheckIfYoutubePlaylistIsSavedRequest
    >
  | MessageWithData<
      typeof ACTIONS.ADD_YOUTUBE_PLAYLIST,
      AddYoutubePlaylistRequest
    >
  | MessageWithData<typeof ACTIONS.ADD_LOCAL_PLAYLIST, AddLocalPlaylistRequest>
  | MessageWithData<
      typeof ACTIONS.ADD_VIDEO_TO_LOCAL_PLAYLIST,
      AddVideoToLocalPlaylistRequest
    >
  | MessageWithData<
      typeof ACTIONS.DELETE_YOUTUBE_PLAYLIST_BY_ID,
      DeleteYoutubePlaylistByIdRequest
    >
  | MessageWithData<
      typeof ACTIONS.DELETE_LOCAL_PLAYLIST_BY_NAME,
      DeleteLocalPlaylistByNameRequest
    >
  | MessageWithData<
      typeof ACTIONS.REMOVE_VIDEO_FROM_LOCAL_PLAYLIST,
      RemoveVideoFromLocalPlaylistRequest
    >
  | MessageWithData<typeof ACTIONS.UPDATE_SETTING, UpdateSettingRequest>
  | MessageWithData<typeof ACTIONS.GET_SETTING, GetSettingRequest>
  | MessageWithData<
      typeof ACTIONS.IMPORT_DATABASE_FROM_JSON,
      ImportDatabaseFromJsonRequest
    >;

export type MessageAction = Message["action"];

export type Response<T = void> =
  | ({ success: true } & ([T] extends [void] ? {} : { data: T }))
  | {
      success: false;
      error: string;
    };

export type CountResponse = {
  likedVideosCount: number;
  subscribedChannelsCount: number;
  youtubePlaylistsCount: number;
  localPlaylistsCount: number;
  subscriptionsCount: number;
};

export type OpenLocalPlaylistRequest = {
  playlistName: string;
};

export type CheckIfVideoIsLikedRequest = {
  videoId: string;
};
export type CheckIfVideoLikedResponse = {
  isLiked: boolean;
};

export type AddLikedVideoRequest = {
  video: Video;
};
export type RemoveLikedVideoRequest = {
  videoId: string;
};

export type CheckIfChannelSubscribedRequest = {
  channelId: string;
};
export type CheckIfChannelSubscribedResponse = {
  isSubscribed: boolean;
};

export type AddSubscribedChannelRequest = {
  channel: Channel;
};
export type DeleteSubscribedChannelByHandleRequest = {
  channelId: string;
};

export type CheckIfYoutubePlaylistIsSavedRequest = {
  listId: string;
};
export type CheckIfYoutubePlaylistIsSavedResponse = {
  isSaved: boolean;
};

export type AddYoutubePlaylistRequest = {
  playlist: YoutubePlaylist;
};
export type AddLocalPlaylistRequest = {
  playlist: LocalPlaylist;
};
export type AddVideoToLocalPlaylistRequest = {
  playlistName: string;
  video: Video;
};
export type DeleteYoutubePlaylistByIdRequest = {
  playlistId: string;
};
export type RemoveVideoFromLocalPlaylistRequest = {
  playlistName: string;
  videoId: string;
};
export type DeleteLocalPlaylistByNameRequest = {
  playlistName: string;
};

export type UpdateSettingRequest = {
  key: keyof typeof DEFAULT_SETTINGS;
  value: boolean;
};

export type GetSettingRequest = {
  key: keyof typeof DEFAULT_SETTINGS;
};
export type GetSettingResponse = {
  value: boolean;
};

export type ExportDatabaseToJsonResponse = {
  json: string;
};

export type ImportDatabaseFromJsonRequest = {
  json: string;
};

export type ActiveTab = "youtube" | "local";
export type ImportType = "local" | "google";
