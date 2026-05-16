import { useState, useEffect } from "react";
import type {
  ActiveTab,
  LocalPlaylist,
  YoutubePlaylist,
} from "@/entrypoints/utils/types";
import { Loading } from "@/entrypoints/components/loading";
import { Error } from "@/entrypoints/components/error";
import { getAllYoutubePlaylists } from "@/entrypoints/indexed-db/youtube-playlist";
import { getAllLocalPlaylists } from "@/entrypoints/indexed-db/local-playlists";
import { PlaylistsTabs } from "./playlists-tabs";
import { YoutubePlaylistContainer } from "./youtube/youtube-playlist-container";
import { LocalPlaylistContainer } from "./local/local-playlist-container";
import { LocalPlaylistWithVideosContainer } from "./local/local-playlist-with-videos-container";

export const PlaylistsContainer = ({
  refreshKey,
  onRefresh,
  playlistName,
  setPlaylistName,
}: {
  refreshKey: number;
  onRefresh: () => void;
  playlistName: string | null;
  setPlaylistName: (name: string | null) => void;
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    playlistName ? "local" : "youtube",
  );
  const [youtubePlaylist, setYoutubePlaylist] = useState<YoutubePlaylist[]>([]);
  const [localPlaylist, setLocalPlaylist] = useState<LocalPlaylist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (playlistName) {
      setActiveTab("local");
    }
  }, [playlistName]);

  useEffect(() => {
    const fetchYoutubeAndLocalPlaylists = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const youtubePlaylistResponse = await getAllYoutubePlaylists();
        const localPlaylistResponse = await getAllLocalPlaylists();
        if (!youtubePlaylistResponse || !localPlaylistResponse) {
          setError(true);
          setIsLoading(false);
          return;
        }
        const sortedYoutubePlaylist = youtubePlaylistResponse.sort((a, b) => {
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        });
        const sortedLocalPlaylist = localPlaylistResponse.sort((a, b) => {
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        });
        setYoutubePlaylist(sortedYoutubePlaylist);
        setLocalPlaylist(sortedLocalPlaylist);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
        return;
      }
    };
    fetchYoutubeAndLocalPlaylists();
  }, [refreshKey]);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <>
      <PlaylistsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSearchQuery={setSearchQuery}
        youtubePlaylistCount={youtubePlaylist.length}
        localPlaylistCount={localPlaylist.length}
        setPlaylistName={setPlaylistName}
      />
      {playlistName ? (
        <LocalPlaylistWithVideosContainer
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
          onRefresh={onRefresh}
        />
      ) : (
        <>
          {activeTab === "youtube" && (
            <YoutubePlaylistContainer
              youtubePlaylist={youtubePlaylist}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onRefresh={onRefresh}
            />
          )}
          {activeTab === "local" && (
            <LocalPlaylistContainer
              localPlaylist={localPlaylist}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setPlaylistName={setPlaylistName}
              onRefresh={onRefresh}
            />
          )}
        </>
      )}
    </>
  );
};
