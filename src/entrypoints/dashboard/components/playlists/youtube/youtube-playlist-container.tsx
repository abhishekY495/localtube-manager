import { useEffect, useMemo } from "react";
import type { YoutubePlaylist } from "@/entrypoints/utils/types";
import { SearchBar } from "@/entrypoints/components/search-bar";
import { useProgressiveList } from "@/entrypoints/hooks/use-progressive-list";
import { RENDER_BATCH_SIZE } from "@/entrypoints/utils/constants";
import { YoutubePlaylistCard } from "./youtube-playlist-card";

export const YoutubePlaylistContainer = ({
  youtubePlaylist,
  searchQuery,
  setSearchQuery,
  onRefresh,
}: {
  youtubePlaylist: YoutubePlaylist[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
}) => {
  const filteredYoutubePlaylist = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    if (!normalizedSearchQuery) {
      return youtubePlaylist;
    }

    return youtubePlaylist.filter((playlist) => {
      return (
        playlist.name.toLowerCase().includes(normalizedSearchQuery) ||
        playlist?.channelName?.toLowerCase().includes(normalizedSearchQuery)
      );
    });
  }, [youtubePlaylist, searchQuery]);

  const {
    visibleItems: visibleYoutubePlaylist,
    hasMoreItems: hasMoreYoutubePlaylist,
    hiddenItemsCount: hiddenYoutubePlaylistCount,
    listContainerRef,
    loadMoreTriggerRef,
    resetVisibleItems,
  } = useProgressiveList(filteredYoutubePlaylist);

  useEffect(() => {
    resetVisibleItems();
  }, [youtubePlaylist, resetVisibleItems]);

  const handleSearchQueryChange = (value: string) => {
    resetVisibleItems();
    setSearchQuery(value);
  };

  return (
    <>
      {youtubePlaylist.length === 0 ? (
        <p className="text-center mt-16 text-2xl font-semibold">
          Visit{" "}
          <a
            href="https://www.youtube.com"
            className="text-[#FF0733] underline underline-offset-4 cursor-pointer"
          >
            YouTube
          </a>{" "}
          to save playlists
        </p>
      ) : (
        <>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={handleSearchQueryChange}
            className="sticky top-[186px] bg-neutral-950 z-10"
          />
          <div
            ref={listContainerRef}
            className="min-h-0 flex flex-1 flex-col overflow-y-auto pb-14"
          >
            {filteredYoutubePlaylist.length === 0 ? (
              <p className="text-center text-neutral-400 mt-16 text-lg">
                No YouTube playlists found
              </p>
            ) : (
              <div className="min-h-0 grid grid-cols-5 gap-6 py-5 overflow-y-auto">
                {visibleYoutubePlaylist.map((playlist) => (
                  <YoutubePlaylistCard
                    key={playlist.name}
                    playlist={playlist}
                    onRefresh={onRefresh}
                  />
                ))}
                {hasMoreYoutubePlaylist && (
                  <div
                    ref={loadMoreTriggerRef}
                    className="col-span-full py-4 text-center text-sm text-neutral-400"
                  >
                    Scroll to load{" "}
                    {Math.min(RENDER_BATCH_SIZE, hiddenYoutubePlaylistCount)}{" "}
                    more playlists
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
