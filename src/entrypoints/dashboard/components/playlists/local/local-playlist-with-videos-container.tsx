import { useState, useEffect } from "react";
import { SearchBar } from "@/entrypoints/components/search-bar";
import { getLocalPlaylistByName } from "@/entrypoints/indexed-db/local-playlists";
import type { LocalPlaylist, Video } from "@/entrypoints/utils/types";
import { VideoDetails } from "./video-details";
import { UpdateLocalPlaylistNameModal } from "./update-local-playlist-name-modal";
import { PencilIcon } from "lucide-react";
import { RemoveLocalPlaylistModal } from "./remove-local-playlist-modal";

export const LocalPlaylistWithVideosContainer = ({
  playlistName,
  setPlaylistName,
  onRefresh,
}: {
  playlistName: string;
  setPlaylistName: (name: string | null) => void;
  onRefresh: () => void;
}) => {
  const [isUpdatePlaylistNameModalOpen, setIsUpdatePlaylistNameModalOpen] =
    useState(false);
  const [isRemovePlaylistModalOpen, setIsRemovePlaylistModalOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [playlist, setPlaylist] = useState<LocalPlaylist | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(
    playlist?.videos[0] ?? null,
  );

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

  const handlePlaylistDeleted = () => {
    const location = window.location.href;
    const url = location.split("#")[0];
    window.location.href = `${url}#playlists`;
    setPlaylistName(null);
    onRefresh();
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      const playlist = await getLocalPlaylistByName(
        decodeURIComponent(playlistName),
      );
      if (playlist) {
        setPlaylist(playlist);
        setCurrentVideo(playlist.videos[0] ?? null);
      }
    };
    fetchPlaylist();
  }, [playlistName]);

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
      <div className="flex rounded py-4 h-[78vh]">
        <div className="flex w-[600px] flex-col border-8 border-neutral-900">
          {/*  */}
          <div className="flex items-center justify-between gap-2 p-3 pt-1 bg-neutral-900">
            <div className="flex items-center gap-2">
              <PencilIcon
                size={24}
                className="bg-neutral-800 p-1 rounded border border-neutral-700 cursor-pointer"
                onClick={() => setIsUpdatePlaylistNameModalOpen(true)}
              />
              <div className="flex items-center gap-2">
                <p className="text-xl truncate w-[200px]" title={playlist.name}>
                  {playlist.name}
                </p>
                <p className="text-xs mt-1">
                  <span className="text-neutral-500 mr-2">•</span>
                  <span className="text-neutral-300">
                    {playlist.videos.length} videos
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsRemovePlaylistModalOpen(true)}
              className="bg-red-500/20 border border-red-900 pt-0.5 pb-1.5 px-4 rounded cursor-pointer hover:bg-red-900"
            >
              Delete
            </button>
          </div>
          {/*  */}
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
            <div className="flex flex-col overflow-y-auto">
              {filteredVideos.map((video) => {
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
              })}
            </div>
          )}
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
        <UpdateLocalPlaylistNameModal
          setIsUpdatePlaylistNameModalOpen={setIsUpdatePlaylistNameModalOpen}
          playlistName={playlist.name}
          onPlaylistRenamed={handlePlaylistRenamed}
        />
      )}
      {isRemovePlaylistModalOpen && (
        <RemoveLocalPlaylistModal
          setIsRemoveModalOpen={setIsRemovePlaylistModalOpen}
          playlistName={playlist.name}
          onRefresh={handlePlaylistDeleted}
        />
      )}
    </>
  );
};
