import { PLAYLIST_ICON } from "@/entrypoints/utils/constants";
import type { YoutubePlaylist } from "@/entrypoints/utils/types";
import { RemoveYoutubePlaylistModal } from "./remove-youtube-playlist-modal";
import { useState } from "react";

export const YoutubePlaylistCard = ({
  playlist,
  onRefresh,
}: {
  playlist: YoutubePlaylist;
  onRefresh: () => void;
}) => {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const playlistUrl = `https://www.youtube.com/playlist?list=${playlist.urlSlug}`;
  const playlistThumbnail = `https://i.ytimg.com/vi/${playlist.coverImageUrlSlug}/mqdefault.jpg`;

  return (
    <>
      <div className="flex flex-col gap-3 bg-neutral-800 rounded-lg">
        <div className="relative">
          <a href={playlistUrl}>
            <img
              src={playlistThumbnail}
              alt={playlist.name}
              className="rounded-t-lg"
            />
          </a>
          <div
            className="absolute bottom-0 right-0 bg-black/60 flex items-center gap-1"
            style={{
              padding: "2px",
              paddingInline: "7px",
              borderTopLeftRadius: "5px",
            }}
          >
            <PLAYLIST_ICON size={14} />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {playlist.videosCount}
            </span>
          </div>
        </div>
        <div
          className="flex flex-col gap-3"
          style={{
            padding: "0px 10px 10px 10px",
          }}
        >
          <div
            className="flex flex-col"
            style={{
              width: "218px",
              display: "inline-block",
              fontWeight: 500,
            }}
          >
            <p
              title={playlist.name}
              style={{
                fontSize: "16px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {playlist.name}
            </p>
            {playlist.channelName && (
              <p
                title={playlist.channelName}
                className="text-neutral-400"
                style={{
                  marginTop: "-2px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                by {playlist.channelName}
              </p>
            )}
          </div>
          <button
            type="button"
            className="bg-neutral-700 text-neutral-300 border rounded-lg border-neutral-600 hover:bg-neutral-600 cursor-pointer "
            style={{
              fontSize: "14px",
              fontWeight: 600,
              padding: "4px 12px",
            }}
            onClick={() => setIsRemoveModalOpen(true)}
          >
            Remove
          </button>
        </div>
      </div>
      {isRemoveModalOpen && (
        <RemoveYoutubePlaylistModal
          setIsRemoveModalOpen={setIsRemoveModalOpen}
          playlistId={playlist.urlSlug}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};
