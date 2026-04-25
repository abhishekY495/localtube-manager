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
