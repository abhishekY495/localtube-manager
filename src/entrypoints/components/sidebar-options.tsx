import { RotateCwIcon, SquareArrowOutUpRightIcon, XIcon } from "lucide-react";
import { ACTIONS } from "../utils/constants";
import type { Message } from "../utils/types";

export const SidebarOptions = ({
  setIsOpen,
  onRefresh,
}: {
  setIsOpen: (isOpen: boolean) => void;
  onRefresh: () => void;
}) => {
  const onOpenInNewTab = () => {
    browser.runtime.sendMessage({
      action: ACTIONS.OPEN_DASHBOARD,
    } satisfies Message);
  };

  return (
    <div
      className="absolute bg-neutral-900 text-white border border-neutral-700 flex flex-col"
      style={{
        left: "-33px",
        top: "8px",
        gap: "12px",
        padding: "10px 6px 12px 8px",
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px",
      }}
    >
      <div className="group relative inline-flex" title="Close">
        <XIcon
          size={16}
          className="cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      </div>
      <div className="group relative inline-flex" title="Refresh">
        <RotateCwIcon
          size={16}
          className="cursor-pointer"
          onClick={onRefresh}
        />
      </div>
      <div className="group relative inline-flex" title="Open in New Tab">
        <SquareArrowOutUpRightIcon
          size={16}
          className="cursor-pointer"
          onClick={onOpenInNewTab}
        />
      </div>
    </div>
  );
};
