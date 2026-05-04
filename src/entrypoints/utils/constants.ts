import {
  ListVideoIcon,
  MegaphoneIcon,
  SettingsIcon,
  ThumbsUpIcon,
  TvMinimalPlayIcon,
} from "lucide-react";

export const ACTIONS = {
  TOGGLE_SIDEBAR: "toggle_sidebar",
  OPEN_DASHBOARD: "open_dashboard",
  GET_COUNT: "get_count",
  OPEN_LOCAL_PLAYLIST: "open_local_playlist",
  //
  CHECK_IF_VIDEO_LIKED: "check_if_video_liked",
  CHECK_IF_CHANNEL_SUBSCRIBED: "check_if_channel_subscribed",
  CHECK_IF_YOUTUBE_PLAYLIST_IS_SAVED: "check_if_youtube_playlist_is_saved",
  //
  GET_ALL_LIKED_VIDEOS: "get_all_liked_videos",
  GET_ALL_SUBSCRIBED_CHANNELS: "get_all_subscribed_channels",
  GET_ALL_YOUTUBE_PLAYLISTS: "get_all_youtube_playlists",
  GET_ALL_LOCAL_PLAYLISTS: "get_all_local_playlists",
  GET_ALL_SUBSCRIPTIONS: "get_all_subscriptions",
  //
  ADD_LIKED_VIDEO: "add_liked_video",
  ADD_SUBSCRIBED_CHANNEL: "add_subscribed_channel",
  ADD_YOUTUBE_PLAYLIST: "add_youtube_playlist",
  ADD_LOCAL_PLAYLIST: "add_local_playlist",
  ADD_VIDEO_TO_LOCAL_PLAYLIST: "add_video_to_local_playlist",
  //
  DELETE_LIKED_VIDEO_BY_ID: "delete_liked_video_by_id",
  DELETE_SUBSCRIBED_CHANNEL_BY_ID: "delete_subscribed_channel_by_id",
  DELETE_YOUTUBE_PLAYLIST_BY_ID: "delete_youtube_playlist_by_id",
  DELETE_LOCAL_PLAYLIST_BY_NAME: "delete_local_playlist_by_name",
  REMOVE_VIDEO_FROM_LOCAL_PLAYLIST: "remove_video_from_local_playlist",
  //
  SUBSCRIPTIONS_CRON_JOB: "subscriptions_cron_job",
  //
  GET_ALL_SETTINGS: "get_all_settings",
  UPDATE_SETTING: "update_setting",
} as const;

export const NAV_ITEM_LABELS = {
  SUBSCRIPTIONS: "Subscriptions",
  LIKED_VIDEOS: "Liked videos",
  CHANNELS: "Channels",
  PLAYLISTS: "Playlists",
  SETTINGS: "Settings",
} as const;

export const NAV_ITEMS = [
  {
    label: NAV_ITEM_LABELS.SUBSCRIPTIONS,
    icon: MegaphoneIcon,
    showCount: true,
  },
  {
    label: NAV_ITEM_LABELS.LIKED_VIDEOS,
    icon: ThumbsUpIcon,
    showCount: true,
  },
  {
    label: NAV_ITEM_LABELS.CHANNELS,
    icon: TvMinimalPlayIcon,
    showCount: true,
  },
  {
    label: NAV_ITEM_LABELS.PLAYLISTS,
    icon: ListVideoIcon,
    showCount: true,
  },
  {
    label: NAV_ITEM_LABELS.SETTINGS,
    icon: SettingsIcon,
    showCount: false,
  },
] as const;

export type NavItemLabel =
  (typeof NAV_ITEM_LABELS)[keyof typeof NAV_ITEM_LABELS];

export type NavItem = (typeof NAV_ITEMS)[number];

