import { useState } from "react";
import { ACTIONS } from "@/entrypoints/utils/constants";
import type {
  Message,
  Response,
  SubscriptionsActiveTab,
} from "@/entrypoints/utils/types";
import { RefreshCwIcon } from "lucide-react";
import toast from "react-hot-toast";

export const SubscriptionsOptionsBar = ({
  activeTab,
  setActiveTab,
  onRefresh,
}: {
  activeTab: SubscriptionsActiveTab;
  setActiveTab: (tab: SubscriptionsActiveTab) => void;
  onRefresh: () => void;
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncSubscriptions = async () => {
    setIsSyncing(true);
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.SYNC_SUBSCRIPTIONS,
    } satisfies Message);
    if (!response.success) {
      toast.error("Something went wrong,\n Refresh and try again");
      setIsSyncing(false);
      return;
    }
    toast.success("Subscriptions synced successfully");
    setIsSyncing(false);
    onRefresh();
  };

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
        className="bg-neutral-800 hover:bg-neutral-700/50 text-neutral-200 rounded flex items-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ padding: "5px 12px" }}
        onClick={handleSyncSubscriptions}
        disabled={isSyncing}
      >
        <RefreshCwIcon size={15} className={isSyncing ? "animate-spin" : ""} />
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
