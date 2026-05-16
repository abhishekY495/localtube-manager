import { getThumbnailUrl } from "@/entrypoints/utils/get-thumbnail-url";
import type { Video } from "@/entrypoints/utils/types";
import { RemoveLikedVideoModal } from "./remove-liked-video-modal";

export const VideoCard = ({
  video,
  onRefresh,
}: {
  video: Video;
  onRefresh: () => void;
}) => {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const videoUrl = `https://www.youtube.com/watch?v=${video.urlSlug}`;
  const videoThumbnail = getThumbnailUrl(video.urlSlug, video.isShort);

  return (
    <>
      <div className="flex gap-4 border-b border-neutral-700 hover:bg-neutral-900 p-5">
        {/*  */}
        <a href={videoUrl} className="relative">
          <img
            src={videoThumbnail}
            alt={video.title}
            className="rounded w-full object-cover"
          />
          <span className="absolute bottom-0 right-0 bg-black/60 text-xs font-medium p-0.5 px-1.5 rounded-tl">
            {video.duration}
          </span>
        </a>
        {/*  */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-1">
            <a href={videoUrl} className="text-lg font-medium">
              {video.title}
            </a>
            {video.channelName && (
              <p className="text-neutral-400 text-sm">{video.channelName}</p>
            )}
          </div>
          {/*  */}
          <button
            type="button"
            onClick={() => setIsRemoveModalOpen(true)}
            className="w-fit bg-neutral-800 text-neutral-200 border rounded border-neutral-700 cursor-pointer hover:bg-neutral-900 text-base font-medium p-1 px-4"
          >
            Remove
          </button>
        </div>
      </div>
      {isRemoveModalOpen && (
        <RemoveLikedVideoModal
          setIsRemoveModalOpen={setIsRemoveModalOpen}
          videoId={video.urlSlug}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};
