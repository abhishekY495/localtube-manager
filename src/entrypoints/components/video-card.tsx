import type { Video } from "../utils/types";

export const VideoCard = ({
  video,
  index,
}: {
  video: Video;
  index: number;
}) => {
  const videoUrl = `https://www.youtube.com/watch?v=${video.urlSlug}`;
  return (
    <a
      href={videoUrl}
      className="flex gap-4 border-b border-b-neutral-700 hover:bg-neutral-800"
      style={{
        paddingBlock: "20px",
        paddingInline: "8px",
      }}
    >
      <div
        className="flex items-center text-neutral-500"
        style={{ fontSize: "14px", fontWeight: 500 }}
      >
        <p>{index + 1}</p>
      </div>
      {/*  */}
      <div className="relative">
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
          className="absolute bottom-0 right-0 bg-neutral-700/70"
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
      </div>
      {/*  */}
      <div className="flex-1">
        <p
          style={{
            color: "#fff",
            fontSize: "18px",
            fontWeight: 500,
            lineHeight: "22px",
          }}
        >
          {video.title}
        </p>
        {video.channelHandle && (
          <div className="-space-y-1 mt-2">
            <p className="text-neutral-400" style={{ fontSize: "14px" }}>
              {video.channelName}
            </p>
            <p className="text-neutral-400" style={{ fontSize: "12px" }}>
              @{video.channelHandle}
            </p>
          </div>
        )}
      </div>
    </a>
  );
};
