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
  CHECK_IF_VIDEO_IS_LIKED: "check_if_video_is_liked",
  GET_ALL_LIKED_VIDEOS: "get_all_liked_videos",
  ADD_LIKED_VIDEO: "add_liked_video",
  DELETE_LIKED_VIDEO_BY_ID: "delete_liked_video_by_id",
} as const;

export const NAV_ITEMS = [
  {
    label: "Subscriptions",
    icon: MegaphoneIcon,
  },
  {
    label: "Liked videos",
    icon: ThumbsUpIcon,
  },
  {
    label: "Channels",
    icon: TvMinimalPlayIcon,
  },
  {
    label: "Playlists",
    icon: ListVideoIcon,
  },
  {
    label: "Settings",
    icon: SettingsIcon,
  },
];

export const SELECTORS = {
  LIKE_BTN_ELEMENTS: [
    "#above-the-fold",
    "#top-row",
    "#actions",
    "ytd-menu-renderer",
    "#top-level-buttons-computed",
  ],
  LIKE_COUNT_ELEMENTS: [`[aria-label*="likes"]`, "span"],
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
  VIDEO_DURATION_ELEMENTS: [".ytp-time-duration"],
};

export const LTM_TOAST_ROOT_ID = "ltm-toast-root";

export const CUSTOM_LIKE_BUTTON_ID = "custom-ltm-like-btn";
export const CUSTOM_LIKE_BUTTON_ICON_ID = "custom-ltm-like-btn-icon";

export const likeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" viewBox="0 0 24 24"><title xmlns="">thumbs-up</title><path fill="#ffffff" d="M20.22 9.55c-.43-.51-1.05-.8-1.72-.8h-4.03V6c0-1.52-1.23-2.75-2.83-2.75c-.7 0-1.33.42-1.61 1.07l-2.54 5.93H5.62c-1.31 0-2.37 1.06-2.37 2.37v5.77c0 1.3 1.07 2.36 2.37 2.36h11.56c1.09 0 2.02-.78 2.21-1.86l1.32-7.5c.11-.66-.07-1.33-.5-1.84Zm-14.6 9.7c-.48 0-.87-.39-.87-.86v-5.77c0-.48.39-.87.87-.87h1.61v7.5zm12.3-.62c-.06.36-.37.62-.74.62H8.74v-8.1l2.67-6.25c.04-.09.13-.16.32-.16c.69 0 1.24.56 1.24 1.25v4.25h5.53c.23 0 .43.09.57.26s.2.39.16.62l-1.32 7.5Z"/></svg>`;
export const likeIconFilled = `<svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" viewBox="0 0 24 24"><title xmlns="">thumbs-up-fill</title><path fill="currentColor" d="M7.24 11v9H5.63c-.9 0-1.62-.72-1.62-1.61v-5.77c0-.89.73-1.62 1.62-1.62zM18.5 9.5h-4.78V6c0-1.1-.9-2-1.99-2h-.09c-.4 0-.76.24-.92.61L7.99 11v9h9.2c.73 0 1.35-.52 1.48-1.24l1.32-7.5c.16-.92-.54-1.76-1.48-1.76Z"/></svg>`;
