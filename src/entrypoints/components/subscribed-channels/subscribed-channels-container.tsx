import { ACTIONS } from "@/entrypoints/utils/constants";
import type { Channel, Message, Response } from "@/entrypoints/utils/types";
import { Loading } from "../loading";
import { Error } from "../error";
import { SearchBar } from "../search-bar";
import { ChannelCard } from "./channel-card";

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
      setSubscribedChannels(sortedSubscribedChannels);
      setIsLoading(false);
    };
    fetchSubscribedChannels();
  }, [isSidebarOpen, refreshKey]);

  const filteredSubscribedChannels = subscribedChannels.filter(
    (channel) =>
      channel.name?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      channel.handle?.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

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
          to subscribe to channels
        </p>
      ) : (
        <>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <div
            className="min-h-0 grid grid-cols-3 gap-8 overflow-y-auto"
            style={{ padding: "18px 18px 50px 18px" }}
          >
            {filteredSubscribedChannels.length === 0 ? (
              <p
                className="mt-16 text-center text-neutral-400"
                style={{ fontWeight: 500 }}
              >
                No subscribed channels found
              </p>
            ) : (
              filteredSubscribedChannels.map((channel) => (
                <ChannelCard key={channel.handle} channel={channel} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
