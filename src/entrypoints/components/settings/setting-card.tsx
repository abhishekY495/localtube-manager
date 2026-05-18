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
    <div
      className="flex flex-col bg-neutral-800 rounded"
      style={{ padding: "15px 24px", marginBottom: "30px" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p style={{ fontWeight: 500, fontSize: "18px" }}>{heading}</p>
          <p className="text-neutral-400">{description}</p>
        </div>
        {type === "switch" && <Switch setting={setting} />}
        {type === "select" && <Select setting={setting} />}
      </div>
    </div>
  );
};
