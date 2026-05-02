import type { LocalPlaylist } from "@/entrypoints/utils/types";

export const Playlist = ({
  playlist,
  videoId,
}: {
  playlist: LocalPlaylist;
  videoId: string;
}) => {
  const isVideoInPlaylist = playlist.videos.some(
    (video) => video.urlSlug === videoId,
  );

  return (
    <div
      key={playlist.name}
      className="flex w-full cursor-pointer items-center justify-between gap-4 text-[#ffffff] hover:bg-neutral-800 border-b border-neutral-800"
      style={{
        padding: "7px 10px 8px 10px",
      }}
    >
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isVideoInPlaylist}
          readOnly
          className="cursor-pointer"
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            backgroundColor: isVideoInPlaylist ? "#ffffff" : "#404040",
            backgroundImage: isVideoInPlaylist
              ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M3.5 8.5L6.5 11.5L12.5 4.5' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`
              : "none",
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
        {playlist.videos.length} video
        {playlist.videos.length === 1 ? "" : "s"}
      </span>
    </div>
  );
};
