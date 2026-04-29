import { useState, useEffect } from "react";
import {
  ACTIONS,
  NAV_ITEM_LABELS,
  type NavItemLabel,
} from "../utils/constants";
import { SidebarHeader } from "../components/sidebar-header";
import { SidebarOptions } from "../components/sidebar-options";
import { NavbarTabs } from "../components/navbar-tabs";
import type { Message } from "../utils/types";
import { LikedVideosContainer } from "../components/liked-videos/liked-videos-container";
import { SubscribedChannelsContainer } from "../components/subscribed-channels/subscribed-channels-container";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeItem, setActiveItem] = useState<NavItemLabel>(
    NAV_ITEM_LABELS.SUBSCRIPTIONS,
  );

  useEffect(() => {
    const handleMessage = (message: Message) => {
      if (message.action === ACTIONS.TOGGLE_SIDEBAR) {
        setIsOpen((prev) => !prev);
      }
    };
    browser.runtime.onMessage.addListener(handleMessage);

    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <div
      className={`fixed bg-neutral-900 shadow-2xl shadow-neutral-900 text-white font-sans border-x border-neutral-700 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-[110%]"
      }`}
      style={{
        width: "800px",
        height: "100vh",
        zIndex: "2147483647",
        fontFamily: "'Roboto', Arial, sans-serif",
        top: "0",
        right: "0",
      }}
    >
      <SidebarOptions
        setIsOpen={setIsOpen}
        onRefresh={() => setRefreshKey((currentKey) => currentKey + 1)}
      />
      <div className="flex h-full min-h-0 flex-col">
        <SidebarHeader />
        <NavbarTabs
          setActiveItem={setActiveItem}
          activeItem={activeItem}
          onRefresh={() => setRefreshKey((currentKey) => currentKey + 1)}
        />
        <div className="min-h-0 flex-1">
          <div
            className={
              activeItem === NAV_ITEM_LABELS.LIKED_VIDEOS
                ? "block h-full"
                : "hidden"
            }
          >
            <LikedVideosContainer
              isSidebarOpen={isOpen}
              refreshKey={refreshKey}
              onRefresh={() => setRefreshKey((currentKey) => currentKey + 1)}
            />
          </div>
          <div
            className={
              activeItem === NAV_ITEM_LABELS.CHANNELS
                ? "block h-full"
                : "hidden"
            }
          >
            <SubscribedChannelsContainer
              isSidebarOpen={isOpen}
              refreshKey={refreshKey}
              onRefresh={() => setRefreshKey((currentKey) => currentKey + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
