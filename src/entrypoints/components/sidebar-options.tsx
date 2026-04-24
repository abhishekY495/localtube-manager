import { RotateCwIcon, SquareArrowOutUpRightIcon, XIcon } from "lucide-react";

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
        gap: "15px",
        padding: "6px",
        paddingBlock: "10px",
        paddingLeft: "8px",
        paddingBottom: "12px",
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
      }}
    >
      <XIcon
        size={16}
        className="cursor-pointer"
        onClick={() => setIsOpen(false)}
      />
      <SquareArrowOutUpRightIcon size={14} className="cursor-pointer" />
      <RotateCwIcon size={14} className="cursor-pointer" />
    </div>
  );
};
