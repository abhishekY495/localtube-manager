import { useState, useEffect, useMemo } from "react";
import type {
  Message,
  Response,
  Subscription,
  SubscriptionsActiveTab,
} from "@/entrypoints/utils/types";
import { ACTIONS, RENDER_BATCH_SIZE } from "@/entrypoints/utils/constants";
import { Loading } from "../loading";
import { Error } from "../error";
import { SubscriptionVideoCard } from "./subscription-video-card";
import { SubscriptionsOptionsBar } from "./subscriptions-options-bar";
import { SubscriptionShortCard } from "./subscription-short-card";
import { useProgressiveList } from "@/entrypoints/hooks/use-progressive-list";

export const SubscriptionsContainer = ({
  isSidebarOpen,
  refreshKey,
  onRefresh,
}: {
  isSidebarOpen: boolean;
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
    if (!isSidebarOpen) {
      return;
    }

    const fetchSubscriptions = async () => {
      setIsLoading(true);
      setError(false);
      const response: Response<Subscription[]> =
        await browser.runtime.sendMessage({
          action: ACTIONS.GET_ALL_SUBSCRIPTIONS,
        } satisfies Message);
      if (!response.success) {
        setError(true);
        setIsLoading(false);
        return;
      }
      const sortedSubscriptions = response.data.sort((a, b) => {
        return (
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      });
      resetVisibleItems();
      setSubscriptions(sortedSubscriptions);
      setIsLoading(false);
    };
    fetchSubscriptions();
  }, [isSidebarOpen, refreshKey, resetVisibleItems]);

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
    <div className="flex h-full min-h-0 flex-col">
      <SubscriptionsOptionsBar
        activeTab={activeTab}
        setActiveTab={handleActiveTabChange}
        onRefresh={onRefresh}
      />
      {subscriptions.length === 0 ? (
        <p
          className="text-center"
          style={{
            marginTop: "80px",
            fontSize: "22px",
            fontWeight: "500",
          }}
        >
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
        <>
          {activeTab === "videos" && (
            <div
              ref={listContainerRef}
              className="min-h-0 grid grid-cols-3 gap-10 overflow-y-auto"
              style={{ padding: "22px 22px 50px 22px" }}
            >
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
            <div
              ref={listContainerRef}
              className="min-h-0 grid grid-cols-4 gap-10 overflow-y-auto"
              style={{ padding: "22px 22px 50px 22px" }}
            >
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
        </>
      )}
    </div>
  );
};
