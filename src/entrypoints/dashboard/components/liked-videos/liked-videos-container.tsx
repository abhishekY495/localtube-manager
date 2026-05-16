import { useState, useMemo, useEffect } from "react";
import { Error } from "@/entrypoints/components/error";
import { Loading } from "@/entrypoints/components/loading";
import { SearchBar } from "@/entrypoints/components/search-bar";
import { useProgressiveList } from "@/entrypoints/hooks/use-progressive-list";
import { getAllLikedVideos } from "@/entrypoints/indexed-db/liked-videos";
import { RENDER_BATCH_SIZE } from "@/entrypoints/utils/constants";
import type { Video } from "@/entrypoints/utils/types";
import { VideoCard } from "./video-card";

export const LikedVideosContainer = ({
  refreshKey,
  onRefresh,
}: {
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
    const fetchLikedVideos = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const likedVideos = await getAllLikedVideos();
        if (!likedVideos) {
          setError(true);
          setIsLoading(false);
          return;
        }
        const sortedLikedVideos = likedVideos.sort((a, b) => {
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        });
        resetVisibleItems();
        setLikedVideos(sortedLikedVideos);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
        return;
      }
    };
    fetchLikedVideos();
  }, [resetVisibleItems, refreshKey]);

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
    <>
      {likedVideos.length === 0 ? (
        <p className="text-center mt-16 text-2xl font-semibold">
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
            className="sticky top-[140px] bg-neutral-950 z-10"
          />
          <div ref={listContainerRef}>
            {filteredLikedVideos.length === 0 ? (
              <p className="text-center text-neutral-400 mt-16 text-lg">
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
                    {Math.min(RENDER_BATCH_SIZE, totalHiddenLikedVideos)} more
                    liked videos
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