export const SELECTORS = {
  LIKE_BUTTON_ELEMENTS: [
    "#above-the-fold",
    "#top-row",
    "#actions",
    "ytd-menu-renderer",
    "#top-level-buttons-computed",
  ],
  LIKE_COUNT_ELEMENTS_1: [`[aria-label*="likes"]`, "span"],
  LIKE_COUNT_ELEMENTS_2: [
    "#above-the-fold",
    "#top-row",
    "#actions",
    "ytd-menu-renderer",
    "#top-level-buttons-computed",
    "like-button-view-model",
  ],
  VIDEO_DURATION_ELEMENTS: [".ytp-time-duration"],
  CHANNEL_NAME_FROM_VIDEO_PAGE_ELEMENTS: [
    "#above-the-fold",
    "#owner",
    "ytd-video-owner-renderer",
    "#upload-info",
    "#channel-name",
    "#text",
  ],
  CHANNEL_HANDLE_FROM_VIDEO_PAGE_ELEMENTS: [
    "#above-the-fold",
    "#owner",
    "ytd-video-owner-renderer",
    "a",
  ],
  CHANNEL_ID_FROM_VIDEO_PAGE_ELEMENTS_1: [
    "#above-the-fold",
    "#owner",
    "ytd-video-owner-renderer",
    "#upload-info",
    "#channel-name",
    "a",
  ],
  CHANNEL_ID_FROM_VIDEO_PAGE_ELEMENTS_2: [
    "#above-the-fold",
    "#bottom-row",
    "#description-inner",
    "#social-links",
    `a[href*="/videos"]`,
  ],
  CHANNEL_COLLABORATION_NAMES_FROM_VIDEO_PAGE_ELEMENTS: [
    "#above-the-fold",
    "#owner",
    "ytd-video-owner-renderer",
    "#upload-info",
    "a",
  ],
  CHANNEL_IMAGE_FROM_VIDEO_PAGE_ELEMENTS: [
    "#above-the-fold",
    "#owner",
    "ytd-video-owner-renderer",
    "#avatar",
    "img",
  ],
  SUBSCRIBE_BUTTON_FROM_VIDEO_PAGE_ELEMENTS: [
    "#above-the-fold",
    "#top-row",
    "#owner",
  ],
  SUBSCRIBE_BUTTON_FROM_CHANNEL_PAGE_ELEMENTS: [
    "#wrapper",
    "#contentContainer",
    "#page-header",
    "yt-flexible-actions-view-model",
  ],
  CHANNEL_HANDLE_FROM_CHANNEL_PAGE_ELEMENTS: [
    "#wrapper",
    "#contentContainer",
    "#page-header",
    "yt-content-metadata-view-model",
  ],
  CHANNEL_IMAGE_FROM_CHANNEL_PAGE_ELEMENTS: [
    "#wrapper",
    "#contentContainer",
    "#page-header",
    "yt-decorated-avatar-view-model",
    "img",
  ],
  SAVE_PLAYLIST_ELEMENTS: [
    "#page-manager",
    "ytd-browse[page-subtype='playlist']",
    "yt-page-header-renderer.page-header-sidebar",
    ".ytPageHeaderViewModelContent",
  ],
  PLAYLIST_CHANNEL_NAME_ELEMENTS: [
    "#page-manager",
    "ytd-browse[page-subtype='playlist']",
    "yt-page-header-renderer.page-header-sidebar",
    ".ytPageHeaderViewModelContent",
    "yt-avatar-stack-view-model",
    "a",
  ],
  PLAYLIST_COVER_IMAGE_ELEMENTS: [
    "#page-manager",
    "ytd-browse[page-subtype='playlist']",
    "#primary",
    "ytd-playlist-video-renderer",
    "a",
  ],
  PLAYLIST_VIDEOS_COUNT_ELEMENTS: [
    "#page-manager",
    "ytd-browse[page-subtype='playlist']",
    "yt-page-header-renderer.page-header-sidebar",
    ".ytPageHeaderViewModelContent",
    "yt-content-metadata-view-model",
  ],
  ADD_TO_LOCAL_PLAYLIST_BUTTON_ELEMENTS: [
    "#above-the-fold",
    "#top-row",
    "#actions",
    "ytd-menu-renderer",
  ],
};

export const CHANNEL_ID_ELEMENTS = [
  {
    selector: 'meta[itemprop="identifier"]',
    attribute: "content",
    extractId: false,
  },
  { selector: 'link[rel="canonical"]', attribute: "href", extractId: true },
  {
    selector: 'link[type="application/rss+xml"]',
    attribute: "href",
    extractId: true,
  },
  {
    selector: 'meta[property="og:url"]',
    attribute: "content",
    extractId: true,
  },
  { selector: 'link[itemprop="url"]', attribute: "href", extractId: true },
];

export const LTM_TOAST_ROOT_ID = "ltm-toast-root";

