import { formatNumber } from "@/entrypoints/utils/format-number";
import type { ActiveTab } from "@/entrypoints/utils/types";

export const PlaylistsTabs = ({
  activeTab,
  setActiveTab,
  setSearchQuery,
  youtubePlaylistCount,
  localPlaylistCount,
  setPlaylistName,
}: {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setSearchQuery: (query: string) => void;
  youtubePlaylistCount: number;
  localPlaylistCount: number;
  setPlaylistName: (name: string | null) => void;
}) => {
  const buttonClickHandler = (tab: ActiveTab) => {
    const location = window.location.href;
    const url = location.split("#")[0];
    setActiveTab(tab);
    setSearchQuery("");
    setPlaylistName(null);
    window.location.href = `${url}#playlists`;
  };

  return (
    <div className="flex justify-center items-center sticky top-[140px] bg-neutral-950 z-10">
      <button
        className={`w-full text-center text-base py-2.5 font-semibold border-2 border-t-0 border-neutral-700 first:border-l-0 last:border-r-0 cursor-pointer 
        ${activeTab === "youtube" ? "bg-neutral-800" : "bg-neutral-900"}`}
        onClick={() => buttonClickHandler("youtube")}
      >
        {formatNumber(youtubePlaylistCount)} YouTube
      </button>
      <button
        className={`w-full text-center text-base py-2.5 font-semibold border-2 border-t-0 border-neutral-700 first:border-l-0 last:border-r-0 cursor-pointer 
        ${activeTab === "local" ? "bg-neutral-800" : "bg-neutral-900"}`}
        onClick={() => buttonClickHandler("local")}
      >
        {formatNumber(localPlaylistCount)} Local
      </button>
    </div>
  );
};
