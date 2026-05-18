import type { Setting } from "@/entrypoints/utils/types";
import { Switch } from "./switch";
import { Select } from "./select";

export const SettingCard = ({
  heading,
  description,
  setting,
  type,
}: {
  heading: string;
  description: string;
  setting: Setting;
  type: "switch" | "select";
}) => {
  return (
    <div className="flex flex-col bg-neutral-900 rounded py-4 px-6 mb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-medium">{heading}</p>
          <p className="text-sm text-neutral-400">{description}</p>
        </div>
        {type === "switch" && <Switch setting={setting} />}
        {type === "select" && <Select setting={setting} />}
      </div>
    </div>
  );
};
