import type { Channel } from "@/entrypoints/utils/types";
import { useState, useMemo, useEffect } from "react";
import { Loading } from "@/entrypoints/components/loading";
import { Error } from "@/entrypoints/components/error";
import { SearchBar } from "@/entrypoints/components/search-bar";
import { useProgressiveList } from "@/entrypoints/hooks/use-progressive-list";
import { getAllSubscribedChannels } from "@/entrypoints/indexed-db/subscribed-channels";
import { ChannelCard } from "./channel-card";
import { RENDER_BATCH_SIZE } from "@/entrypoints/utils/constants";

export const SubscribedChannelsContainer = ({
  refreshKey,
  onRefresh,
}: {
  refreshKey: number;
  onRefresh: () => void;
}) => {
  const [subscribedChannels, setSubscribedChannels] = useState<Channel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const filteredSubscribedChannels = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    if (!normalizedSearchQuery) {
      return subscribedChannels;
    }

    return subscribedChannels.filter(
      (channel) =>
        channel.name?.toLowerCase().includes(normalizedSearchQuery) ||
        channel.handle?.toLowerCase().includes(normalizedSearchQuery),
    );
  }, [subscribedChannels, searchQuery]);

  const {
    visibleItems: visibleSubscribedChannels,
    hasMoreItems: hasMoreSubscribedChannels,
    hiddenItemsCount: hiddenSubscribedChannelsCount,
    listContainerRef,
    loadMoreTriggerRef,
    resetVisibleItems,
  } = useProgressiveList(filteredSubscribedChannels);

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const subscribedChannels = await getAllSubscribedChannels();
        if (!subscribedChannels) {
          setError(true);
          setIsLoading(false);
          return;
        }
        const sortedSubscribedChannels = subscribedChannels.sort((a, b) => {
          return (a.name ?? "").localeCompare(b.name ?? "");
        });
        resetVisibleItems();
        setSubscribedChannels(sortedSubscribedChannels);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
        return;
      }
    };
    fetchSubscribedChannels();
  }, [resetVisibleItems, refreshKey]);

  const handleSearchQueryChange = (value: string) => {
    resetVisibleItems();
    setSearchQuery(value);
  };

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <>
      {subscribedChannels.length === 0 ? (
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
        <>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={handleSearchQueryChange}
            className="sticky top-[140px] bg-neutral-950 z-10"
          />
          <div ref={listContainerRef} className="flex flex-col py-5">
            {filteredSubscribedChannels.length === 0 ? (
              <p className="text-center text-neutral-400 mt-16 text-lg">
                No subscribed channels found
              </p>
            ) : (
              <div className="grid grid-cols-5 gap-6">
                {visibleSubscribedChannels.map((channel) => (
                  <ChannelCard
                    key={channel.handle}
                    channel={channel}
                    onRefresh={onRefresh}
                  />
                ))}
                {hasMoreSubscribedChannels && (
                  <div
                    ref={loadMoreTriggerRef}
                    className="col-span-full py-4 text-center text-sm text-neutral-400"
                  >
                    Scroll to load{" "}
                    {Math.min(RENDER_BATCH_SIZE, hiddenSubscribedChannelsCount)}{" "}
                    more subscribed channels
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
