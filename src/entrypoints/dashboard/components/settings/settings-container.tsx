import { useState, useEffect } from "react";
import type { Setting } from "@/entrypoints/utils/types";
import { getAllSettings } from "@/entrypoints/indexed-db/settings";
import { Loading } from "@/entrypoints/components/loading";
import { Error } from "@/entrypoints/components/error";
import { SettingCard } from "./setting-card";
import { Import } from "./import-export/import";
import { Export } from "./import-export/export";
import { DeleteAll } from "./delete-all/delete-all";

export const SettingsContainer = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const settings = await getAllSettings();
        if (!settings) {
          setError(true);
          setIsLoading(false);
          return;
        }
        const sortedSettings = settings.sort((a, b) => {
          return (
            Number(typeof b.value === "boolean") -
            Number(typeof a.value === "boolean")
          );
        });
        setSettings(sortedSettings);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
        return;
      }
    };
    fetchSettings();
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <div className="py-8 max-w-4xl m-auto">
      <div className="flex flex-col justify-center border-b border-neutral-700">
        {settings.length > 0 && (
          <div className="flex flex-col">
            {settings.map((setting) => {
              return (
                <div key={setting.key}>
                  {setting.key === "Extension" && (
                    <SettingCard
                      heading="Extension"
                      description="Enable or disable the extension"
                      setting={setting}
                      type="switch"
                    />
                  )}
                  {setting.key === "Notifications" && (
                    <SettingCard
                      heading="Notifications"
                      description="Receive notifications when new videos are uploaded"
                      setting={setting}
                      type="switch"
                    />
                  )}
                  {setting.key === "openAs" && (
                    <SettingCard
                      heading="Open as"
                      description="Select how you want the extension to open"
                      setting={setting}
                      type="select"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Import />
      <Export />
      <DeleteAll />
    </div>
  );
};
