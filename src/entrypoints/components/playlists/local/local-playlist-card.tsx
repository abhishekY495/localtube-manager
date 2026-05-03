import { ACTIONS, PLAYLIST_ICON } from "@/entrypoints/utils/constants";
import type { LocalPlaylist, Message } from "@/entrypoints/utils/types";
import defaultThumbnailUrl from "@/assets/default-thumbnail.jpg";
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
    playlistThumbnail = `https://i.ytimg.com/vi/${firstVideo.urlSlug}/mqdefault.jpg`;
  } else {
    playlistThumbnail = defaultThumbnailUrl;
  }

  const openPlaylist = () => {
    const dashboardUrl = browser.runtime.getURL("/dashboard.html");
    if (window.location.href.startsWith(dashboardUrl)) {
      window.location.href = `${dashboardUrl}#local-playlists?name=${encodeURIComponent(playlist.name)}`;
      return;
    }

    browser.runtime.sendMessage({
      action: ACTIONS.OPEN_LOCAL_PLAYLIST,
      data: { playlistName: playlist.name },
    } satisfies Message);
  };

  return (
    <>
      <div className="flex flex-col gap-3 bg-neutral-800 rounded-lg">
        <div className="relative cursor-pointer" onClick={openPlaylist}>
          <img
            src={playlistThumbnail}
            alt={playlist.name}
            className="rounded-t-lg"
            style={{ width: "100%" }}
          />
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
              {playlist.videos.length}
            </span>
          </div>
        </div>
        {/*  */}
        <div
          className="flex flex-col gap-3"
          style={{
            padding: "0px 12px 12px 12px",
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
        <RemoveLocalPlaylistModal
          setIsRemoveModalOpen={setIsRemoveModalOpen}
          playlistName={playlist.name}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};
