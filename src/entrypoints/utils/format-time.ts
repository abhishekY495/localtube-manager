import { TIME_INTERVALS } from "./constants";

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const time of TIME_INTERVALS) {
    const interval = Math.floor(diffInSeconds / time.seconds);
    if (interval >= 1) {
      return rtf.format(-interval, time.name);
    }
  }

  return "just now";
};
