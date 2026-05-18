import { useState } from "react";
import type { YoutubePlaylist } from "@/entrypoints/utils/types";
import { getThumbnailUrl } from "@/entrypoints/utils/get-thumbnail-url";
import defaultThumbnailUrl from "@/assets/default-thumbnail.jpg";
import { PLAYLIST_ICON } from "@/entrypoints/utils/constants";
import { RemoveYoutubePlaylistModal } from "./remove-youtube-playlist-modal";

export const YoutubePlaylistCard = ({
  playlist,
  onRefresh,
}: {
  playlist: YoutubePlaylist;
  onRefresh: () => void;
}) => {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const playlistUrl = `https://www.youtube.com/playlist?list=${playlist.urlSlug}`;
  const playlistThumbnail = playlist.coverImageUrlSlug
    ? getThumbnailUrl(playlist.coverImageUrlSlug, false)
    : defaultThumbnailUrl;
  return (
    <>
      <div className="flex flex-col bg-neutral-800 rounded">
        <div className="relative">
          <a href={playlistUrl}>
            <img
              src={playlistThumbnail}
              alt={playlist.name}
              className="rounded-t w-full"
            />
          </a>
          <div className="absolute bottom-0 right-0 bg-black/60 flex items-center gap-1 p-0.5 px-1.5 rounded-tl">
            <PLAYLIST_ICON size={12} />
            <span className="font-medium text-xs">{playlist.videosCount}</span>
          </div>
        </div>
        {/*  */}
        <div className="flex flex-col gap-2.5 p-2 pt-1.5 px-2.5 pb-3">
          <div className="flex flex-col">
            <p
              title={playlist.name}
              className="text-neutral-200 truncate text-base font-medium"
            >
              {playlist.name}
            </p>
            {playlist.channelName && (
              <p
                title={playlist.channelName}
                className="text-neutral-400 text-xs font-medium truncate"
              >
                by {playlist.channelName}
              </p>
            )}
          </div>
          <button
            type="button"
            className="bg-neutral-700 text-neutral-300 border rounded border-neutral-600 hover:bg-neutral-600 cursor-pointer text-sm font-medium p-1 pb-1.5"
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
