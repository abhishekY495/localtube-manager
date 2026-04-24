import { useState, useEffect } from "react";
import { ACTIONS, NAV_ITEMS } from "../utils/constants";
import { SidebarHeader } from "../components/sidebar-header";
import { SidebarOptions } from "../components/sidebar-options";
import { Navbar } from "../components/navbar";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>(NAV_ITEMS[0].label);

  useEffect(() => {
    const handleMessage = (message: any) => {
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
      className={`fixed bg-neutral-900 shadow-2xl shadow-neutral-900 text-white border-l border-neutral-700 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-[110%]"
      }`}
      style={{
        width: "660px",
        height: "100vh",
        zIndex: "2147483647",
        padding: "6px",
        top: "0",
        right: "0",
      }}
    >
      <SidebarOptions setIsOpen={setIsOpen} />
      <div className="flex flex-col" style={{ gap: "6px" }}>
        <SidebarHeader />
        <Navbar setActiveItem={setActiveItem} activeItem={activeItem} />
      </div>
    </div>
  );
}
