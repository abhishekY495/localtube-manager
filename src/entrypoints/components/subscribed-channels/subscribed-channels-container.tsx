import { ACTIONS, RENDER_BATCH_SIZE } from "@/entrypoints/utils/constants";
import type { Channel, Message, Response } from "@/entrypoints/utils/types";
import { useEffect, useMemo, useState } from "react";
import { Loading } from "../loading";
import { Error } from "../error";
import { SearchBar } from "../search-bar";
import { ChannelCard } from "./channel-card";
import { useProgressiveList } from "@/entrypoints/hooks/use-progressive-list";

export const SubscribedChannelsContainer = ({
  isSidebarOpen,
  refreshKey,
  onRefresh,
}: {
  isSidebarOpen: boolean;
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
    if (!isSidebarOpen) {
      return;
    }

    const fetchSubscribedChannels = async () => {
      setIsLoading(true);
      setError(false);
      const response: Response<Channel[]> = await browser.runtime.sendMessage({
        action: ACTIONS.GET_ALL_SUBSCRIBED_CHANNELS,
      } satisfies Message);
      if (!response.success) {
        setError(true);
        setIsLoading(false);
        return;
      }
      const sortedSubscribedChannels = response.data.sort((a, b) => {
        return (a.name ?? "").localeCompare(b.name ?? "");
      });
      resetVisibleItems();
      setSubscribedChannels(sortedSubscribedChannels);
      setIsLoading(false);
    };
    fetchSubscribedChannels();
  }, [isSidebarOpen, refreshKey, resetVisibleItems]);

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
    <div className="flex h-full min-h-0 flex-col">
      {subscribedChannels.length === 0 ? (
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
          to subscribe channels
        </p>
      ) : (
        <>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={handleSearchQueryChange}
          />
          {filteredSubscribedChannels.length === 0 ? (
            <p
              className="mt-16 text-center text-neutral-400"
              style={{ fontWeight: 500 }}
            >
              No subscribed channels found
            </p>
          ) : (
            <div
              ref={listContainerRef}
              className="min-h-0 grid grid-cols-3 gap-8 overflow-y-auto"
              style={{ padding: "22px 22px 50px 22px" }}
            >
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
                  Scroll to load {Math.min(
                    RENDER_BATCH_SIZE,
                    hiddenSubscribedChannelsCount,
                  )}{" "}
                  more channels
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
