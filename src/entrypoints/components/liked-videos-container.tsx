import { ACTIONS } from "../utils/constants";
import type { Message, Video } from "../utils/types";
import { useState, useEffect } from "react";
import { Loading } from "./loading";
import { Error } from "./error";
import { VideoCard } from "./video-card";

export const LikedVideosContainer = ({
  isSidebarOpen,
  refreshKey,
}: {
  isSidebarOpen: boolean;
  refreshKey: number;
}) => {
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const fetchLikedVideos = async () => {
      setIsLoading(true);
      setError(false);
      const response = await browser.runtime.sendMessage({
        action: ACTIONS.GET_ALL_LIKED_VIDEOS,
      } satisfies Message);
      if (!response.success) {
        setError(true);
        setIsLoading(false);
        return;
      }
      setLikedVideos(response.data);
      setIsLoading(false);
    };
    fetchLikedVideos();
  }, [isSidebarOpen, refreshKey]);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <>
      {likedVideos.length > 0 ? (
        <div className="flex flex-col">
          {likedVideos.map((video, index) => (
            <VideoCard key={video.urlSlug} video={video} index={index} />
          ))}
        </div>
      ) : (
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
      )}
    </>
  );
};
