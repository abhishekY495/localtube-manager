import { getThumbnailUrl } from "@/entrypoints/utils/get-thumbnail-url";
import type { LocalPlaylist } from "@/entrypoints/utils/types";
import defaultThumbnailUrl from "@/assets/default-thumbnail.jpg";
import { PLAYLIST_ICON } from "@/entrypoints/utils/constants";
import { RemoveLocalPlaylistModal } from "./remove-local-playlist-modal";

export const LocalPlaylistCard = ({
  playlist,
  onRefresh,
}: {
  playlist: LocalPlaylist;
  onRefresh: () => void;
}) => {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  let playlistThumbnail;

  const firstVideo = playlist.videos[0];
  if (firstVideo) {
    playlistThumbnail = getThumbnailUrl(firstVideo.urlSlug, firstVideo.isShort);
  } else {
    playlistThumbnail = defaultThumbnailUrl;
  }

  const openPlaylist = () => {
    window.location.href = `/dashboard.html#local-playlists?name=${encodeURIComponent(playlist.name)}`;
  };

  return (
    <>
      <div className="flex flex-col bg-neutral-800 rounded">
        <div className="relative cursor-pointer" onClick={openPlaylist}>
          <img
            src={playlistThumbnail}
            alt={playlist.name}
            className="rounded-t w-full"
          />
          <div className="absolute bottom-0 right-0 bg-black/60 flex items-center gap-1 p-0.5 px-1.5 rounded-tl">
            <PLAYLIST_ICON size={12} />
            <span className="font-medium text-xs">
              {playlist.videos.length}
            </span>
          </div>
        </div>
        {/*  */}
        <div className="flex flex-col gap-2.5 p-2 pt-1 px-2.5 pb-3">
          <div className="flex flex-col w-full">
            <p title={playlist.name} className="text-lg font-medium truncate">
              {playlist.name}
            </p>
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
        <RemoveLocalPlaylistModal
          setIsRemoveModalOpen={setIsRemoveModalOpen}
          playlistName={playlist.name}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};
