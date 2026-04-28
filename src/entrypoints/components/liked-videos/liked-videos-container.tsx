import { ACTIONS } from "../../utils/constants";
import type { Message, Response, Video } from "../../utils/types";
import { useState, useEffect } from "react";
import { Loading } from "../loading";
import { Error } from "../error";
import { VideoCard } from "./video-card";
import { SearchBar } from "../search-bar";

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
      setLikedVideos(sortedLikedVideos);
      setIsLoading(false);
    };
    fetchLikedVideos();
  }, [isSidebarOpen, refreshKey]);

  const filteredLikedVideos = likedVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

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
            setSearchQuery={setSearchQuery}
          />
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {filteredLikedVideos.length === 0 ? (
              <p className="mt-8 text-center text-neutral-400">
                No liked videos found
              </p>
            ) : (
              filteredLikedVideos.map((video) => (
                <VideoCard
                  key={video.urlSlug}
                  video={video}
                  onRefresh={onRefresh}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
