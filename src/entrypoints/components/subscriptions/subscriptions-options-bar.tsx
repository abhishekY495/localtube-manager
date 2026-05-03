import type { SubscriptionsActiveTab } from "@/entrypoints/utils/types";
import { RefreshCwIcon } from "lucide-react";

export const SubscriptionsOptionsBar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: SubscriptionsActiveTab;
  setActiveTab: (tab: SubscriptionsActiveTab) => void;
}) => {
  return (
    <div
      className="flex items-center justify-between gap-2 border-b-2 border-neutral-700"
      style={{
        padding: "5px",
        fontSize: "15px",
        fontWeight: 500,
      }}
    >
      <button
        className="bg-neutral-800 hover:bg-neutral-700/50 text-neutral-200 rounded flex items-center gap-3 cursor-pointer"
        style={{ padding: "5px 12px" }}
      >
        <RefreshCwIcon size={15} />
        Sync Subscriptions
      </button>
      <div className="flex gap-3">
        <button
          className={`rounded ${activeTab === "videos" ? "bg-neutral-200 text-black" : "bg-neutral-700 text-neutral-200 cursor-pointer"}`}
          style={{
            padding: "3px 18px",
          }}
          onClick={() => setActiveTab("videos")}
        >
          Videos
        </button>
        <button
          className={`rounded ${activeTab === "shorts" ? "bg-neutral-200 text-black" : "bg-neutral-700 text-neutral-200 cursor-pointer"}`}
          style={{
            padding: "3px 18px",
          }}
          onClick={() => setActiveTab("shorts")}
        >
          Shorts
        </button>
      </div>
    </div>
  );
};
