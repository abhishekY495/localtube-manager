import { ACTIONS } from "@/entrypoints/utils/constants";
import type {
  ActiveTab,
  LocalPlaylist,
  Message,
  Response,
  YoutubePlaylist,
} from "@/entrypoints/utils/types";
import { useEffect, useState } from "react";
import { Loading } from "../loading";
import { Error } from "../error";
import { PlaylistTabs } from "./playlist-tabs";
import { LocalPlaylistContainer } from "./local/local-playlist-container";
import { YoutubePlaylistContainer } from "./youtube/youtube-playlist-container";

export const PlaylistsContainer = ({
  isSidebarOpen,
  refreshKey,
  onRefresh,
}: {
  isSidebarOpen: boolean;
  refreshKey: number;
  onRefresh: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("youtube");
  const [youtubePlaylist, setYoutubePlaylist] = useState<YoutubePlaylist[]>([]);
  const [localPlaylist, setLocalPlaylist] = useState<LocalPlaylist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const fetchYoutubeAndLocalPlaylists = async () => {
      setIsLoading(true);
      setError(false);
      const youtubePlaylistResponse: Response<YoutubePlaylist[]> =
        await browser.runtime.sendMessage({
          action: ACTIONS.GET_ALL_YOUTUBE_PLAYLISTS,
        } satisfies Message);
      const localPlaylistResponse: Response<LocalPlaylist[]> =
        await browser.runtime.sendMessage({
          action: ACTIONS.GET_ALL_LOCAL_PLAYLISTS,
        } satisfies Message);
      if (!youtubePlaylistResponse.success || !localPlaylistResponse.success) {
        setError(true);
        setIsLoading(false);
        return;
      }

      const sortedYoutubePlaylist = youtubePlaylistResponse.data.sort(
        (a, b) => {
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        },
      );
      const sortedLocalPlaylist = localPlaylistResponse.data.sort((a, b) => {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      });

      setYoutubePlaylist(sortedYoutubePlaylist);
      setLocalPlaylist(sortedLocalPlaylist);
      setIsLoading(false);
    };
    fetchYoutubeAndLocalPlaylists();
  }, [isSidebarOpen, refreshKey]);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <>
      <PlaylistTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSearchQuery={setSearchQuery}
        youtubePlaylistCount={youtubePlaylist.length}
        localPlaylistCount={localPlaylist.length}
      />
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
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};
