import type { LocalPlaylist } from "@/entrypoints/utils/types";
import { useEffect, useMemo } from "react";
import { SearchBar } from "../../search-bar";
import { LocalPlaylistCard } from "./local-playlist-card";
import { RENDER_BATCH_SIZE } from "@/entrypoints/utils/constants";
import { useProgressiveList } from "@/entrypoints/hooks/use-progressive-list";

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
  const filteredLocalPlaylist = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    if (!normalizedSearchQuery) {
      return localPlaylist;
    }

    return localPlaylist.filter((playlist) => {
      return playlist.name.toLowerCase().includes(normalizedSearchQuery);
    });
  }, [localPlaylist, searchQuery]);

  const {
    visibleItems: visibleLocalPlaylist,
    hasMoreItems: hasMoreLocalPlaylist,
    hiddenItemsCount: hiddenLocalPlaylistCount,
    listContainerRef,
    loadMoreTriggerRef,
    resetVisibleItems,
  } = useProgressiveList(filteredLocalPlaylist);

  useEffect(() => {
    resetVisibleItems();
  }, [localPlaylist, resetVisibleItems]);

  const handleSearchQueryChange = (value: string) => {
    resetVisibleItems();
    setSearchQuery(value);
  };

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
            setSearchQuery={handleSearchQueryChange}
          />
          <div
            ref={listContainerRef}
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
              <div
                className="min-h-0 grid grid-cols-3 gap-10 overflow-y-auto"
                style={{ padding: "22px 22px 50px 22px" }}
              >
                {visibleLocalPlaylist.map((playlist) => (
                  <LocalPlaylistCard
                    key={playlist.name}
                    playlist={playlist}
                    onRefresh={onRefresh}
                  />
                ))}
                {hasMoreLocalPlaylist && (
                  <div
                    ref={loadMoreTriggerRef}
                    className="col-span-full py-4 text-center text-sm text-neutral-400"
                  >
                    Scroll to load{" "}
                    {Math.min(RENDER_BATCH_SIZE, hiddenLocalPlaylistCount)} more
                    playlists
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
