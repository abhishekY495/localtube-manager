import {
  ListVideoIcon,
  MegaphoneIcon,
  SettingsIcon,
  ThumbsUpIcon,
  TvMinimalPlayIcon,
} from "lucide-react";

export const ACTIONS = {
  TOGGLE_SIDEBAR: "toggle_sidebar",
};

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
