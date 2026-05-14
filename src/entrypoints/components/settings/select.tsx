import { useState } from "react";
import type {
  Message,
  OpenAs,
  Response,
  Setting,
} from "@/entrypoints/utils/types";
import { ACTIONS } from "@/entrypoints/utils/constants";
import chevronDownIcon from "@/assets/chevron-down-icon.svg?raw";
import toast from "react-hot-toast";

const chevronDownIconImage = `url("data:image/svg+xml,${encodeURIComponent(chevronDownIcon)}")`;

export const Select = ({ setting }: { setting: Setting }) => {
  const [selectedOption, setSelectedOption] = useState<OpenAs>(
    setting.value as OpenAs,
  );

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value as OpenAs);
    const response: Response = await browser.runtime.sendMessage({
      action: ACTIONS.UPDATE_SETTING,
      data: { key: setting.key, value: e.target.value as OpenAs },
    } satisfies Message);
    if (!response.success) {
      console.error("Failed to update setting:", response.error);
      return;
    }
    toast.success("Setting updated successfully");
  };

  return (
    <select
      value={selectedOption}
      onChange={handleChange}
      className="bg-neutral-800 text-neutral-100 rounded cursor-pointer outline-none ring-0 focus:border-neutral-700 focus:outline-none focus:ring-0 focus-visible:outline-none"
      style={{
        padding: "8px 38px 8px 12px",
        border: "1px solid #4b4b4b",
        fontSize: "14px",
        fontWeight: 500,
        color: "#fff",
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
