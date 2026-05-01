import type { LocalPlaylist } from "@/entrypoints/utils/types";

export const LocalPlaylistCard = ({
  playlist,
  onRefresh,
}: {
  playlist: LocalPlaylist;
  onRefresh: () => void;
}) => {
  return (
    <div>
      <h3>{playlist.name}</h3>
    </div>
  );
};
