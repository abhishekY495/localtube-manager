import { useState } from "react";
import type { Setting } from "@/entrypoints/utils/types";
import { Switch } from "../switch";

export const SettingCard = ({
  message,
  setting,
}: {
  message: string;
  setting: Setting;
}) => {
  const [isChecked, setIsChecked] = useState(setting.value);

  return (
    <div
      className="flex flex-col bg-neutral-800 rounded"
      style={{ padding: "15px 24px" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p style={{ fontWeight: 500, fontSize: "18px" }}>{setting.key}</p>
          <p className="text-neutral-400">{message}</p>
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
