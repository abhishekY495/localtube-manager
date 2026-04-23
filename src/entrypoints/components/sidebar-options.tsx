import { RotateCwIcon, XIcon } from "lucide-react";

export const SidebarOptions = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  return (
    <div className="absolute -left-8 top-2 bg-neutral-900 border border-neutral-700 flex flex-col gap-3 p-1.5 py-2.5 pl-2 pb-3 rounded-l-lg">
      <XIcon
        size={16}
        className="text-white cursor-pointer"
        onClick={() => setIsOpen(false)}
      />
      <RotateCwIcon size={14} className="text-white cursor-pointer" />
    </div>
  );
};
