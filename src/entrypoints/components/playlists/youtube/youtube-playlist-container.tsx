import type { YoutubePlaylist } from "@/entrypoints/utils/types";
import { useEffect, useMemo } from "react";
import { SearchBar } from "../../search-bar";
import { YoutubePlaylistCard } from "./youtube-playlist-card";
import { RENDER_BATCH_SIZE } from "@/entrypoints/utils/constants";
import { useProgressiveList } from "@/entrypoints/hooks/use-progressive-list";

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
          to save playlists
        </p>
      ) : (
        <div className="flex h-full min-h-0 flex-col">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={handleSearchQueryChange}
          />
          <div
            ref={listContainerRef}
            className="min-h-0 flex flex-1 flex-col overflow-y-auto"
            style={{ paddingBottom: "50px" }}
          >
            {filteredYoutubePlaylist.length === 0 ? (
              <p
                className="text-center text-neutral-400"
                style={{ fontWeight: 500, marginTop: "80px" }}
              >
                No YouTube playlists found
              </p>
            ) : (
              <div
                className="min-h-0 grid grid-cols-3 gap-10 overflow-y-auto"
                style={{ padding: "22px 22px 50px 22px" }}
              >
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
        </div>
      )}
    </>
  );
};
