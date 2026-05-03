import { useState, useEffect } from "react";
import type {
  Message,
  Response,
  Subscription,
  SubscriptionsActiveTab,
} from "@/entrypoints/utils/types";
import { ACTIONS } from "@/entrypoints/utils/constants";
import { Loading } from "../loading";
import { Error } from "../error";
import { SubscriptionVideoCard } from "./subscription-video-card";
import { SubscriptionsOptionsBar } from "./subscriptions-options-bar";
import { SubscriptionShortCard } from "./subscription-short-card";

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
      setSubscriptions(response.data);
      setIsLoading(false);
    };
    fetchSubscriptions();
  }, [isSidebarOpen, refreshKey]);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  const subcriptionVideos = subscriptions.filter(
    (subscription) => !subscription.isShort,
  );
  const subcriptionShorts = subscriptions.filter(
    (subscription) => subscription.isShort,
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
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
          <SubscriptionsOptionsBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {activeTab === "videos" && (
            <div
              className="min-h-0 grid grid-cols-3 gap-10 overflow-y-auto"
              style={{ padding: "22px 22px 50px 22px" }}
            >
              {subcriptionVideos.map((subscription) => {
                return (
                  <SubscriptionVideoCard
                    key={subscription.urlSlug}
                    subscription={subscription}
                  />
                );
              })}
            </div>
          )}
          {activeTab === "shorts" && (
            <div
              className="min-h-0 grid grid-cols-4 gap-10 overflow-y-auto"
              style={{ padding: "22px 22px 50px 22px" }}
            >
              {subcriptionShorts.map((subscription) => {
                return (
                  <SubscriptionShortCard
                    key={subscription.urlSlug}
                    subscription={subscription}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
