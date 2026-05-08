import { useState } from "react";
import type { Setting } from "@/entrypoints/utils/types";
import { Switch } from "../switch";

export const SwitchSettingCard = ({
  heading,
  description,
  setting,
}: {
  heading: string;
  description: string;
  setting: Setting;
}) => {
  const [isChecked, setIsChecked] = useState(
    typeof setting.value === "boolean" ? setting.value : false,
  );

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
        <Switch
          keyName={setting.key}
          checked={isChecked}
          onCheckedChange={setIsChecked}
        />
      </div>
    </div>
  );
};
