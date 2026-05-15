import { NAV_ITEM_LABELS, type NavItemLabel } from "../utils/constants";
import { Header } from "./components/header";
import { LikedVideosContainer } from "./components/liked-videos/liked-videos-container";
import { NavbarTabs } from "./components/navbar-tabs";
import { PlaylistsContainer } from "./components/playlists/playlists-container";
import { SettingsContainer } from "./components/settings/settings-container";
import { SubscribedChannelsContainer } from "./components/subscribed-channels/subscribed-channels-container";
import { SubscriptionsContainer } from "./components/subscriptions/subscriptions-container";

export default function App() {
  const [activeItem, setActiveItem] = useState<NavItemLabel>(
    NAV_ITEM_LABELS.SUBSCRIPTIONS,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => setRefreshKey((currentKey) => currentKey + 1);
  const location = window.location.href;
  const slug = location.split("#")[1];

  useEffect(() => {
    if (slug === "subscriptions") {
      setActiveItem(NAV_ITEM_LABELS.SUBSCRIPTIONS);
    } else if (slug === "settings") {
      setActiveItem(NAV_ITEM_LABELS.SETTINGS);
    } else if (slug === "liked-videos") {
      setActiveItem(NAV_ITEM_LABELS.LIKED_VIDEOS);
    } else if (slug === "channels") {
      setActiveItem(NAV_ITEM_LABELS.CHANNELS);
    } else if (slug === "playlists") {
      setActiveItem(NAV_ITEM_LABELS.PLAYLISTS);
    }
  }, [slug]);

  return (
    <div className="mx-auto flex h-full max-w-[85%] flex-col bg-neutral-950">
      <Header />
      <NavbarTabs setActiveItem={setActiveItem} activeItem={activeItem} />
      <div
        className={
          activeItem === NAV_ITEM_LABELS.SUBSCRIPTIONS ? "block" : "hidden"
        }
      >
        <SubscriptionsContainer />
      </div>
      <div
        className={
          activeItem === NAV_ITEM_LABELS.LIKED_VIDEOS ? "block" : "hidden"
        }
      >
        <LikedVideosContainer />
      </div>
      <div
        className={activeItem === NAV_ITEM_LABELS.CHANNELS ? "block" : "hidden"}
      >
        <SubscribedChannelsContainer />
      </div>
      <div
        className={
          activeItem === NAV_ITEM_LABELS.PLAYLISTS ? "block" : "hidden"
        }
      >
        <PlaylistsContainer refreshKey={refreshKey} onRefresh={handleRefresh} />
      </div>
      <div
        className={activeItem === NAV_ITEM_LABELS.SETTINGS ? "block" : "hidden"}
      >
        <SettingsContainer />
      </div>
    </div>
  );
}
