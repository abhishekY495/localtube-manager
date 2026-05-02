import { useState } from "react";
import { ACTIONS } from "@/entrypoints/utils/constants";
import type {
  LocalPlaylist,
  Message,
  Response,
} from "@/entrypoints/utils/types";
import { getVideoData } from "@/entrypoints/utils/video/get-video-data";
import checkIcon from "@/assets/check-icon.svg?raw";
import toast from "react-hot-toast";

const checkIconImage = `url("data:image/svg+xml,${encodeURIComponent(checkIcon)}")`;

export const LocalPlaylistCheckbox = ({
  playlist,
  videoId,
}: {
  playlist: LocalPlaylist;
  videoId: string;
}) => {
  const [videos, setVideos] = useState(playlist.videos);
  const isVideoInPlaylist = videos.some((video) => video.urlSlug === videoId);

  const toggleVideoInPlaylist = async () => {
    try {
      if (isVideoInPlaylist) {
        const response: Response = await browser.runtime.sendMessage({
          action: ACTIONS.REMOVE_VIDEO_FROM_LOCAL_PLAYLIST,
          data: { playlistName: playlist.name, videoId },
        } satisfies Message);

        if (response.success) {
          setVideos((currentVideos) =>
            currentVideos.filter((video) => video.urlSlug !== videoId),
          );
        } else {
          toast.error("Something went wrong,\n Refresh and try again");
        }
        return;
      } else {
        const video = await getVideoData(videoId, document);
        const response: Response = await browser.runtime.sendMessage({
          action: ACTIONS.ADD_VIDEO_TO_LOCAL_PLAYLIST,
          data: { playlistName: playlist.name, video },
        } satisfies Message);

        if (response.success) {
          setVideos((currentVideos) => [...currentVideos, video]);
        } else {
          toast.error("Something went wrong,\n Refresh and try again");
        }
      }
    } catch (error) {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  };

  return (
    <div
      key={playlist.name}
      className="flex w-full cursor-pointer items-center justify-between gap-4 text-[#ffffff] hover:bg-neutral-800 border-b border-neutral-800"
      style={{
        padding: "7px 10px 8px 10px",
      }}
    >
      <label className="flex flex-1 items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isVideoInPlaylist}
          onChange={toggleVideoInPlaylist}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            backgroundColor: isVideoInPlaylist ? "#ffffff" : "#404040",
            backgroundImage: isVideoInPlaylist ? checkIconImage : "none",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "12px 12px",
            border: isVideoInPlaylist
              ? "1px solid #ffffff"
              : "1px solid #737373",
            borderRadius: "2px",
            height: "14px",
            width: "14px",
          }}
        />
        <span
          style={{
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          {playlist.name}
        </span>
      </label>
      <span
        className="text-neutral-400"
        style={{
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        {videos.length} video
        {videos.length === 1 ? "" : "s"}
      </span>
    </div>
  );
};
