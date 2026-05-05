import { useState } from "react";
import type { Video } from "../../utils/types";
import { RemoveLikedVideoModal } from "./remove-liked-video-modal";
import { getThumbnailUrl } from "@/entrypoints/utils/get-thumbnail-url";

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
      <div
        className="flex gap-4 border-b border-neutral-700 hover:bg-neutral-800"
        style={{
          padding: "22px",
        }}
      >
        {/*  */}
        <a href={videoUrl} className="relative">
          <img
            src={videoThumbnail}
            alt={video.title}
            className="rounded-2xl"
            style={{
              width: "230px",
              height: "100%",
            }}
          />
          <span
            className="absolute bottom-0 right-0 bg-black/60"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              padding: "2px",
              paddingInline: "7px",
              borderTopLeftRadius: "5px",
            }}
          >
            {video.duration}
          </span>
        </a>
        {/*  */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <a
              href={videoUrl}
              style={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "22px",
              }}
            >
              {video.title}
            </a>
            {video.channelName && (
              <p className="text-neutral-400" style={{ fontSize: "13px" }}>
                {video.channelName}
              </p>
            )}
          </div>
          {/*  */}
          <button
            type="button"
            onClick={() => setIsRemoveModalOpen(true)}
            className="bg-neutral-800 text-neutral-200 border rounded-lg border-neutral-700 cursor-pointer hover:bg-neutral-700"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              width: "fit-content",
              padding: "4px 12px",
            }}
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
