import { subscriptionsCronJob } from "@/entrypoints/utils/subscriptions/subscriptions-cron-job";
import type { SubscriptionsActiveTab } from "@/entrypoints/utils/types";
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
    try {
      await subscriptionsCronJob();
      toast.success("Subscriptions synced successfully");
      setIsSyncing(false);
      onRefresh();
      return;
    } catch (error) {
      toast.error("Something went wrong,\n Try again");
      setIsSyncing(false);
      return;
    } finally {
      setIsSyncing(false);
    }
  };
  return (
    <div className="flex items-center justify-between gap-2 border-b-2 border-neutral-700 text-sm font-medium py-1.5 sticky top-[140px] bg-neutral-950 z-10">
      <button
        className="bg-neutral-800 hover:bg-neutral-700/50 text-neutral-200 rounded flex items-center gap-1.5 p-1.5 px-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSyncSubscriptions}
        disabled={isSyncing}
      >
        <RefreshCwIcon size={15} className={isSyncing ? "animate-spin" : ""} />
        Sync Subscriptions
      </button>
      <div className="flex gap-2">
        <button
          className={`rounded p-1 px-4 ${activeTab === "videos" ? "bg-neutral-200 text-black" : "bg-neutral-700 text-neutral-200 cursor-pointer"}`}
          onClick={() => setActiveTab("videos")}
        >
          Videos
        </button>
        <button
          className={`rounded p-1 px-4 ${activeTab === "shorts" ? "bg-neutral-200 text-black" : "bg-neutral-700 text-neutral-200 cursor-pointer"}`}
          onClick={() => setActiveTab("shorts")}
        >
          Shorts
        </button>
      </div>
    </div>
  );
};
