import { ACTIONS, RENDER_BATCH_SIZE } from "../../utils/constants";
import type { Message, Response, Video } from "../../utils/types";
import { useState, useEffect, useMemo } from "react";
import { Loading } from "../loading";
import { Error } from "../error";
import { VideoCard } from "./video-card";
import { SearchBar } from "../search-bar";
import { useProgressiveList } from "../../hooks/use-progressive-list";

export const LikedVideosContainer = ({
  isSidebarOpen,
  refreshKey,
  onRefresh,
}: {
  isSidebarOpen: boolean;
  refreshKey: number;
  onRefresh: () => void;
}) => {
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const filteredLikedVideos = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    if (!normalizedSearchQuery) {
      return likedVideos;
    }

    return likedVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(normalizedSearchQuery) ||
        video.channelName?.toLowerCase().includes(normalizedSearchQuery) ||
        video.channelHandle?.toLowerCase().includes(normalizedSearchQuery),
    );
  }, [likedVideos, searchQuery]);

  const {
    visibleItems: visibleLikedVideos,
    hasMoreItems: hasMoreLikedVideos,
    hiddenItemsCount: totalHiddenLikedVideos,
    listContainerRef,
    loadMoreTriggerRef,
    resetVisibleItems,
  } = useProgressiveList(filteredLikedVideos);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const fetchLikedVideos = async () => {
      setIsLoading(true);
      setError(false);
      const response: Response<Video[]> = await browser.runtime.sendMessage({
        action: ACTIONS.GET_ALL_LIKED_VIDEOS,
      } satisfies Message);
      if (!response.success) {
        setError(true);
        setIsLoading(false);
        return;
      }
      const sortedLikedVideos = response.data.sort((a, b) => {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      });
      resetVisibleItems();
      setLikedVideos(sortedLikedVideos);
      setIsLoading(false);
    };
    fetchLikedVideos();
  }, [isSidebarOpen, refreshKey, resetVisibleItems]);

  const handleSearchQueryChange = (value: string) => {
    resetVisibleItems();
    setSearchQuery(value);
  };

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {likedVideos.length === 0 ? (
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
          to like videos
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
            {filteredLikedVideos.length === 0 ? (
              <p
                className="mt-16 text-center text-neutral-400"
                style={{ fontWeight: 500 }}
              >
                No liked videos found
              </p>
            ) : (
              <>
                {visibleLikedVideos.map((video) => (
                  <VideoCard
                    key={video.urlSlug}
                    video={video}
                    onRefresh={onRefresh}
                  />
                ))}
                {hasMoreLikedVideos && (
                  <div
                    ref={loadMoreTriggerRef}
                    className="py-4 text-center text-sm text-neutral-400"
                  >
                    Scroll to load{" "}
                    {Math.min(RENDER_BATCH_SIZE, totalHiddenLikedVideos)}{" "}
                    more liked videos
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
