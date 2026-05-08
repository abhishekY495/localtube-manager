import { RotateCwIcon, XIcon } from "lucide-react";

export const SidebarOptions = ({
  setIsOpen,
  onRefresh,
}: {
  setIsOpen: (isOpen: boolean) => void;
  onRefresh: () => void;
}) => {
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
      <div className="group relative inline-flex">
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
        <XIcon
          size={16}
          className="cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
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
          Refresh
        </span>
        <RotateCwIcon
          size={16}
          className="cursor-pointer"
          onClick={onRefresh}
        />
      </div>
    </div>
  );
};
