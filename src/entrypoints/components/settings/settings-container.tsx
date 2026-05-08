import { useState, useEffect } from "react";
import { Error } from "../error";
import { Loading } from "../loading";
import type { Message, Response, Setting } from "@/entrypoints/utils/types";
import { ACTIONS } from "@/entrypoints/utils/constants";
import { SwitchSettingCard } from "./switch-setting-card";
import { Export } from "./import-export/export";
import { Import } from "./import-export/import";
import { DeleteAll } from "./delete-all/delete-all";

export const SettingsContainer = ({
  isSidebarOpen,
  refreshKey,
  onRefresh,
}: {
  isSidebarOpen: boolean;
  refreshKey: number;
  onRefresh: () => void;
}) => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const fetchSettings = async () => {
      setIsLoading(true);
      setError(false);
      const response: Response<Setting[]> = await browser.runtime.sendMessage({
        action: ACTIONS.GET_ALL_SETTINGS,
      } satisfies Message);
      if (!response.success) {
        setError(true);
        setIsLoading(false);
        return;
      }
      const sortedSettings = response.data.sort((a, b) => {
        return (
          Number(typeof b.value === "boolean") -
          Number(typeof a.value === "boolean")
        );
      });
      setSettings(sortedSettings);
      setIsLoading(false);
    };
    fetchSettings();
  }, [isSidebarOpen, refreshKey]);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <div
      className="h-full min-h-0 overflow-y-auto"
      style={{ padding: "32px 32px 50px 32px" }}
    >
      <div
        className="flex flex-col justify-center border-b border-neutral-700"
      >
        {settings.length > 0 && (
          <div className="flex flex-col">
            {settings.map((setting) => {
              return (
                <div key={setting.key}>
                  {setting.key == "Extension" && (
                    <SwitchSettingCard
                      heading="Extension"
                      description="Enable or disable the extension"
                      setting={setting}
                    />
                  )}
                  {setting.key == "Notifications" && (
                    <SwitchSettingCard
                      heading="Notifications"
                      description="Receive notifications when new videos are uploaded"
                      setting={setting}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Import onRefresh={onRefresh} />
      <Export />
      <DeleteAll onRefresh={onRefresh} />
    </div>
  );
};
