import { useEffect, useMemo } from "react";
import type { LocalPlaylist } from "@/entrypoints/utils/types";
import { SearchBar } from "@/entrypoints/components/search-bar";
import { useProgressiveList } from "@/entrypoints/hooks/use-progressive-list";
import { RENDER_BATCH_SIZE } from "@/entrypoints/utils/constants";
import { LocalPlaylistCard } from "./local-playlist-card";

export const LocalPlaylistContainer = ({
  localPlaylist,
  searchQuery,
  setSearchQuery,
  setPlaylistName,
  onRefresh,
}: {
  localPlaylist: LocalPlaylist[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setPlaylistName: (name: string | null) => void;
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
        <p className="text-center mt-16 text-2xl font-semibold">
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
            className="sticky top-[186px] bg-neutral-950 z-10"
          />
          <div ref={listContainerRef} className="flex flex-col py-5">
            {filteredLocalPlaylist.length === 0 ? (
              <p className="text-center text-neutral-400 mt-16 text-lg">
                No local playlists found
              </p>
            ) : (
              <div className="grid grid-cols-5 gap-6">
                {visibleLocalPlaylist.map((playlist) => (
                  <LocalPlaylistCard
                    key={playlist.name}
                    playlist={playlist}
                    onRefresh={onRefresh}
                    setPlaylistName={setPlaylistName}
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
