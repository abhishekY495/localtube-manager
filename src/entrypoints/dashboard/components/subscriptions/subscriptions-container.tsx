import { useState, useMemo } from "react";
import { useProgressiveList } from "@/entrypoints/hooks/use-progressive-list";
import {
  type Subscription,
  type SubscriptionsActiveTab,
} from "@/entrypoints/utils/types";
import { getAllSubscriptions } from "@/entrypoints/indexed-db/subscriptions";
import { Loading } from "@/entrypoints/components/loading";
import { Error } from "@/entrypoints/components/error";
import { SubscriptionsOptionsBar } from "./subscriptions-options-bar";
import { RENDER_BATCH_SIZE } from "@/entrypoints/utils/constants";
import { SubscriptionVideoCard } from "./subscription-video-card";
import { SubscriptionShortCard } from "./subscription-short-card";

export const SubscriptionsContainer = ({
  refreshKey,
  onRefresh,
}: {
  refreshKey: number;
  onRefresh: () => void;
}) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeTab, setActiveTab] = useState<SubscriptionsActiveTab>("videos");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const subcriptionVideos = useMemo(
    () => subscriptions.filter((subscription) => !subscription.isShort),
    [subscriptions],
  );
  const subcriptionShorts = useMemo(
    () => subscriptions.filter((subscription) => subscription.isShort),
    [subscriptions],
  );
  const activeSubscriptions =
    activeTab === "videos" ? subcriptionVideos : subcriptionShorts;
  const {
    visibleItems: visibleSubscriptions,
    hasMoreItems: hasMoreSubscriptions,
    hiddenItemsCount: hiddenSubscriptionsCount,
    listContainerRef,
    loadMoreTriggerRef,
    resetVisibleItems,
  } = useProgressiveList(activeSubscriptions);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const subscriptions = await getAllSubscriptions();
        if (!subscriptions) {
          setError(true);
          setIsLoading(false);
          return;
        }
        const sortedSubscriptions = subscriptions.sort((a, b) => {
          return (
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          );
        });
        resetVisibleItems();
        setSubscriptions(sortedSubscriptions);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
        return;
      }
    };
    fetchSubscriptions();
  }, [refreshKey, resetVisibleItems]);

  const handleActiveTabChange = (tab: SubscriptionsActiveTab) => {
    resetVisibleItems();
    setActiveTab(tab);
  };

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <div className="flex flex-col">
      <SubscriptionsOptionsBar
        activeTab={activeTab}
        setActiveTab={handleActiveTabChange}
        onRefresh={onRefresh}
      />
      {subscriptions.length === 0 ? (
        <p className="text-center mt-16 text-2xl font-semibold">
          Visit{" "}
          <a
            href="https://www.youtube.com"
            className="text-[#FF0733] underline underline-offset-4 cursor-pointer"
          >
            YouTube
          </a>{" "}
          to subscribe to channels
        </p>
      ) : (
        <div className="py-5">
          {activeTab === "videos" && (
            <div ref={listContainerRef} className="grid grid-cols-5 gap-5">
              {visibleSubscriptions.map((subscription) => {
                return (
                  <SubscriptionVideoCard
                    key={subscription.urlSlug}
                    subscription={subscription}
                  />
                );
              })}
              {hasMoreSubscriptions && (
                <div
                  ref={loadMoreTriggerRef}
                  className="col-span-full py-4 text-center text-sm text-neutral-400"
                >
                  Scroll to load{" "}
                  {Math.min(RENDER_BATCH_SIZE, hiddenSubscriptionsCount)} more
                  subscriptions
                </div>
              )}
            </div>
          )}
          {activeTab === "shorts" && (
            <div ref={listContainerRef} className="grid grid-cols-6 gap-5">
              {visibleSubscriptions.map((subscription) => {
                return (
                  <SubscriptionShortCard
                    key={subscription.urlSlug}
                    subscription={subscription}
                  />
                );
              })}
              {hasMoreSubscriptions && (
                <div
                  ref={loadMoreTriggerRef}
                  className="col-span-full py-4 text-center text-sm text-neutral-400"
                >
                  Scroll to load{" "}
                  {Math.min(RENDER_BATCH_SIZE, hiddenSubscriptionsCount)} more
                  subscriptions
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
