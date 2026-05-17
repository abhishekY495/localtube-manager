import { useState } from "react";
import { updateSetting } from "@/entrypoints/indexed-db/settings";
import type { OpenAs, Setting } from "@/entrypoints/utils/types";
import chevronDownIcon from "@/assets/chevron-down-icon.svg?raw";
import toast from "react-hot-toast";

const chevronDownIconImage = `url("data:image/svg+xml,${encodeURIComponent(chevronDownIcon)}")`;

export const Select = ({ setting }: { setting: Setting }) => {
  const [selectedOption, setSelectedOption] = useState<OpenAs>(
    setting.value as OpenAs,
  );

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setSelectedOption(e.target.value as OpenAs);
      await updateSetting(setting.key, e.target.value as OpenAs);
      toast.success("Setting updated successfully");
    } catch (error) {
      console.error("Failed to update setting:", error);
      return;
    }
  };

  return (
    <select
      value={selectedOption}
      onChange={handleChange}
      className="text-sm font-medium bg-neutral-800 text-neutral-100 rounded cursor-pointer outline-none ring-0 focus:border-neutral-700 focus:outline-none focus:ring-0 focus-visible:outline-none py-2 px-4 pr-10 border border-neutral-700"
      style={{
        appearance: "none",
        WebkitAppearance: "none",
        backgroundImage: chevronDownIconImage,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
        backgroundSize: "16px",
      }}
    >
      <option value="sidebar">Sidebar</option>
      <option value="new-tab">New Tab - Dashboard</option>
    </select>
  );
};
