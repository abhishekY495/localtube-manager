import { useState } from "react";
import { updateSetting } from "@/entrypoints/indexed-db/settings";
import type { Setting } from "@/entrypoints/utils/types";
import toast from "react-hot-toast";

export const Switch = ({ setting }: { setting: Setting }) => {
  const [isChecked, setIsChecked] = useState(
    typeof setting.value === "boolean" ? setting.value : false,
  );

  const handleCheckedChange = async () => {
    setIsChecked(!isChecked);
    try {
      await updateSetting(setting.key, !isChecked);
      if (setting.key === "Extension") {
        toast.success(`Extension ${!isChecked ? "enabled" : "disabled"}`);
        return;
      }
      if (setting.key === "Notifications") {
        toast.success(`Notifications ${!isChecked ? "enabled" : "disabled"}`);
        return;
      }
    } catch (error) {
      console.error("Failed to update setting:", error);
      return;
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={` ${isChecked ? "bg-neutral-100" : "bg-neutral-600"} rounded-full cursor-pointer p-[3px] w-[50px] h-[26px]`}
        onClick={handleCheckedChange}
      >
        <div
          className={`${isChecked ? "bg-neutral-700 translate-x-full" : "bg-neutral-100 translate-x-[2px]"} rounded-full cursor-pointer w-[22px] h-[20px] transition-all duration-200`}
        ></div>
      </div>
    </div>
  );
};
