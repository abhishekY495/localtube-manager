import { formatNumber } from "@/entrypoints/utils/format-number";
import type { ActiveTab } from "@/entrypoints/utils/types";

export const PlaylistTabs = ({
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
    <div className="flex justify-center items-center">
      <div
        className={`w-full text-center border border-b-2 border-t-0 border-neutral-700 cursor-pointer 
            ${activeTab === "youtube" ? "bg-neutral-800" : "bg-neutral-900"}`}
        style={{ padding: "11px", fontSize: "14px", fontWeight: 500 }}
        onClick={() => {
          setActiveTab("youtube");
          setSearchQuery("");
        }}
      >
        {formatNumber(youtubePlaylistCount)} YouTube
      </div>
      <div
        className={`w-full text-center border border-b-2 border-t-0 border-neutral-700 cursor-pointer 
            ${activeTab === "local" ? "bg-neutral-800" : "bg-neutral-900"}`}
        style={{ padding: "11px", fontSize: "14px", fontWeight: 500 }}
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
