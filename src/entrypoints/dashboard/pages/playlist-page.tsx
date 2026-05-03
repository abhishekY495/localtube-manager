import { useState, useEffect } from "react";
import type { LocalPlaylist, Video } from "@/entrypoints/utils/types";
import { getLocalPlaylistByName } from "@/entrypoints/indexedDb/local-playlists";
import { VideoDetails } from "../components/video-details";
import { PencilIcon } from "lucide-react";
import { SearchBar } from "@/entrypoints/components/search-bar";

export const PlaylistPage = ({ playlistName }: { playlistName: string }) => {
  const [playlist, setPlaylist] = useState<LocalPlaylist | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredVideos = playlist.videos.filter((video) => {
    return video.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });

  return (
    <div className="flex flex-1 min-h-0 gap-0 rounded">
      <div className="flex h-full w-[600px] flex-col border-8 border-neutral-900">
        <div className="flex items-center justify-between gap-2 p-3 pt-1 bg-neutral-900">
          <div className="flex items-center gap-2">
            <PencilIcon
              size={24}
              className="bg-neutral-800 p-1 rounded border border-neutral-700 cursor-pointer"
            />
            <p className="text-xl">{playlist.name}</p>
          </div>
          <p className="text-neutral-400 text-sm">
            {playlist.videos.length} videos
          </p>
        </div>
        {/*  */}
        <div className="flex flex-col overflow-y-auto">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            className="border-neutral-800"
          />
          {filteredVideos.length === 0 ? (
            <p className="mt-16 font-semibold text-base text-center text-neutral-400">
              No videos found
            </p>
          ) : (
            filteredVideos.map((video) => {
              return (
                <VideoDetails
                  key={video.urlSlug}
                  video={video}
                  isCurrentVideo={video.urlSlug === currentVideo?.urlSlug}
                  setCurrentVideo={setCurrentVideo}
                />
              );
            })
          )}
        </div>
      </div>
      {/*  */}
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
  );
};
