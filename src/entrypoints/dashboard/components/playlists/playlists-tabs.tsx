import { formatNumber } from "@/entrypoints/utils/format-number";
import type { ActiveTab } from "@/entrypoints/utils/types";

export const PlaylistsTabs = ({
  activeTab,
  setActiveTab,
  setSearchQuery,
  youtubePlaylistCount,
  localPlaylistCount,
}: {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setSearchQuery: (query: string) => void;
  youtubePlaylistCount: number;
  localPlaylistCount: number;
}) => {
  return (
    <div className="flex justify-center items-center sticky top-[140px] bg-neutral-950 z-10">
      <div
        className={`w-full text-center text-base py-2.5 font-semibold border-2 border-t-0 border-neutral-700 first:border-l-0 last:border-r-0 cursor-pointer 
        ${activeTab === "youtube" ? "bg-neutral-800" : "bg-neutral-900"}`}
        onClick={() => {
          setActiveTab("youtube");
          setSearchQuery("");
        }}
      >
        {formatNumber(youtubePlaylistCount)} YouTube
      </div>
      <div
        className={`w-full text-center text-base py-2.5 font-semibold border-2 border-t-0 border-neutral-700 first:border-l-0 last:border-r-0 cursor-pointer 
        ${activeTab === "local" ? "bg-neutral-800" : "bg-neutral-900"}`}
        onClick={() => {
          setActiveTab("local");
          setSearchQuery("");
        }}
      >
        {formatNumber(localPlaylistCount)} Local
      </div>
    </div>
  );
};
