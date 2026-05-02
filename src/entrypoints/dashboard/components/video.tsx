import type { Video } from "@/entrypoints/utils/types";

export const VideoDetails = ({
  video,
  isCurrentVideo,
  setCurrentVideo,
}: {
  video: Video;
  isCurrentVideo: boolean;
  setCurrentVideo: (video: Video) => void;
}) => {
  const videoThumbnail = `https://i.ytimg.com/vi/${video.urlSlug}/mqdefault.jpg`;

  return (
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
          <p className="truncate w-[280px] text-sm font-semibold text-neutral-200">
            {video.title}
          </p>
          {video.channelName && (
            <p className="text-neutral-400 text-xs font-medium">
              {video.channelName}
            </p>
          )}
        </div>
        {/*  */}
        <button className="w-fit text-[10px] p-0.5 px-2 font-semibold bg-neutral-800 text-neutral-200 border rounded border-neutral-700 cursor-pointer">
          Remove
        </button>
      </div>
    </div>
  );
};
