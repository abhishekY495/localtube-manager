import { useState } from "react";
import type { Video } from "../../utils/types";
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
            src={`https://i.ytimg.com/vi/${video.urlSlug}/mqdefault.jpg`}
            alt={video.title}
            style={{
              width: "230px",
              height: "100%",
              borderRadius: "4px",
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
          <div>
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
            <div className="-space-y-1 mt-2">
              {video.channelName && (
                <p className="text-neutral-400" style={{ fontSize: "13px" }}>
                  {video.channelName}
                </p>
              )}
              {video.channelHandle && (
                <p className="text-neutral-400" style={{ fontSize: "12px" }}>
                  @{video.channelHandle}
                </p>
              )}
            </div>
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
