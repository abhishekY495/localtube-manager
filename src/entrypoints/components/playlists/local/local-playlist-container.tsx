import { LocalPlaylist } from "@/entrypoints/utils/types";
import { SearchBar } from "../../search-bar";
import { LocalPlaylistCard } from "./local-playlist-card";

export const LocalPlaylistContainer = ({
  localPlaylist,
  searchQuery,
  setSearchQuery,
  onRefresh,
}: {
  localPlaylist: LocalPlaylist[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
}) => {
  const filteredLocalPlaylist = localPlaylist.filter((playlist) => {
    return playlist.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
  });

  return (
    <>
      {localPlaylist.length === 0 ? (
        <p
          className="text-center"
          style={{
            marginTop: "80px",
            fontSize: "22px",
            fontWeight: "500",
          }}
        >
          Visit{" "}
          <a
            href="https://www.youtube.com"
            className="text-[#FF0733] underline underline-offset-4 cursor-pointer"
          >
            YouTube
          </a>{" "}
          to create playlists
        </p>
      ) : (
        <>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <div
            className="min-h-0 flex flex-1 flex-col overflow-y-auto"
            style={{ paddingBottom: "50px" }}
          >
            {filteredLocalPlaylist.length === 0 ? (
              <p
                className="text-center text-neutral-400"
                style={{ fontWeight: 500, marginTop: "80px" }}
              >
                No local playlists found
              </p>
            ) : (
              filteredLocalPlaylist.map((playlist) => (
                <LocalPlaylistCard
                  key={playlist.name}
                  playlist={playlist}
                  onRefresh={onRefresh}
                />
              ))
            )}
          </div>
        </>
      )}
    </>
  );
};
