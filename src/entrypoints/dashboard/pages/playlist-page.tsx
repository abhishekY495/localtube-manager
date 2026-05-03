import { useState, useEffect } from "react";
import type { LocalPlaylist, Video } from "@/entrypoints/utils/types";
import { getLocalPlaylistByName } from "@/entrypoints/indexedDb/local-playlists";
import { VideoDetails } from "../components/video-details";
import { PencilIcon } from "lucide-react";
import { SearchBar } from "@/entrypoints/components/search-bar";
import { UpdatePlaylistNameModal } from "../components/update-playlist-name-modal";

export const PlaylistPage = ({ playlistName }: { playlistName: string }) => {
  const [isUpdatePlaylistNameModalOpen, setIsUpdatePlaylistNameModalOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleVideoRemoved = (videoId: string) => {
    if (!playlist) {
      return;
    }

    const updatedVideos = playlist.videos.filter(
      (video) => video.urlSlug !== videoId,
    );

    setPlaylist({
      ...playlist,
      videos: updatedVideos,
    });

    if (currentVideo?.urlSlug === videoId) {
      setCurrentVideo(updatedVideos[0] ?? null);
    }
  };

  const handlePlaylistRenamed = (newName: string) => {
    setPlaylist((currentPlaylist) => {
      if (!currentPlaylist) {
        return currentPlaylist;
      }

      return {
        ...currentPlaylist,
        name: newName,
      };
    });

    window.history.replaceState(
      null,
      "",
      `#local-playlists?name=${encodeURIComponent(newName)}`,
    );
  };

  if (!playlist) {
    return (
      <div className="text-center text-lg font-medium text-neutral-300 mt-10">
        Playlist not found <br /> 🤖
      </div>
    );
  }

  const filteredVideos = playlist.videos.filter((video) => {
    return video.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });

  return (
    <>
      <div className="flex flex-1 min-h-0 gap-0 rounded">
        <div className="flex h-full w-[600px] flex-col border-8 border-neutral-900">
          {/*  */}
          <div className="flex items-center justify-between gap-2 p-3 pt-1 bg-neutral-900">
            <div className="flex items-center gap-2">
              <PencilIcon
                size={24}
                className="bg-neutral-800 p-1 rounded border border-neutral-700 cursor-pointer"
                onClick={() => setIsUpdatePlaylistNameModalOpen(true)}
              />
              <div className="flex items-center gap-2">
                <p className="text-xl">{playlist.name}</p>
                <p className="text-xs mt-1">
                  <span className="text-neutral-500 mr-2">•</span>
                  <span className="text-neutral-300">
                    {playlist.videos.length} videos
                  </span>
                </p>
              </div>
            </div>
            <button className="bg-red-500/20 border border-red-900 pt-0.5 pb-1.5 px-4 rounded cursor-pointer hover:bg-red-900">
              Delete
            </button>
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
                    playlistName={playlist.name}
                    video={video}
                    isCurrentVideo={video.urlSlug === currentVideo?.urlSlug}
                    setCurrentVideo={setCurrentVideo}
                    onVideoRemoved={handleVideoRemoved}
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
      {isUpdatePlaylistNameModalOpen && (
        <UpdatePlaylistNameModal
          setIsUpdatePlaylistNameModalOpen={setIsUpdatePlaylistNameModalOpen}
          playlistName={playlist.name}
          onPlaylistRenamed={handlePlaylistRenamed}
        />
      )}
    </>
  );
};
