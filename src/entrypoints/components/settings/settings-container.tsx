import { useState, useEffect } from "react";
import { Error } from "../error";
import { Loading } from "../loading";
import type { Message, Response, Setting } from "@/entrypoints/utils/types";
import { ACTIONS } from "@/entrypoints/utils/constants";
import { SettingCard } from "./setting-card";
import { Export } from "./import-export/export";
import { Import } from "./import-export/import";

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
      setSettings(response.data);
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
      className="min-h-0 overflow-y-auto"
      style={{ padding: "32px 32px 50px 32px" }}
    >
      <div
        className="flex flex-col justify-center border-b border-neutral-700"
        style={{ paddingBottom: "30px", marginBottom: "20px" }}
      >
        {settings.length > 0 && (
          <div className="flex flex-col gap-10">
            {settings.map((setting) => {
              return (
                <>
                  {setting.key == "Extension" && (
                    <SettingCard
                      message="Enable or disable extension"
                      setting={setting}
                    />
                  )}
                  {setting.key == "Notifications" && (
                    <SettingCard
                      message="Receive notifications when new videos are uploaded"
                      setting={setting}
                    />
                  )}
                </>
              );
            })}
          </div>
        )}
      </div>
      <Import onRefresh={onRefresh} />
      <Export />
    </div>
  );
};
