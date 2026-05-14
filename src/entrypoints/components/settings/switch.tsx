import { useState } from "react";
import toast from "react-hot-toast";
import { ACTIONS } from "../../utils/constants";
import type { Message, Response, Setting } from "../../utils/types";

export const Switch = ({ setting }: { setting: Setting }) => {
  const [isChecked, setIsChecked] = useState(
    typeof setting.value === "boolean" ? setting.value : false,
  );

  const handleCheckedChange = async () => {
    setIsChecked(!isChecked);
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.UPDATE_SETTING,
      data: { key: setting.key, value: !isChecked },
    } satisfies Message);
    if (!response.success) {
      console.error("Failed to update setting:", response.error);
      return;
    }
    if (setting.key === "Extension") {
      toast.success(
        `Extension ${!isChecked ? "enabled \n Reloading in 3 seconds..." : "disabled \n Reloading in 3 seconds..."}`,
      );
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      return;
    }
    if (setting.key === "Notifications") {
      toast.success(`Notifications ${!isChecked ? "enabled" : "disabled"}`);
      return;
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={` ${isChecked ? "bg-neutral-100" : "bg-neutral-700"} rounded-full cursor-pointer `}
        style={{
          padding: "3px",
          width: "50px",
          height: "26px",
        }}
        onClick={handleCheckedChange}
      >
        <div
          className={`${isChecked ? "bg-neutral-700" : "bg-neutral-100"} rounded-full dura cursor-pointer`}
          style={{
            transform: isChecked ? "translateX(100%)" : "translateX(0%)",
            width: "22px",
            height: "20px",
            transition: "all 0.2s ease-in-out",
          }}
        ></div>
      </div>
    </div>
  );
};