export const CUSTOM_LIKE_BUTTON_ID = "custom-ltm-like-button";
export const CUSTOM_LIKE_BUTTON_ICON_ID = "custom-ltm-like-button-icon";
export const CUSTOM_SUBSCRIBE_BUTTON_ID = "custom-ltm-subscribe-button";
export const CUSTOM_SUBSCRIBED_BUTTON_ID = "custom-ltm-subscribed-button";
export const CUSTOM_SAVE_PLAYLIST_BUTTON_ID = "custom-ltm-save-playlist-button";
export const CUSTOM_SAVE_PLAYLIST_BUTTON_ICON_ID =
  "custom-ltm-save-playlist-button-icon";
export const CUSTOM_SAVE_PLAYLIST_BUTTON_TEXT_ID =
  "custom-ltm-save-playlist-button-text";
export const CUSTOM_ADD_TO_LOCAL_PLAYLIST_BUTTON_ID =
  "custom-ltm-add-to-local-playlist-button";
export const CUSTOM_ADD_TO_LOCAL_PLAYLIST_MODAL_ID =
  "custom-ltm-add-to-local-playlist-modal";
export const ADD_TO_LOCAL_PLAYLIST_MODAL_UNMOUNT_EVENT =
  "custom-ltm-add-to-local-playlist-modal-unmount";

export const LIKE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" viewBox="0 0 24 24"><title xmlns="">thumbs-up</title><path fill="#ffffff" d="M20.22 9.55c-.43-.51-1.05-.8-1.72-.8h-4.03V6c0-1.52-1.23-2.75-2.83-2.75c-.7 0-1.33.42-1.61 1.07l-2.54 5.93H5.62c-1.31 0-2.37 1.06-2.37 2.37v5.77c0 1.3 1.07 2.36 2.37 2.36h11.56c1.09 0 2.02-.78 2.21-1.86l1.32-7.5c.11-.66-.07-1.33-.5-1.84Zm-14.6 9.7c-.48 0-.87-.39-.87-.86v-5.77c0-.48.39-.87.87-.87h1.61v7.5zm12.3-.62c-.06.36-.37.62-.74.62H8.74v-8.1l2.67-6.25c.04-.09.13-.16.32-.16c.69 0 1.24.56 1.24 1.25v4.25h5.53c.23 0 .43.09.57.26s.2.39.16.62l-1.32 7.5Z"/></svg>`;
export const LIKE_ICON_FILLED = `<svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" viewBox="0 0 24 24"><title xmlns="">thumbs-up-fill</title><path fill="currentColor" d="M7.24 11v9H5.63c-.9 0-1.62-.72-1.62-1.61v-5.77c0-.89.73-1.62 1.62-1.62zM18.5 9.5h-4.78V6c0-1.1-.9-2-1.99-2h-.09c-.4 0-.76.24-.92.61L7.99 11v9h9.2c.73 0 1.35-.52 1.48-1.24l1.32-7.5c.16-.92-.54-1.76-1.48-1.76Z"/></svg>`;
export const SAVE_PLAYLIST_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240zm80-122 200-86 200 86v-518H280zm0-518h400z"/></svg>`;
export const SAVE_PLAYLIST_ICON_FILLED = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240z"/></svg>`;
export const PLAYLIST_ICON = ListVideoIcon;
export const ADD_TO_LOCAL_PLAYLIST_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="24"><path fill="#fff" d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240zm80-122 200-86 200 86v-518H280zm0-518h400z"/></svg>`;

export const CHANNEL_URL_REGEX =
  /^https?:\/\/(www\.)?youtube\.com\/(?:(@[\w.-]+)|(channel\/UC[A-Za-z0-9_-]{22})|(c\/[\w.-]+)|(user\/[\w.-]+)|([\w.-]+))(\/.*)?$/;
export const CHANNEL_ID_REGEX = /UC[a-zA-Z0-9_-]{22}/;
export const CHANNEL_HANDLE_REGEX = /@\w+/;
export const CHANNEL_VIDEO_COUNT_REGEX = /^\d+ videos$/;

export const YOUTUBE_EMBED_REFERRER_RULE_ID = 1;

export const YOUTUBE_RSS_FEED_URL =
  "https://www.youtube.com/feeds/videos.xml?channel_id=";

export const TIME_INTERVALS: {
  name: Intl.RelativeTimeFormatUnit;
  seconds: number;
}[] = [
  { name: "year", seconds: 31536000 },
  { name: "month", seconds: 2592000 },
  { name: "week", seconds: 604800 },
  { name: "day", seconds: 86400 },
  { name: "hour", seconds: 3600 },
  { name: "minute", seconds: 60 },
  { name: "second", seconds: 1 },
];

export const DEFAULT_SETTINGS = {
  Extension: true,
  Notifications: false,
};
