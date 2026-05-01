import { LocalPlaylist } from "@/entrypoints/utils/types";

export const PlaylistCheckboxContainer = ({
  playlists,
  videoId,
}: {
  playlists: LocalPlaylist[];
  videoId: string;
}) => {
  return (
    <div
      className="overflow-y-auto"
      style={{
        minHeight: "300px",
        padding: "8px",
      }}
    >
      {playlists.length === 0 ? (
        <p
          className="text-center text-neutral-300"
          style={{ fontSize: "14px", marginTop: "50px" }}
        >
          No Local playlists found
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {playlists.map((playlist) => {
            const isVideoInPlaylist = playlist.videos.some(
              (video) => video.urlSlug === videoId,
            );

            return (
              <div
                key={playlist.name}
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg border-0 bg-transparent p-3 text-left text-[#f1f1f1] hover:bg-zinc-800"
                
              >
                <label className="flex min-w-0 items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isVideoInPlaylist}
                    readOnly
                    className="h-4 w-4 cursor-pointer accent-[#f1f1f1]"
                  />
                  <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                    {playlist.name}
                  </span>
                </label>
                <span className="text-[13px] text-zinc-400">
                  {playlist.videos.length} video
                  {playlist.videos.length === 1 ? "" : "s"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
