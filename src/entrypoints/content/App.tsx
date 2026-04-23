import { useState, useEffect } from "react";
import { ACTIONS } from "../utils/constants";
import { SidebarOptions } from "../components/sidebar-options";
import { SidebarHeader } from "../components/sidebar-header";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

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
      className={`fixed top-0 right-0 h-screen w-[660px] z-2147483647 bg-neutral-900 border-l border-neutral-700 p-1.5 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-[110%]"
      }`}
    >
      <SidebarOptions setIsOpen={setIsOpen} />
      <SidebarHeader />
    </div>
  );
}
