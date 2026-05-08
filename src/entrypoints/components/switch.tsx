import toast from "react-hot-toast";
import { ACTIONS, DEFAULT_SETTINGS } from "../utils/constants";
import type { Message, Response } from "../utils/types";

export const Switch = ({
  keyName,
  checked,
  onCheckedChange,
}: {
  keyName: keyof typeof DEFAULT_SETTINGS;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => {
  const handleCheckedChange = async () => {
    onCheckedChange(!checked);
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.UPDATE_SETTING,
      data: { key: keyName, value: !checked },
    } satisfies Message);
    if (!response.success) {
      console.error("Failed to update setting:", response.error);
      return;
    }
    if (keyName === "Extension") {
      toast.success(
        `Extension ${!checked ? "enabled \n Reloading in 3 seconds..." : "disabled \n Reloading in 3 seconds..."}`,
      );
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      return;
    }
    if (keyName === "Notifications") {
      toast.success(`Notifications ${!checked ? "enabled" : "disabled"}`);
      return;
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={` ${checked ? "bg-neutral-100" : "bg-neutral-700"} rounded-full cursor-pointer `}
        style={{
          padding: "3px",
          width: "50px",
          height: "26px",
        }}
        onClick={handleCheckedChange}
      >
        <div
          className={`${checked ? "bg-neutral-700" : "bg-neutral-100"} rounded-full dura cursor-pointer`}
          style={{
            transform: checked ? "translateX(100%)" : "translateX(0%)",
            width: "22px",
            height: "20px",
            transition: "all 0.2s ease-in-out",
          }}
        ></div>
      </div>
    </div>
  );
};
