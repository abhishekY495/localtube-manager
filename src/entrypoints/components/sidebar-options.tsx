import { SquareArrowOutUpRightIcon, XIcon } from "lucide-react";
import { ACTIONS } from "../utils/constants";

export const SidebarOptions = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  return (
    <div
      className="absolute bg-neutral-900 text-white border border-neutral-700 flex flex-col"
      style={{
        left: "-32px",
        top: "8px",
        gap: "12px",
        padding: "6px",
        paddingBlock: "10px",
        paddingLeft: "8px",
        paddingBottom: "12px",
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
      }}
    >
      <div className="group relative inline-flex">
        <XIcon
          size={16}
          className="cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
        <span
          className="pointer-events-none absolute z-50 whitespace-nowrap rounded border border-neutral-600 bg-neutral-800 opacity-0 shadow transition-opacity delay-0 duration-200 group-hover:opacity-100 group-hover:delay-500"
          role="tooltip"
          style={{
            marginTop: "4px",
            paddingInline: "8px",
            paddingBlock: "4px",
            fontSize: "12px",
            top: "-45%",
            left: "50%",
            translate: "15px",
          }}
        >
          Close
        </span>
      </div>
      <div className="group relative inline-flex">
        <span
          className="pointer-events-none absolute z-50 whitespace-nowrap rounded border border-neutral-600 bg-neutral-800 opacity-0 shadow transition-opacity delay-0 duration-200 group-hover:opacity-100 group-hover:delay-500"
          role="tooltip"
          style={{
            marginTop: "4px",
            paddingInline: "8px",
            paddingBlock: "4px",
            fontSize: "12px",
            top: "-245%",
            left: "50%",
            translate: "-50%",
          }}
        >
          Open in new tab
        </span>
        <SquareArrowOutUpRightIcon
          size={14}
          className="cursor-pointer"
          onClick={() =>
            browser.runtime.sendMessage({ action: ACTIONS.OPEN_DASHBOARD })
          }
        />
      </div>
    </div>
  );
};
