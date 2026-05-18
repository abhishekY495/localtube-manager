import { useEffect, useState } from "react";
import { exportDatabaseToJson } from "@/entrypoints/indexed-db/settings";
import { EXPORT_FILE_NAME } from "@/entrypoints/utils/constants";
import { formatFileSize } from "@/entrypoints/utils/format-file-size";
import { DownloadIcon } from "lucide-react";
import toast from "react-hot-toast";

export const Export = () => {
  const [databaseJson, setDatabaseJson] = useState<string | null>(null);
  const [jsonSize, setJsonSize] = useState<number>(0);

  const exportButtonHandler = async () => {
    if (databaseJson) {
      const blob = new Blob([databaseJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = EXPORT_FILE_NAME;
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
      toast.success("Database exported successfully");
    } else {
      toast.error("Something went wrong,\n Refresh and try again");
    }
  };

  useEffect(() => {
    const fetchDatabase = async () => {
      try {
        const json = await exportDatabaseToJson();
        setDatabaseJson(json);
        const blob = new Blob([json], { type: "application/json" });
        setJsonSize(blob.size);
      } catch (error) {
        console.error("Failed to export database to json:", error);
      }
    };
    fetchDatabase();
  }, []);

  return (
    <div className="flex flex-col gap-4 border-b border-neutral-700 pt-5 pb-8">
      <p className="text-2xl font-medium">Export</p>
      <div className="bg-neutral-900 flex flex-col gap-3 rounded p-6">
        <p className="text-lg font-medium text-neutral-300 underline underline-offset-4 decoration-neutral-500">
          {EXPORT_FILE_NAME} - {formatFileSize(jsonSize)}
        </p>
        <button
          className="text-base font-medium bg-neutral-200 text-neutral-900 rounded cursor-pointer flex items-center gap-2 w-fit py-1.5 px-5"
          onClick={exportButtonHandler}
        >
          <DownloadIcon size={16} />
          Export
        </button>
      </div>
    </div>
  );
};
