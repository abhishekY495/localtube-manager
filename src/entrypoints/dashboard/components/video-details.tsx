import { useState } from "react";
import type { Video } from "@/entrypoints/utils/types";
import { RemoveLocalPlaylistVideoModal } from "./remove-local-playlist-video-modal";
import { getThumbnailUrl } from "@/entrypoints/utils/get-thumbnail-url";

export const VideoDetails = ({
  playlistName,
  video,
  isCurrentVideo,
  setCurrentVideo,
  onVideoRemoved,
}: {
  playlistName: string;
  video: Video;
  isCurrentVideo: boolean;
  setCurrentVideo: React.Dispatch<React.SetStateAction<Video | null>>;
  onVideoRemoved: (videoId: string) => void;
}) => {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const videoThumbnail = getThumbnailUrl(video.urlSlug, video.isShort);

  return (
    <>
      <div
        className={`flex gap-2 p-2 border-b border-neutral-800 cursor-pointer ${isCurrentVideo ? "bg-neutral-800" : ""}`}
        onClick={() => {
          setCurrentVideo(video);
        }}
      >
        {/*  */}
        <div className="relative">
          <img src={videoThumbnail} alt={video.title} className="rounded" />
          <span className="text-[10px] absolute bottom-0 right-0 bg-black/60 p-0.5 px-1 rounded-tl font-semibold text-neutral-300">
            {video.duration}
          </span>
        </div>
        {/*  */}
        <div className="flex flex-col justify-between">
          <div className="space-y-0.5">
            <p
              className="truncate w-[280px] text-sm font-semibold text-neutral-200"
              title={video.title}
            >
              {video.title}
            </p>
            {video.channelName && (
              <p className="truncate w-[280px] text-xs font-medium text-neutral-400 ">
                {video.channelName}
              </p>
            )}
          </div>
          {/*  */}
          <button
            onClick={() => setIsRemoveModalOpen(true)}
            className="w-fit text-[10px] p-0.5 px-2 font-semibold bg-neutral-800 text-neutral-200 border rounded border-neutral-700 cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
      {isRemoveModalOpen && (
        <RemoveLocalPlaylistVideoModal
          setIsRemoveModalOpen={setIsRemoveModalOpen}
          playlistName={playlistName}
          videoId={video.urlSlug}
          onVideoRemoved={onVideoRemoved}
        />
      )}
    </>
  );
};
