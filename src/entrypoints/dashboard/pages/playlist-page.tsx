import { useState, useEffect } from "react";
import type { LocalPlaylist, Video } from "@/entrypoints/utils/types";
import { getLocalPlaylistByName } from "@/entrypoints/indexedDb/local-playlists";
import { VideoDetails } from "../components/video";

export const PlaylistPage = ({ playlistName }: { playlistName: string }) => {
  const [playlist, setPlaylist] = useState<LocalPlaylist | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(
    playlist?.videos[0] ?? null,
  );

  useEffect(() => {
    const fetchPlaylist = async () => {
      const playlist = await getLocalPlaylistByName(playlistName);
      if (playlist) {
        setPlaylist(playlist);
        setCurrentVideo(playlist.videos[0] ?? null);
      }
    };
    fetchPlaylist();
  }, [playlistName]);

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  return (
    <div className="flex flex-1 min-h-0 gap-0 rounded">
      <div className="flex h-full w-[30%] flex-col border-8 border-neutral-900">
        <p className="flex gap-2 p-3 pt-1 bg-neutral-900 text-xl">
          <span className="text-neutral-500">•</span>
          {playlist.name}
        </p>
        <div className="flex flex-col overflow-y-auto">
          {playlist.videos.map((video) => {
            return (
              <VideoDetails
                key={video.urlSlug}
                video={video}
                isCurrentVideo={video.urlSlug === currentVideo?.urlSlug}
                setCurrentVideo={setCurrentVideo}
              />
            );
          })}
        </div>
      </div>
      {/*  */}
      <div className="h-full w-[70%]">
        {currentVideo && (
          <iframe
            className="w-full h-full rounded"
            width="100%"
            height="100%"
            title="YouTube video player"
            src={`https://www.youtube.com/embed/${currentVideo.urlSlug}`}
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
    </div>
  );
};
